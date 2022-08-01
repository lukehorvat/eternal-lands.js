import Emittery from 'emittery';
import {
  ClientPacketData,
  ClientPacketDataParsers,
  ClientPacketType,
} from './data/client';
import {
  ServerPacketData,
  ServerPacketDataParsers,
  ServerPacketType,
} from './data/server';
import { Packet } from './data/packets';

export class ClientPacketEventEmitter extends Emittery<ClientPacketData> {
  constructor(sendPacket: (packet: Packet) => void) {
    super();

    this.onAny((type, data) => {
      if (!(type in ClientPacketType)) {
        throw new Error(`Unsupported packet type '${type}'.`);
      }

      const dataBuffer = ClientPacketDataParsers[type].toBuffer(data as any);
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

    const data = ServerPacketDataParsers[type].fromBuffer(packet.dataBuffer);
    this.emit(type, data);
  }
}
