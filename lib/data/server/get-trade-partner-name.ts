import { BufferReader, BufferWriter } from 'easy-buffer';
import { PacketDataParser } from '../packets';

export type PacketData = {
  isStorageAvailable: boolean;
  tradePartnerName: string;
};

export const DataParser: PacketDataParser<PacketData> = {
  fromBuffer(dataBuffer: Buffer) {
    const reader = new BufferReader(dataBuffer);
    return {
      isStorageAvailable: reader.read({ type: 'UInt8' }) !== 0,
      tradePartnerName: reader.read({ type: 'String' }),
    };
  },

  toBuffer(data) {
    return new BufferWriter()
      .write({ type: 'UInt8', value: data.isStorageAvailable ? 1 : 0 })
      .write({ type: 'String', value: data.tradePartnerName })
      .buffer();
  },
};
