import { BufferReader, BufferWriter } from 'easy-buffer';
import { PacketDataParser } from '../packets';

export type PacketData = {
  echo: number;
};

export const DataParser: PacketDataParser<PacketData> = {
  fromBuffer(dataBuffer: Buffer) {
    const reader = new BufferReader(dataBuffer);
    return {
      echo: reader.read({ type: 'UInt32LE' }),
    };
  },

  toBuffer(data) {
    return new BufferWriter()
      .write({ type: 'UInt32LE', value: data.echo })
      .buffer();
  },
};
