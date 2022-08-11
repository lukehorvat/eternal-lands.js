import { BufferReader, BufferWriter } from 'easy-buffer';
import { PacketDataParser } from '../common';

export type Data = {
  items: {
    imageId: number;
    quantity: number;
    position: number;
  }[];
};

export const DataParser: PacketDataParser<Data> = {
  fromBuffer(dataBuffer: Buffer) {
    const reader = new BufferReader(dataBuffer);
    const itemsCount = reader.read({ type: 'UInt8' });
    const items = reader.readArray(() => {
      return {
        imageId: reader.read({ type: 'UInt16LE' }),
        quantity: reader.read({ type: 'UInt32LE' }),
        position: reader.read({ type: 'UInt8' }),
      };
    });
    return { items };
  },

  toBuffer(data) {
    return new BufferWriter()
      .write({ type: 'UInt8', value: data.items.length })
      .writeArray(data.items, (writer, item) => {
        writer
          .write({ type: 'UInt16LE', value: item.imageId })
          .write({ type: 'UInt32LE', value: item.quantity })
          .write({ type: 'UInt8', value: item.position });
      })
      .buffer();
  },
};
