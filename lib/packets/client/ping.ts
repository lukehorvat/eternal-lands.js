import { PacketDataParser } from '../common';

export type Data = {
  echo: Buffer;
};

export const DataParser: PacketDataParser<Data> = {
  fromBuffer(dataBuffer: Buffer) {
    return {
      echo: dataBuffer,
    };
  },

  toBuffer(data) {
    return data.echo;
  },
};
