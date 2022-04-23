import Emittery from 'emittery';
import { ClientPacketType, ServerPacketType } from './types';
import { ClientPacketData, ServerPacketData, packetDataParsers } from './data';
import { Packet } from './packet';

export class ClientPacketEventEmitter extends Emittery<ClientPacketData> {
  constructor(sendPacket: (packet: Packet) => void) {
    super();

    this.onAny((type, data) => {
      if (!(type in ClientPacketType)) {
        throw new Error(`Unsupported packet type '${type}'.`);
      }

      const dataBuffer = packetDataParsers.client[type].toBuffer(data as any);
      const packet = new Packet(type, dataBuffer);
      sendPacket(packet);
    });
  }
}

export class ServerPacketEventEmitter extends Emittery<
  ServerPacketData & { UNSUPPORTED: Packet }
> {
  receivePacket(packet: Packet) {
    const type = packet.type as ServerPacketType;

    if (!(type in ServerPacketType)) {
      this.emit('UNSUPPORTED', packet);
      return;
    }

    const data = packetDataParsers.server[type].fromBuffer(packet.dataBuffer);
    this.emit(type, data);
  }
}
