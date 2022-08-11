import { BufferReader, BufferWriter } from 'easy-buffer';
import { PacketDataParser } from '../common';

export type Data = {
  x: number;
  y: number;
};

export const DataParser: PacketDataParser<Data> = {
  fromBuffer(dataBuffer: Buffer) {
    const reader = new BufferReader(dataBuffer);
    return {
      x: reader.read({ type: 'UInt16LE' }),
      y: reader.read({ type: 'UInt16LE' }),
    };
  },

  toBuffer(data) {
    return new BufferWriter()
      .write({ type: 'UInt16LE', value: data.x })
      .write({ type: 'UInt16LE', value: data.y })
      .buffer();
  },
};
