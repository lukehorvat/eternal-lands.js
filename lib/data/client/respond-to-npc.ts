import { BufferReader, BufferWriter } from 'easy-buffer';
import { PacketDataParser } from '../packets';

export type Data = {
  toActorId: number;
  responseId: number;
};

export const DataParser: PacketDataParser<Data> = {
  fromBuffer(dataBuffer: Buffer) {
    const reader = new BufferReader(dataBuffer);
    return {
      toActorId: reader.read({ type: 'UInt16LE' }),
      responseId: reader.read({ type: 'UInt16LE' }),
    };
  },

  toBuffer(data) {
    return new BufferWriter()
      .write({ type: 'UInt16LE', value: data.toActorId })
      .write({ type: 'UInt16LE', value: data.responseId })
      .buffer();
  },
};
