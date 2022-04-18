import EventEmitter from 'events';
import TypedEmitter from 'typed-emitter';
import { ClientPacketType, ServerPacketType } from './types';
import { ClientPacketData, ServerPacketData, packetDataParsers } from './data';
import { Packet } from './packet';

type ClientPacketEvents = {
  [Type in ClientPacketType]: (...data: ClientPacketData[Type]) => void;
};

type ServerPacketEvents = {
  [Type in ServerPacketType]: (...data: ServerPacketData[Type]) => void;
} & {
  unsupported: (packet: Packet) => void;
};

export class ClientPacketEventEmitter extends (EventEmitter as {
  new (): TypedEmitter<ClientPacketEvents>;
}) {
  private sendPacket: (packet: Packet) => void;

  constructor(sendPacket: (packet: Packet) => void) {
    super();
    this.sendPacket = sendPacket;
  }

  emit<Type extends keyof ClientPacketEvents>(
    type: Type,
    ...data: Parameters<ClientPacketEvents[Type]>
  ) {
    if (!(type in ClientPacketType)) {
      throw new Error(`Unsupported packet type '${type}'.`);
    }

    const dataBuffer = packetDataParsers.client[type].toBuffer(...data);
    const packet = new Packet(type, dataBuffer);
    this.sendPacket(packet);

    return super.emit(type, ...data);
  }
}

export class ServerPacketEventEmitter extends (EventEmitter as {
  new (): TypedEmitter<ServerPacketEvents>;
}) {
  receivePacket(packet: Packet) {
    const type = packet.type as ServerPacketType;

    if (!(type in ServerPacketType)) {
      this.emit('unsupported', packet);
      return;
    }

    const data = packetDataParsers.server[type].fromBuffer(packet.dataBuffer);
    this.emit(type, ...data);
  }
}
