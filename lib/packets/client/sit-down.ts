import { BufferReader, BufferWriter } from 'easy-buffer';
import { PacketDataParser } from '../common';

export type Data = {
  /**
   * `true` when to sit down; `false` when to stand up.
   */
  sit: boolean;
};

export const DataParser: PacketDataParser<Data> = {
  fromBuffer(dataBuffer: Buffer) {
    const reader = new BufferReader(dataBuffer);
    return {
      sit: reader.read({ type: 'UInt8' }) !== 0,
    };
  },

  toBuffer(data) {
    return new BufferWriter()
      .write({ type: 'UInt8', value: data.sit ? 1 : 0 })
      .buffer();
  },
};
