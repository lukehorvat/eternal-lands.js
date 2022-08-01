import { BufferReader, BufferWriter } from 'easy-buffer';
import { PacketDataParser } from '../packets';

export type PacketData = {
  reason: string;
};

export const DataParser: PacketDataParser<PacketData> = {
  fromBuffer(dataBuffer: Buffer) {
    const reader = new BufferReader(dataBuffer);
    return {
      reason: reader.read({ type: 'String', encoding: 'ascii' }),
    };
  },

  toBuffer(data) {
    return new BufferWriter()
      .write({ type: 'String', value: data.reason, encoding: 'ascii' })
      .buffer();
  },
};
