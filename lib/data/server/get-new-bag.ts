import { BufferReader, BufferWriter } from 'easy-buffer';
import { PacketDataParser } from '../packets';

export type Data = {
  x: number;
  y: number;
  bagId: number;
};

export const DataParser: PacketDataParser<Data> = {
  fromBuffer(dataBuffer: Buffer) {
    const reader = new BufferReader(dataBuffer);
    return {
      x: reader.read({ type: 'UInt16LE' }),
      y: reader.read({ type: 'UInt16LE' }),
      bagId: reader.read({ type: 'UInt8' }),
    };
  },

  toBuffer(data) {
    return new BufferWriter()
      .write({ type: 'UInt16LE', value: data.x })
      .write({ type: 'UInt16LE', value: data.y })
      .write({ type: 'UInt8', value: data.bagId })
      .buffer();
  },
};
