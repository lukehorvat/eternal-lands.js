import { BufferReader, BufferWriter } from 'easy-buffer';
import { PacketDataParser } from '../packets';

export type PacketData = {
  position: number;
};

export const DataParser: PacketDataParser<PacketData> = {
  fromBuffer(dataBuffer: Buffer) {
    const reader = new BufferReader(dataBuffer);
    return {
      position: reader.read({ type: 'UInt8' }),
    };
  },

  toBuffer(data) {
    return new BufferWriter()
      .write({ type: 'UInt8', value: data.position })
      .buffer();
  },
};
