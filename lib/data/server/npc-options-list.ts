import { BufferReader, BufferWriter } from 'easy-buffer';
import { PacketDataParser } from '../packets';

export type PacketData = {
  options: {
    responseText: string;
    responseId: number;
    toActorId: number;
  }[];
};

export const DataParser: PacketDataParser<PacketData> = {
  fromBuffer(dataBuffer: Buffer) {
    const reader = new BufferReader(dataBuffer);
    const options = reader.readArray(() => {
      const length = reader.read({ type: 'UInt16LE' });
      return {
        responseText: reader.read({ type: 'String', length }),
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
          .write({ type: 'UInt16LE', value: option.responseText.length })
          .write({ type: 'String', value: option.responseText })
          .write({ type: 'UInt16LE', value: option.responseId })
          .write({ type: 'UInt16LE', value: option.toActorId });
      })
      .buffer();
  },
};
