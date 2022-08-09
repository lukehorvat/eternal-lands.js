import { BufferReader, BufferWriter } from 'easy-buffer';
import { PacketDataParser } from '../packets';

export type Data = {
  recipientName: string;
  message: string;
};

export const DataParser: PacketDataParser<Data> = {
  fromBuffer(dataBuffer: Buffer) {
    const reader = new BufferReader(dataBuffer);
    const [recipientName, ...message] = reader
      .read({ type: 'String', encoding: 'ascii' })
      .split(' ');
    return { recipientName, message: message.join(' ') };
  },

  toBuffer(data) {
    return new BufferWriter()
      .write({
        type: 'String',
        value: `${data.recipientName} ${data.message}`,
        encoding: 'ascii',
      })
      .buffer();
  },
};
