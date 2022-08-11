import { BufferReader, BufferWriter } from 'easy-buffer';
import { PacketDataParser } from '../common';

export type Data = {
  quantity: number;
  position: number;

  /**
   * `true` when you removed the item from the trade; `false` when the other party removed it.
   */
  isYours: boolean;
};

export const DataParser: PacketDataParser<Data> = {
  fromBuffer(dataBuffer: Buffer) {
    const reader = new BufferReader(dataBuffer);
    return {
      quantity: reader.read({ type: 'UInt32LE' }),
      position: reader.read({ type: 'UInt8' }),
      isYours: reader.read({ type: 'UInt8' }) === 0,
    };
  },

  toBuffer(data) {
    return new BufferWriter()
      .write({ type: 'UInt32LE', value: data.quantity })
      .write({ type: 'UInt8', value: data.position })
      .write({ type: 'UInt8', value: data.isYours ? 0 : 1 })
      .buffer();
  },
};
