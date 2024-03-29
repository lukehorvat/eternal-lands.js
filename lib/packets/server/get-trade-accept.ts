import { BufferReader, BufferWriter } from 'easy-buffer';
import { PacketDataParser } from '../common';

export type Data = {
  /**
   * `true` when you accepted the trade; `false` when the other party accepted the trade.
   */
  youAccepted: boolean;
};

export const DataParser: PacketDataParser<Data> = {
  fromBuffer(dataBuffer: Buffer) {
    const reader = new BufferReader(dataBuffer);
    return {
      youAccepted: reader.read({ type: 'UInt8' }) === 0,
    };
  },

  toBuffer(data) {
    return new BufferWriter()
      .write({ type: 'UInt8', value: data.youAccepted ? 0 : 1 })
      .buffer();
  },
};
