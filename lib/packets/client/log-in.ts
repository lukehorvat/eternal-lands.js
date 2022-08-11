import { BufferReader, BufferWriter } from 'easy-buffer';
import { PacketDataParser } from '../common';

export type Data = {
  username: string;
  password: string;
};

export const DataParser: PacketDataParser<Data> = {
  fromBuffer(dataBuffer: Buffer) {
    const reader = new BufferReader(dataBuffer);
    const [username, password] = reader
      .read({ type: 'StringNT', encoding: 'ascii' })
      .split(' ');
    return { username, password };
  },

  toBuffer(data) {
    return new BufferWriter()
      .write({
        type: 'StringNT',
        value: `${data.username} ${data.password}`,
        encoding: 'ascii',
      })
      .buffer();
  },
};
