import { BufferReader, BufferWriter } from 'easy-buffer';
import { PacketDataParser } from '../packets';

export type Data = {
  bagId: number;
};

export const DataParser: PacketDataParser<Data> = {
  fromBuffer(dataBuffer: Buffer) {
    const reader = new BufferReader(dataBuffer);
    return {
      bagId: reader.read({ type: 'UInt8' }),
    };
  },

  toBuffer(data) {
    return new BufferWriter()
      .write({ type: 'UInt8', value: data.bagId })
      .buffer();
  },
};
