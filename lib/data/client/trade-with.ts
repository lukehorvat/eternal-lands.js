import { BufferReader, BufferWriter } from 'easy-buffer';
import { PacketDataParser } from '../packets';

export type PacketData = {
  actorId: number;
};

export const DataParser: PacketDataParser<PacketData> = {
  fromBuffer(dataBuffer: Buffer) {
    const reader = new BufferReader(dataBuffer);
    return {
      actorId: reader.read({ type: 'UInt32LE' }),
    };
  },

  toBuffer(data) {
    return new BufferWriter()
      .write({ type: 'UInt32LE', value: data.actorId })
      .buffer();
  },
};
