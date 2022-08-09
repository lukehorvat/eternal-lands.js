import { PacketDataParser } from '../packets';

export type Data = Record<string, never>;

export const DataParser: PacketDataParser<Data> = {
  fromBuffer() {
    return {};
  },

  toBuffer() {
    return Buffer.alloc(0);
  },
};
