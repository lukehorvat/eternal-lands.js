import { BufferReader, BufferWriter } from 'easy-buffer';
import { PacketDataParser } from '../common';
import { ItemId } from '../../constants';

export type Data = {
  imageId: number;
  quantity: number;
  position: number;
  flags: number;
  id?: ItemId; // Defined when item UIDs are enabled.
};

export const DataParser: PacketDataParser<Data> = {
  fromBuffer(dataBuffer: Buffer) {
    const reader = new BufferReader(dataBuffer);
    const itemUidsEnabled = dataBuffer.length === 10;
    return {
      imageId: reader.read({ type: 'UInt16LE' }),
      quantity: reader.read({ type: 'UInt32LE' }),
      position: reader.read({ type: 'UInt8' }),
      flags: reader.read({ type: 'UInt8' }),
      id: itemUidsEnabled ? reader.read({ type: 'UInt16LE' }) : undefined,
    };
  },

  toBuffer(data) {
    const writer = new BufferWriter()
      .write({ type: 'UInt16LE', value: data.imageId })
      .write({ type: 'UInt32LE', value: data.quantity })
      .write({ type: 'UInt8', value: data.position })
      .write({ type: 'UInt8', value: data.flags });

    if (data.id != null) {
      writer.write({ type: 'UInt16LE', value: data.id });
    }

    return writer.buffer();
  },
};
