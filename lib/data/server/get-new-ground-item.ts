import { BufferReader, BufferWriter } from 'easy-buffer';
import { PacketDataParser } from '../packets';

export type PacketData = {
  imageId: number;
  quantity: number;
  position: number;
};

export const DataParser: PacketDataParser<PacketData> = {
  fromBuffer(dataBuffer: Buffer) {
    const reader = new BufferReader(dataBuffer);
    return {
      imageId: reader.read({ type: 'UInt16LE' }),
      quantity: reader.read({ type: 'UInt32LE' }),
      position: reader.read({ type: 'UInt8' }),
    };
  },

  toBuffer(data) {
    return new BufferWriter()
      .write({ type: 'UInt16LE', value: data.imageId })
      .write({ type: 'UInt32LE', value: data.quantity })
      .write({ type: 'UInt8', value: data.position })
      .buffer();
  },
};
