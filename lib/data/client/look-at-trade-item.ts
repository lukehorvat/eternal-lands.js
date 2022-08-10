import { BufferReader, BufferWriter } from 'easy-buffer';
import { PacketDataParser } from '../packets';

export type Data = {
  position: number;

  /**
   * `true` when looking at an item you added to the trade; `false` when the other party added it.
   */
  isYours: boolean;
};

export const DataParser: PacketDataParser<Data> = {
  fromBuffer(dataBuffer: Buffer) {
    const reader = new BufferReader(dataBuffer);
    return {
      position: reader.read({ type: 'UInt8' }),
      isYours: reader.read({ type: 'UInt8' }) === 0,
    };
  },

  toBuffer(data) {
    return new BufferWriter()
      .write({ type: 'UInt8', value: data.position })
      .write({ type: 'UInt8', value: data.isYours ? 0 : 1 })
      .buffer();
  },
};
