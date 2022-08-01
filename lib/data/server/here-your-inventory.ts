import { BufferReader, BufferWriter } from 'easy-buffer';
import { PacketDataParser } from '../packets';

export type PacketData = {
  items: {
    imageId: number;
    quantity: number;
    position: number;
    flags: number;
    id?: number; // Defined when item UIDs are enabled.
  }[];
};

export const DataParser: PacketDataParser<PacketData> = {
  fromBuffer(dataBuffer: Buffer) {
    const reader = new BufferReader(dataBuffer);
    const itemsCount = reader.read({ type: 'UInt8' });
    const itemUidsEnabled = itemsCount * 10 === reader.bufferRemaining().length;
    const items = reader.readArray(() => {
      const imageId = reader.read({ type: 'UInt16LE' });
      const quantity = reader.read({ type: 'UInt32LE' });
      const position = reader.read({ type: 'UInt8' });
      const flags = reader.read({ type: 'UInt8' });
      const id = itemUidsEnabled
        ? reader.read({ type: 'UInt16LE' })
        : undefined;
      return { imageId, quantity, position, flags, id };
    });
    return { items };
  },

  toBuffer(data) {
    return new BufferWriter()
      .write({ type: 'UInt8', value: data.items.length })
      .writeArray(data.items, (writer, item) => {
        writer.write({ type: 'UInt16LE', value: item.imageId });
        writer.write({ type: 'UInt32LE', value: item.quantity });
        writer.write({ type: 'UInt8', value: item.position });
        writer.write({ type: 'UInt8', value: item.flags });

        if (item.id != null) {
          writer.write({ type: 'UInt16LE', value: item.id });
        }
      })
      .buffer();
  },
};
