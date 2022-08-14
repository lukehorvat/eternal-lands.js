import { Socket } from 'net';
import { BaseClient } from './base-client';
import { ServerPacket } from '../packets/server';
import {
  ClientPacket,
  ClientPacketData,
  ClientPacketType,
} from '../packets/client';
import { SERVER_HOST, ServerPort } from '../constants';

type ClientOptions = { host?: string; port?: number };

export class TcpSocketClient extends BaseClient {
  private readonly options?: ClientOptions;
  private socket?: Socket;

  constructor(options?: ClientOptions) {
    super();
    this.options = options;
  }

  override async connect(): Promise<void> {
    switch (this.socket?.readyState) {
      case 'open':
        throw new Error('Already connected!');
      case 'opening':
        throw new Error('Already in the process of connecting!');
      case 'readOnly':
      case 'writeOnly':
        throw new Error(
          'Cannot connect whilst in the process of disconnecting!'
        );
      case 'closed':
      default:
        await new Promise<void>((resolve, reject) => {
          const onSocketConnect = () => {
            this.emitConnectEvent();
            this.socket!.off('error', onSocketError);
            resolve();
          };
          const onSocketError = (err: Error) => {
            reject(err);
          };

          this.socket = new Socket()
            .once('connect', onSocketConnect)
            .once('error', onSocketError)
            .connect(
              this.options?.port ?? ServerPort.TEST_SERVER,
              this.options?.host ?? SERVER_HOST
            );
        });

        let previousBuffer = Buffer.alloc(0);
        const onSocketDisconnect = () => {
          this.emitDisconnectEvent();
        };
        const onSocketData = (buffer: Buffer) => {
          const { packets, remainingBuffer } = ServerPacket.fromBuffer(
            // Prepend any partial (overflow/underflow) packet data received previously.
            Buffer.concat([previousBuffer, buffer])
          );
          packets.forEach((packet) => {
            this.emitReceiveEvent(packet.type, packet.data);
          });
          previousBuffer = remainingBuffer;
        };

        this.socket!.once('close', onSocketDisconnect).on('data', onSocketData);
        return;
    }
  }

  override async disconnect(): Promise<void> {
    switch (this.socket?.readyState) {
      case 'open':
        return new Promise<void>((resolve) => {
          this.socket!.once('close', () => resolve()).end();
        });
      case 'opening':
        throw new Error(
          'Cannot disconnect whilst in the process of connecting!'
        );
      case 'readOnly':
      case 'writeOnly':
        throw new Error('Already in the process of disconnecting!');
      case 'closed':
      default:
        throw new Error('Already disconnected!');
    }
  }

  override get isConnected(): boolean {
    return this.socket?.readyState === 'open';
  }

  override async send<Type extends ClientPacketType>(
    type: Type,
    data: ClientPacketData[Type]
  ): Promise<ClientPacketData[Type]> {
    if (!this.isConnected) {
      throw new Error('Cannot send when disconnected!');
    }

    const packet = new ClientPacket(type, data);
    await new Promise<void>((resolve, reject) => {
      this.socket!.write(packet.toBuffer(), (err) =>
        err ? reject(err) : resolve()
      );
    });
    this.emitSendEvent(type, data);
    return data;
  }
}
