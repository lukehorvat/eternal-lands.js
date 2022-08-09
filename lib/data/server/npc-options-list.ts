import { BufferReader, BufferWriter } from 'easy-buffer';
import { PacketDataParser } from '../packets';

export type Data = {
  options: {
    responseText: string;
    responseId: number;
    toActorId: number;
  }[];
};

export const DataParser: PacketDataParser<Data> = {
  fromBuffer(dataBuffer: Buffer) {
    const reader = new BufferReader(dataBuffer);
    const options = reader.readArray(() => {
      return {
        responseText: reader.offset(2).read({ type: 'StringNT' }),
        responseId: reader.read({ type: 'UInt16LE' }),
        toActorId: reader.read({ type: 'UInt16LE' }),
      };
    });
    return { options };
  },

  toBuffer(data) {
    return new BufferWriter()
      .writeArray(data.options, (writer, option) => {
        writer
          .offset(2)
          .write({ type: 'StringNT', value: option.responseText })
          .write({ type: 'UInt16LE', value: option.responseId })
          .write({ type: 'UInt16LE', value: option.toActorId });
      })
      .buffer();
  },
};
