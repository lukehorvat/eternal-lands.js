import { BufferReader, BufferWriter } from 'easy-buffer';
import { PacketDataParser } from '../common';

export type Data = {
  position: number;
  quantity: number;

  /**
   * `true` when the item is being traded from storage; `false` when from inventory.
   */
  isFromStorage: boolean;
};

export const DataParser: PacketDataParser<Data> = {
  fromBuffer(dataBuffer: Buffer) {
    const reader = new BufferReader(dataBuffer);
    return {
      isFromStorage: reader.read({ type: 'UInt8' }) === 2,
      position: reader.read({
        type: dataBuffer.length > 6 ? 'UInt16LE' : 'UInt8',
      }),
      quantity: reader.read({ type: 'UInt32LE' }),
    };
  },

  toBuffer(data) {
    return new BufferWriter()
      .write({ type: 'UInt8', value: data.isFromStorage ? 2 : 1 })
      .write({
        type: data.position > 255 ? 'UInt16LE' : 'UInt8',
        value: data.position,
      })
      .write({ type: 'UInt32LE', value: data.quantity })
      .buffer();
  },
};
