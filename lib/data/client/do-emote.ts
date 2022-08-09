import { BufferReader, BufferWriter } from 'easy-buffer';
import { PacketDataParser } from '../packets';
import { EmoteId } from '../../constants';

export type Data = {
  emoteId: EmoteId;
};

export const DataParser: PacketDataParser<Data> = {
  fromBuffer(dataBuffer: Buffer) {
    const reader = new BufferReader(dataBuffer);
    return {
      emoteId: reader.read({ type: 'UInt8' }),
    };
  },

  toBuffer(data) {
    return new BufferWriter()
      .write({ type: 'UInt8', value: data.emoteId })
      .buffer();
  },
};
