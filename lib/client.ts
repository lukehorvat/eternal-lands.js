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

type ClientOptions = {
  host?: string;
  port?: number;
};

enum ClientConnectionState {
  CONNECTING,
  CONNECTED,
  DISCONNECTING,
  DISCONNECTED,
}

export class Client {
  private readonly options?: ClientOptions;
  private readonly socket: Socket;
  private readonly clientEvents: Emittery<ClientPacketData>;
  private readonly serverEvents: Emittery<ServerPacketData>;
  private connectionState: ClientConnectionState;

  constructor(options?: ClientOptions) {
    this.options = options;
    this.socket = new Socket();
    this.clientEvents = new Emittery<ClientPacketData>();
    this.serverEvents = new Emittery<ServerPacketData>();
    this.connectionState = ClientConnectionState.DISCONNECTED;
  }

  connect(): Promise<void> {
    switch (this.connectionState) {
      case ClientConnectionState.DISCONNECTED:
        this.connectionState = ClientConnectionState.CONNECTING;
        return new Promise<void>((resolve, reject) => {
          const onSocketConnect = () => {
            this.connectionState = ClientConnectionState.CONNECTED;
            this.socket.off('error', onSocketError);
            resolve();
          };
          const onSocketError = (err: Error) => {
            this.connectionState = ClientConnectionState.DISCONNECTED;
            this.socket.off('connect', onSocketConnect);
            reject(err);
          };

          this.socket
            .once('connect', onSocketConnect)
            .once('error', onSocketError)
            .connect(
              this.options?.port ?? ServerPort.TEST_SERVER,
              this.options?.host ?? SERVER_HOST
            );
        }).then(() => {
          let previousBuffer = Buffer.alloc(0);
          const onSocketDisconnect = () => {
            // In case the socket is reconnected later, reset some state.
            this.socket.off('data', onSocketData);
            this.connectionState = ClientConnectionState.DISCONNECTED;
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

          this.socket
            .once('close', onSocketDisconnect)
            .on('data', onSocketData);
        });
      case ClientConnectionState.CONNECTING:
        return Promise.reject(
          new Error('Already in the process of connecting!')
        );
      case ClientConnectionState.CONNECTED:
        return Promise.reject(new Error('Already connected!'));
      case ClientConnectionState.DISCONNECTING:
        return Promise.reject(
          new Error('Cannot connect whilst in the process of disconnecting!')
        );
    }
  }

  disconnect(): Promise<void> {
    switch (this.connectionState) {
      case ClientConnectionState.CONNECTED:
        this.connectionState = ClientConnectionState.DISCONNECTING;
        return new Promise((resolve) => {
          this.socket.end().once('close', () => {
            this.connectionState = ClientConnectionState.DISCONNECTED;
            resolve();
          });
        });
      case ClientConnectionState.DISCONNECTED:
        return Promise.reject(new Error('Already disconnected!'));
      case ClientConnectionState.DISCONNECTING:
        return Promise.reject(
          new Error('Already in the process of disconnecting!')
        );
      case ClientConnectionState.CONNECTING:
        return Promise.reject(
          new Error('Cannot disconnect whilst in the process of connecting!')
        );
    }
  }

  get isConnected() {
    return this.connectionState === ClientConnectionState.CONNECTED;
  }

  send<Type extends ClientPacketType>(
    type: Type,
    data: ClientPacketData[Type]
  ): Promise<ClientPacketData[Type]> {
    if (!this.isConnected) {
      return Promise.reject(
        new Error('Cannot send packets when disconnected!')
      );
    }

    return new Promise<void>((resolve, reject) => {
      const packet = new ClientPacket(type, data);
      this.socket.write(packet.toBuffer(), (err) => {
        if (err) return reject(err);
        resolve();
      });
    }).then(() => {
      this.clientEvents.emit(type, data);
      return data;
    });
  }

  onConnect(listener: () => void): () => void {
    this.socket.on('connect', listener);
    return () => this.socket.off('connect', listener);
  }

  onDisconnect(listener: () => void): () => void {
    this.socket.on('close', listener);
    return () => this.socket.off('close', listener);
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
