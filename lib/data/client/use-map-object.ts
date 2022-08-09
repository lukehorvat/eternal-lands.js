import { BufferReader, BufferWriter } from 'easy-buffer';
import { PacketDataParser } from '../packets';

export type Data = {
  objectId: number;

  /**
   * The position of an inventory item to "use with" the specified object.
   * If `undefined` then it's just a regular "use" object.
   */
  useWith?: number;
};

export const DataParser: PacketDataParser<Data> = {
  fromBuffer(dataBuffer: Buffer) {
    const reader = new BufferReader(dataBuffer);
    const objectId = reader.read({ type: 'UInt32LE' });
    const useWith = reader.read({ type: 'Int32LE' });
    return {
      objectId,
      useWith: useWith === -1 ? undefined : useWith,
    };
  },

  toBuffer(data) {
    return new BufferWriter()
      .write({ type: 'UInt32LE', value: data.objectId })
      .write({ type: 'Int32LE', value: data.useWith ?? -1 })
      .buffer();
  },
};
