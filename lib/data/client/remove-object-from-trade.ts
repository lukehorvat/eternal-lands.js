import { BufferReader, BufferWriter } from 'easy-buffer';
import { PacketDataParser } from '../packets';

export type Data = {
  position: number;
  quantity: number;
};

export const DataParser: PacketDataParser<Data> = {
  fromBuffer(dataBuffer: Buffer) {
    const reader = new BufferReader(dataBuffer);
    return {
      position: reader.read({ type: 'UInt8' }),
      quantity: reader.read({ type: 'UInt32LE' }),
    };
  },

  toBuffer(data) {
    return new BufferWriter()
      .write({ type: 'UInt8', value: data.position })
      .write({ type: 'UInt32LE', value: data.quantity })
      .buffer();
  },
};
