import { Socket } from 'net';
import Emittery from 'emittery';
import {
  ServerPacket,
  ServerPacketData,
  ServerPacketType,
} from './data/server';
import {
  ClientPacket,
  ClientPacketData,
  ClientPacketType,
} from './data/client';
import { SERVER_HOST, ServerPort } from './constants';

type ConnectionOptions = {
  host?: string;
  port?: number;
};

enum ConnectionState {
  CONNECTING,
  CONNECTED,
  DISCONNECTING,
  DISCONNECTED,
}

export class Connection {
  private readonly options?: ConnectionOptions;
  private readonly socket: Socket;
  private readonly clientEvents: Emittery<ClientPacketData>;
  private readonly serverEvents: Emittery<ServerPacketData>;
  private connectionState: ConnectionState;

  constructor(options?: ConnectionOptions) {
    this.options = options;
    this.socket = new Socket();
    this.clientEvents = new Emittery<ClientPacketData>();
    this.serverEvents = new Emittery<ServerPacketData>();
    this.connectionState = ConnectionState.DISCONNECTED;
  }

  connect(): Promise<void> {
    switch (this.connectionState) {
      case ConnectionState.DISCONNECTED:
        this.connectionState = ConnectionState.CONNECTING;
        return new Promise<void>((resolve, reject) => {
          const onSocketConnect = () => {
            this.connectionState = ConnectionState.CONNECTED;
            this.socket.off('error', onSocketError);
            resolve();
          };
          const onSocketError = (err: Error) => {
            this.connectionState = ConnectionState.DISCONNECTED;
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
            this.connectionState = ConnectionState.DISCONNECTED;
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
      case ConnectionState.CONNECTING:
        return Promise.reject('Already in the process of connecting!');
      case ConnectionState.CONNECTED:
        return Promise.reject('Already connected!');
      case ConnectionState.DISCONNECTING:
        return Promise.reject(
          'Cannot connect whilst in the process of disconnecting!'
        );
    }
  }

  disconnect(): Promise<void> {
    switch (this.connectionState) {
      case ConnectionState.CONNECTED:
        this.connectionState = ConnectionState.DISCONNECTING;
        return new Promise((resolve) => {
          this.socket.end().once('close', () => {
            this.connectionState = ConnectionState.DISCONNECTED;
            resolve();
          });
        });
      case ConnectionState.DISCONNECTED:
        return Promise.reject('Already disconnected!');
      case ConnectionState.DISCONNECTING:
        return Promise.reject('Already in the process of disconnecting!');
      case ConnectionState.CONNECTING:
        return Promise.reject(
          'Cannot disconnect whilst in the process of connecting!'
        );
    }
  }

  get isConnected() {
    return this.connectionState === ConnectionState.CONNECTED;
  }

  send<Type extends ClientPacketType>(
    type: Type,
    data: ClientPacketData[Type]
  ): Promise<ClientPacketData[Type]> {
    if (!this.isConnected) {
      return Promise.reject('Cannot send packets when disconnected!');
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
