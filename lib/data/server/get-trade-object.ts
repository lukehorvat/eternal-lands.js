import { BufferReader, BufferWriter } from 'easy-buffer';
import { PacketDataParser } from '../packets';

export type PacketData = {
  imageId: number;
  quantity: number;
  position: number;
  id?: number; // Defined when item UIDs are enabled.

  /**
   * `true` when the item is being traded from storage; `false` when from inventory.
   */
  isFromStorage: boolean;

  /**
   * `true` when you added the item to the trade; `false` when the other party added it.
   */
  isFromYou: boolean;
};

export const DataParser: PacketDataParser<PacketData> = {
  fromBuffer(dataBuffer: Buffer) {
    const reader = new BufferReader(dataBuffer);
    const itemUidsEnabled = dataBuffer.length === 11;
    return {
      imageId: reader.read({ type: 'UInt16LE' }),
      quantity: reader.read({ type: 'UInt32LE' }),
      isFromStorage: reader.read({ type: 'UInt8' }) === 2,
      position: reader.read({ type: 'UInt8' }),
      isFromYou: reader.read({ type: 'UInt8' }) === 0,
      id: itemUidsEnabled ? reader.read({ type: 'UInt16LE' }) : undefined,
    };
  },

  toBuffer(data) {
    const writer = new BufferWriter()
      .write({ type: 'UInt16LE', value: data.imageId })
      .write({ type: 'UInt32LE', value: data.quantity })
      .write({ type: 'UInt8', value: data.isFromStorage ? 2 : 1 })
      .write({ type: 'UInt8', value: data.position })
      .write({ type: 'UInt8', value: data.isFromYou ? 0 : 1 });

    if (data.id != null) {
      writer.write({ type: 'UInt16LE', value: data.id });
    }

    return writer.buffer();
  },
};
