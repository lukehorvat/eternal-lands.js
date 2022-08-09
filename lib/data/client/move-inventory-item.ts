import { BufferReader, BufferWriter } from 'easy-buffer';
import { PacketDataParser } from '../packets';

export type Data = {
  positionFrom: number;
  positionTo: number;
};

export const DataParser: PacketDataParser<Data> = {
  fromBuffer(dataBuffer: Buffer) {
    const reader = new BufferReader(dataBuffer);
    return {
      positionFrom: reader.read({ type: 'UInt8' }),
      positionTo: reader.read({ type: 'UInt8' }),
    };
  },

  toBuffer(data) {
    return new BufferWriter()
      .write({ type: 'UInt8', value: data.positionFrom })
      .write({ type: 'UInt8', value: data.positionTo })
      .buffer();
  },
};
