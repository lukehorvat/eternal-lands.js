import { BufferReader, BufferWriter } from 'easy-buffer';
import { PacketDataParser } from '../common';
import { ItemId } from '../../constants';

export type Data = {
  items: {
    imageId: number;
    quantity: number;
    position: number;
    flags: number;
    id?: ItemId; // Defined when item UIDs are enabled.
  }[];
};

export const DataParser: PacketDataParser<Data> = {
  fromBuffer(dataBuffer: Buffer) {
    const reader = new BufferReader(dataBuffer);
    const itemsCount = reader.read({ type: 'UInt8' });
    const itemUidsEnabled = reader.bufferRemaining().length === itemsCount * 10;
    const items = reader.readArray(() => {
      return {
        imageId: reader.read({ type: 'UInt16LE' }),
        quantity: reader.read({ type: 'UInt32LE' }),
        position: reader.read({ type: 'UInt8' }),
        flags: reader.read({ type: 'UInt8' }),
        id: itemUidsEnabled ? reader.read({ type: 'UInt16LE' }) : undefined,
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
          .write({ type: 'UInt8', value: item.position })
          .write({ type: 'UInt8', value: item.flags });

        if (item.id != null) {
          writer.write({ type: 'UInt16LE', value: item.id });
        }
      })
      .buffer();
  },
};
