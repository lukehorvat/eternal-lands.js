import WebSocket from 'isomorphic-ws';
import { BaseClient } from './base-client';
import { ServerPacket } from '../packets/server';
import {
  ClientPacket,
  ClientPacketData,
  ClientPacketType,
} from '../packets/client';

type ClientOptions = { url: string };

/**
 * Class representing a client that connects to the EL server via a WebSocket.
 *
 * Since there is no "official" WebSocket server for EL, there is no server it
 * can connect to by default. Therefore the server URL **must** be specified
 * via the constructor options.
 *
 * This client works both in a Node.js environment _and_ in a web browser.
 */
export class WebSocketClient extends BaseClient {
  private readonly options: ClientOptions;
  private socket?: WebSocket;

  constructor(options: ClientOptions) {
    super();
    this.options = options;
  }

  override async connect(): Promise<void> {
    switch (this.socket?.readyState) {
      case WebSocket.OPEN:
        throw new Error('Already connected!');
      case WebSocket.CONNECTING:
        throw new Error('Already in the process of connecting!');
      case WebSocket.CLOSING:
        throw new Error(
          'Cannot connect whilst in the process of disconnecting!'
        );
      case WebSocket.CLOSED:
      default:
        await new Promise<void>((resolve, reject) => {
          const onSocketConnect = () => {
            this.emitConnectEvent();
            this.socket!.removeEventListener('error', onSocketError);
            resolve();
          };
          const onSocketError = (event: WebSocket.ErrorEvent) => {
            reject(event.error);
          };

          this.socket = new WebSocket(this.options.url, ['binary']);
          this.socket.binaryType = 'arraybuffer';
          this.socket.addEventListener('open', onSocketConnect, { once: true });
          this.socket.addEventListener('error', onSocketError, { once: true });
        });

        let previousBuffer = Buffer.alloc(0);
        const onSocketDisconnect = () => {
          this.emitDisconnectEvent();
        };
        const onSocketData = (event: WebSocket.MessageEvent) => {
          const buffer = Buffer.from(event.data as ArrayBuffer);
          const { packets, remainingBuffer } = ServerPacket.fromBuffer(
            // Prepend any partial (overflow/underflow) packet data received previously.
            Buffer.concat([previousBuffer, buffer])
          );
          packets.forEach((packet) => {
            this.emitReceiveEvent(packet.type, packet.data);
          });
          previousBuffer = remainingBuffer;
        };

        this.socket!.addEventListener('close', onSocketDisconnect, {
          once: true,
        });
        this.socket!.addEventListener('message', onSocketData);
        return;
    }
  }

  override async disconnect(): Promise<void> {
    switch (this.socket?.readyState) {
      case WebSocket.OPEN:
        return new Promise<void>((resolve) => {
          this.socket!.addEventListener('close', () => resolve(), {
            once: true,
          });
          this.socket!.close(1000);
        });
      case WebSocket.CONNECTING:
        throw new Error(
          'Cannot disconnect whilst in the process of connecting!'
        );
      case WebSocket.CLOSING:
        throw new Error('Already in the process of disconnecting!');
      case WebSocket.CLOSED:
      default:
        throw new Error('Already disconnected!');
    }
  }

  override get isConnected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN;
  }

  override async send<Type extends ClientPacketType>(
    type: Type,
    data: ClientPacketData[Type]
  ): Promise<ClientPacketData[Type]> {
    if (!this.isConnected) {
      throw new Error('Cannot send when disconnected!');
    }

    const packet = new ClientPacket(type, data);
    this.socket!.send(packet.toBuffer());

    // Force a tick of the event loop so that the following event gets emitted
    // async. We need to do this because `WebSocket.send()` doesn't have a
    // callback (unlike Node.js sockets), and we want our `send()` to feel like
    // an async task in userland.
    await Promise.resolve();

    this.emitSendEvent(type, data);
    return data;
  }
}
