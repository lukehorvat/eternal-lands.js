import Emittery from 'emittery';
import { ServerPacketData, ServerPacketType } from '../packets/server';
import { ClientPacketData, ClientPacketType } from '../packets/client';

type ClientConnectionEvents = Record<'CONNECT' | 'DISCONNECT', undefined>;

export abstract class BaseClient {
  private readonly connectionEvents: Emittery<ClientConnectionEvents>;
  private readonly clientEvents: Emittery<ClientPacketData>;
  private readonly serverEvents: Emittery<ServerPacketData>;

  constructor() {
    this.connectionEvents = new Emittery();
    this.clientEvents = new Emittery();
    this.serverEvents = new Emittery();
  }

  abstract connect(): Promise<void>;

  abstract disconnect(): Promise<void>;

  abstract get isConnected(): boolean;

  abstract send<Type extends ClientPacketType>(
    type: Type,
    data: ClientPacketData[Type]
  ): Promise<ClientPacketData[Type]>;

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

  /**
   * Subclasses should call this method after connecting.
   */
  protected emitConnectEvent(): void {
    this.connectionEvents.emit('CONNECT');
  }

  /**
   * Subclasses should call this method after disconnecting.
   */
  protected emitDisconnectEvent(): void {
    this.connectionEvents.emit('DISCONNECT');
  }

  /**
   * Subclasses should call this method after sending a packet.
   */
  protected emitSendEvent<Type extends ClientPacketType>(
    type: Type,
    data: ClientPacketData[Type]
  ): void {
    this.clientEvents.emit(type, data);
  }

  /**
   * Subclasses should call this method after receiving a packet.
   */
  protected emitReceiveEvent<Type extends ServerPacketType>(
    type: Type,
    data: ServerPacketData[Type]
  ): void {
    this.serverEvents.emit(type, data);
  }
}
