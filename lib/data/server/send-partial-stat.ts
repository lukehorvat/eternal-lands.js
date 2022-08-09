import { BufferReader, BufferWriter } from 'easy-buffer';
import { StatType } from '../../constants';
import { PacketDataParser } from '../packets';

export type Data = {
  statType: StatType;
  statValue: number;
};

export const DataParser: PacketDataParser<Data> = {
  fromBuffer(dataBuffer: Buffer) {
    const reader = new BufferReader(dataBuffer);
    return {
      statType: reader.read({ type: 'UInt8' }),
      statValue: reader.read({ type: 'Int32LE' }),
    };
  },

  toBuffer(data) {
    return new BufferWriter()
      .write({ type: 'UInt8', value: data.statType })
      .write({ type: 'Int32LE', value: data.statValue })
      .buffer();
  },
};
