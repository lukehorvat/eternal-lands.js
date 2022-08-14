import { Socket } from 'net';
import Emittery from 'emittery';
import {
  ServerPacket,
  ServerPacketData,
  ServerPacketType,
} from './packets/server';
import {
  ClientPacket,
  ClientPacketData,
  ClientPacketType,
} from './packets/client';
import { SERVER_HOST, ServerPort } from './constants';

type ClientOptions = { host?: string; port?: number };
type ClientConnectionEvents = Record<'CONNECT' | 'DISCONNECT', undefined>;

export class Client {
  private readonly options?: ClientOptions;
  private readonly connectionEvents: Emittery<ClientConnectionEvents>;
  private readonly clientEvents: Emittery<ClientPacketData>;
  private readonly serverEvents: Emittery<ServerPacketData>;
  private socket?: Socket;

  constructor(options?: ClientOptions) {
    this.options = options;
    this.connectionEvents = new Emittery();
    this.clientEvents = new Emittery();
    this.serverEvents = new Emittery();
  }

  async connect(): Promise<void> {
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
        return new Promise<void>((resolve, reject) => {
          let previousBuffer = Buffer.alloc(0);

          const onSocketConnect = () => {
            this.connectionEvents.emit('CONNECT');
            this.socket!.off('error', onSocketError);
            resolve();
          };
          const onSocketError = (err: Error) => {
            reject(err);
          };
          const onSocketDisconnect = () => {
            this.connectionEvents.emit('DISCONNECT');
          };
          const onSocketData = (buffer: Buffer) => {
            const { packets, remainingBuffer } = ServerPacket.fromBuffer(
              // Prepend any partial (overflow/underflow) packet data received previously.
              Buffer.concat([previousBuffer, buffer])
            );
            packets.forEach((packet) => {
              this.serverEvents.emit(packet.type, packet.data);
            });
            previousBuffer = remainingBuffer;
          };

          this.socket = new Socket()
            .once('connect', onSocketConnect)
            .once('error', onSocketError)
            .once('close', onSocketDisconnect)
            .on('data', onSocketData)
            .connect(
              this.options?.port ?? ServerPort.TEST_SERVER,
              this.options?.host ?? SERVER_HOST
            );
        });
    }
  }

  async disconnect(): Promise<void> {
    switch (this.socket?.readyState) {
      case 'open':
        return new Promise((resolve) => {
          this.socket!.end().once('close', () => {
            resolve();
          });
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

  get isConnected(): boolean {
    return this.socket?.readyState === 'open';
  }

  async send<Type extends ClientPacketType>(
    type: Type,
    data: ClientPacketData[Type]
  ): Promise<ClientPacketData[Type]> {
    if (!this.isConnected) {
      throw new Error('Cannot send when disconnected!');
    }

    const packet = new ClientPacket(type, data);
    await new Promise<void>((resolve, reject) => {
      this.socket!.write(packet.toBuffer(), (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
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
