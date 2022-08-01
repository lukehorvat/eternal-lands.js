import { BufferReader, BufferWriter } from 'easy-buffer';
import { PacketDataParser } from '../packets';

export type PacketData = {
  mapFilePath: string;
};

export const DataParser: PacketDataParser<PacketData> = {
  fromBuffer(dataBuffer: Buffer) {
    const reader = new BufferReader(dataBuffer);
    return {
      mapFilePath: reader.read({ type: 'StringNT', encoding: 'ascii' }),
    };
  },

  toBuffer(data) {
    return new BufferWriter()
      .write({ type: 'StringNT', value: data.mapFilePath, encoding: 'ascii' })
      .buffer();
  },
};
