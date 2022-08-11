import { BufferReader, BufferWriter } from 'easy-buffer';
import { PacketDataParser } from '../common';

export type Data = {
  npcName: string;
  npcPortrait: number;
};

export const DataParser: PacketDataParser<Data> = {
  fromBuffer(dataBuffer: Buffer) {
    const reader = new BufferReader(dataBuffer);
    return {
      npcName: reader.read({ type: 'StringNT' }),
      npcPortrait: reader.offset(20, true).read({ type: 'UInt8' }),
    };
  },

  toBuffer(data) {
    return new BufferWriter()
      .write({ type: 'StringNT', value: data.npcName })
      .offset(20, true)
      .write({ type: 'UInt8', value: data.npcPortrait })
      .buffer();
  },
};
