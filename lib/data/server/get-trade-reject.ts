import { BufferReader, BufferWriter } from 'easy-buffer';
import { PacketDataParser } from '../packets';

export type Data = {
  /**
   * `true` when you rejected the trade; `false` when the other party rejected the trade.
   */
  youRejected: boolean;
};

export const DataParser: PacketDataParser<Data> = {
  fromBuffer(dataBuffer: Buffer) {
    const reader = new BufferReader(dataBuffer);
    return {
      youRejected: reader.read({ type: 'UInt8' }) === 0,
    };
  },

  toBuffer(data) {
    return new BufferWriter()
      .write({ type: 'UInt8', value: data.youRejected ? 0 : 1 })
      .buffer();
  },
};
