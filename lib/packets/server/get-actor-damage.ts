import { BufferReader, BufferWriter } from 'easy-buffer';
import { PacketDataParser } from '../common';

export type Data = {
  actorId: number;
  damageAmount: number;
};

export const DataParser: PacketDataParser<Data> = {
  fromBuffer(dataBuffer: Buffer) {
    const reader = new BufferReader(dataBuffer);
    return {
      actorId: reader.read({ type: 'UInt16LE' }),
      damageAmount: reader.read({ type: 'UInt16LE' }),
    };
  },

  toBuffer(data) {
    return new BufferWriter()
      .write({ type: 'UInt16LE', value: data.actorId })
      .write({ type: 'UInt16LE', value: data.damageAmount })
      .buffer();
  },
};
