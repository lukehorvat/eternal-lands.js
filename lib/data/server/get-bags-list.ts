import { BufferReader, BufferWriter } from 'easy-buffer';
import { PacketDataParser } from '../packets';

export type Data = {
  bags: {
    x: number;
    y: number;
    bagId: number;
  }[];
};

export const DataParser: PacketDataParser<Data> = {
  fromBuffer(dataBuffer: Buffer) {
    const reader = new BufferReader(dataBuffer);
    const bagsCount = reader.read({ type: 'UInt8' });
    const bags = reader.readArray(() => {
      return {
        x: reader.read({ type: 'UInt16LE' }),
        y: reader.read({ type: 'UInt16LE' }),
        bagId: reader.read({ type: 'UInt8' }),
      };
    });
    return { bags };
  },

  toBuffer(data) {
    return new BufferWriter()
      .write({ type: 'UInt8', value: data.bags.length })
      .writeArray(data.bags, (writer, bag) => {
        writer
          .write({ type: 'UInt16LE', value: bag.x })
          .write({ type: 'UInt16LE', value: bag.y })
          .write({ type: 'UInt8', value: bag.bagId });
      })
      .buffer();
  },
};
