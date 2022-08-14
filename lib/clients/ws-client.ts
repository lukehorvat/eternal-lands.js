import WebSocket from 'isomorphic-ws';
import Emittery from 'emittery';
import {
  ServerPacket,
  ServerPacketData,
  ServerPacketType,
} from '../packets/server';
import {
  ClientPacket,
  ClientPacketData,
  ClientPacketType,
} from '../packets/client';

type ClientOptions = { url: string };
type ClientConnectionEvents = Record<'CONNECT' | 'DISCONNECT', undefined>;

export class WebSocketClient {
  private readonly options: ClientOptions;
  private readonly connectionEvents: Emittery<ClientConnectionEvents>;
  private readonly clientEvents: Emittery<ClientPacketData>;
  private readonly serverEvents: Emittery<ServerPacketData>;
  private socket?: WebSocket;

  constructor(options: ClientOptions) {
    this.options = options;
    this.connectionEvents = new Emittery();
    this.clientEvents = new Emittery();
    this.serverEvents = new Emittery();
  }

  async connect(): Promise<void> {
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
            this.connectionEvents.emit('CONNECT');
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
          this.connectionEvents.emit('DISCONNECT');
        };
        const onSocketData = (event: WebSocket.MessageEvent) => {
          const buffer = Buffer.from(event.data as ArrayBuffer);
          const { packets, remainingBuffer } = ServerPacket.fromBuffer(
            // Prepend any partial (overflow/underflow) packet data received previously.
            Buffer.concat([previousBuffer, buffer])
          );
          packets.forEach((packet) => {
            this.serverEvents.emit(packet.type, packet.data);
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

  async disconnect(): Promise<void> {
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

  get isConnected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN;
  }

  async send<Type extends ClientPacketType>(
    type: Type,
    data: ClientPacketData[Type]
  ): Promise<ClientPacketData[Type]> {
    if (!this.isConnected) {
      throw new Error('Cannot send when disconnected!');
    }

    // Force a tick of the event loop so that the "sent" event gets
    // emitted async. We need to do this because `WebSocket.send()`
    // doesn't have a callback (unlike Node.js sockets), and we want
    // userland to assume that `send()` is an async task.
    await Promise.resolve();

    const packet = new ClientPacket(type, data);
    this.socket!.send(packet.toBuffer());
    this.clientEvents.emit(type, data);
    return data;
  }

  onConnect(listener: () => void): () => void {
    return this.connectionEvents.on('CONNECT', listener);
  }

  onDisconnect(listener: () => void): () => void {
    return this.connectionEvents.on('DISCONNECT', listener);
  }

  onSend<Type extends ClientPacketType>(
    type: Type,
    listener: (data: ClientPacketData[Type]) => void
  ): () => void {
    return this.clientEvents.on(type, listener);
  }

  onSendOnce<Type extends ClientPacketType>(
    type: Type
  ): Promise<ClientPacketData[Type]> {
    return this.clientEvents.once(type);
  }

  onSendAny(
    listener: (
      type: ClientPacketType,
      data: ClientPacketData[ClientPacketType]
    ) => void
  ): () => void {
    return this.clientEvents.onAny(listener);
  }

  onReceive<Type extends ServerPacketType>(
    type: Type,
    listener: (data: ServerPacketData[Type]) => void
  ): () => void {
    return this.serverEvents.on(type, listener);
  }

  onReceiveOnce<Type extends ServerPacketType>(
    type: Type
  ): Promise<ServerPacketData[Type]> {
    return this.serverEvents.once(type);
  }

  onReceiveAny(
    listener: (
      type: ServerPacketType,
      data: ServerPacketData[ServerPacketType]
    ) => void
  ): () => void {
    return this.serverEvents.onAny(listener);
  }
}
