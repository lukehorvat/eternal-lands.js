import { PacketDataParser } from '../packets';

export type PacketData = {
  echo: Buffer;
};

export const DataParser: PacketDataParser<PacketData> = {
  fromBuffer(dataBuffer: Buffer) {
    return {
      echo: dataBuffer,
    };
  },

  toBuffer(data) {
    return data.echo;
  },
};
