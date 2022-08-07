import { PacketDataParser } from '../packets';

export type PacketData = Record<string, never>;

export const DataParser: PacketDataParser<PacketData> = {
  fromBuffer() {
    return {};
  },

  toBuffer() {
    return Buffer.alloc(0);
  },
};
