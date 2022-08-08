import { BufferReader, BufferWriter } from 'easy-buffer';
import { PacketDataParser } from '../packets';

export type PacketData = {
  teleporters: {
    x: number;
    y: number;
  }[];
};

export const DataParser: PacketDataParser<PacketData> = {
  fromBuffer(dataBuffer: Buffer) {
    const reader = new BufferReader(dataBuffer);
    const teleportersCount = reader.read({ type: 'UInt16LE' });
    const teleporters = reader.readArray(() => {
      const x = reader.read({ type: 'UInt16LE' });
      const y = reader.read({ type: 'UInt16LE' });
      reader.offset(1); // one unused byte
      return { x, y };
    });
    return { teleporters };
  },

  toBuffer(data) {
    return new BufferWriter()
      .write({ type: 'UInt16LE', value: data.teleporters.length })
      .writeArray(data.teleporters, (writer, teleporter) => {
        writer
          .write({ type: 'UInt16LE', value: teleporter.x })
          .write({ type: 'UInt16LE', value: teleporter.y })
          .offset(1); // one unused byte
      })
      .buffer();
  },
};
