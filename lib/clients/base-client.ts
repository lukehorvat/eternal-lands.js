import Emittery from 'emittery';
import { ServerPacketData, ServerPacketType } from '../packets/server';
import { ClientPacketData, ClientPacketType } from '../packets/client';

type ClientConnectionEvents = Record<'CONNECT' | 'DISCONNECT', undefined>;
type UnsubscribeFn = () => void;

/**
 * Class describing a client that can connect to the EL server and send/receive
 * packets.
 *
 * It is an abstract "base" class and can't be instantiated directly. It's
 * existence is simply to enforce a particular structure on client subclasses.
 */
export abstract class BaseClient {
  private readonly connectionEvents: Emittery<ClientConnectionEvents>;
  private readonly clientEvents: Emittery<ClientPacketData>;
  private readonly serverEvents: Emittery<ServerPacketData>;

  constructor() {
    this.connectionEvents = new Emittery();
    this.clientEvents = new Emittery();
    this.serverEvents = new Emittery();
  }

  /**
   * Connect to the server.
   *
   * Returns a promise that is resolved once the client has connected.
   */
  abstract connect(): Promise<void>;

  /**
   * Disconnect from the server.
   *
   * Returns a promise that is resolved once the client has disconnected.
   */
  abstract disconnect(): Promise<void>;

  /**
   * A boolean representing the current connection status.
   */
  abstract get isConnected(): boolean;

  /**
   * Send a packet of a particular type to the server.
   *
   * Returns a promise that is resolved once the packet has been sent.
   */
  abstract send<Type extends ClientPacketType>(
    type: Type,
    data: ClientPacketData[Type]
  ): Promise<ClientPacketData[Type]>;

  /**
   * Listen to when the client connects to the server.
   *
   * Returns a function that can be called to unsubscribe the listener.
   */
  onConnect(listener: () => void): UnsubscribeFn {
    return this.connectionEvents.on('CONNECT', listener);
  }

  /**
   * Listen to when the client disconnects from the server.
   *
   * Returns a function that can be called to unsubscribe the listener.
   */
  onDisconnect(listener: () => void): UnsubscribeFn {
    return this.connectionEvents.on('DISCONNECT', listener);
  }

  /**
   * Listen to when the client sends a packet of a particular type to the server.
   *
   * Returns a function that can be called to unsubscribe the listener.
   */
  onSend<Type extends ClientPacketType>(
    type: Type,
    listener: (data: ClientPacketData[Type]) => void
  ): UnsubscribeFn {
    return this.clientEvents.on(type, listener);
  }

  /**
   * Listen to when the client sends a packet of a particular type to the server,
   * only _once_!
   *
   * Returns a Promise that is resolved with the packet's data.
   */
  onSendOnce<Type extends ClientPacketType>(
    type: Type
  ): Promise<ClientPacketData[Type]> {
    return this.clientEvents.once(type);
  }

  /**
   * Listen to when the client sends a packet of _any_ type to the server.
   *
   * Returns a function that can be called to unsubscribe the listener.
   */
  onSendAny(
    listener: (
      type: ClientPacketType,
      data: ClientPacketData[ClientPacketType]
    ) => void
  ): UnsubscribeFn {
    return this.clientEvents.onAny(listener);
  }

  /**
   * Listen to when the client receives a packet of a particular type from the server.
   *
   * Returns a function that can be called to unsubscribe the listener.
   */
  onReceive<Type extends ServerPacketType>(
    type: Type,
    listener: (data: ServerPacketData[Type]) => void
  ): UnsubscribeFn {
    return this.serverEvents.on(type, listener);
  }

  /**
   * Listen to when the client receives a packet of a particular type from the server,
   * only _once_!
   *
   * Returns a Promise that is resolved with the packet's data.
   */
  onReceiveOnce<Type extends ServerPacketType>(
    type: Type
  ): Promise<ServerPacketData[Type]> {
    return this.serverEvents.once(type);
  }

  /**
   * Listen to when the client receives a packet of _any_ type from the server.
   *
   * Returns a function that can be called to unsubscribe the listener.
   */
  onReceiveAny(
    listener: (
      type: ServerPacketType,
      data: ServerPacketData[ServerPacketType]
    ) => void
  ): UnsubscribeFn {
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
