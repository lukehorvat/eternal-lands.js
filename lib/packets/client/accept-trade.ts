import { BufferReader, BufferWriter } from 'easy-buffer';
import { MAX_TRADE_SLOTS } from '../../constants';
import { PacketDataParser } from '../common';

export type Data = {
  /**
   * An array representing each item trade slot of the other party (NOT you).
   */
  slots: {
    /**
     * `true` when the item in this slot is being traded from storage; `false` when from inventory.
     * If `undefined`, then no quantity of any item is being traded in this slot.
     */
    isFromStorage?: boolean;
  }[];
};

export const DataParser: PacketDataParser<Data> = {
  fromBuffer(dataBuffer: Buffer) {
    if (dataBuffer.length !== MAX_TRADE_SLOTS) {
      throw new Error('All item trade slots not represented.');
    }

    const reader = new BufferReader(dataBuffer);
    const slots = reader.readArray(() => {
      const type = reader.read({ type: 'UInt8' });
      return {
        isFromStorage: type === 2 ? true : type === 1 ? false : undefined,
      };
    });
    return { slots };
  },

  toBuffer(data) {
    if (data.slots.length !== MAX_TRADE_SLOTS) {
      throw new Error('All item trade slots not represented.');
    }

    return new BufferWriter()
      .writeArray(data.slots, (writer, slot) => {
        const type =
          slot.isFromStorage != null ? (slot.isFromStorage ? 2 : 1) : 0;
        writer.write({ type: 'UInt8', value: type });
      })
      .buffer();
  },
};
