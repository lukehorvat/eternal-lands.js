import { BufferReader, BufferWriter } from 'easy-buffer';
import { PacketDataParser } from '../packets';
import { ChatChannel } from '../../constants';

export type PacketData = {
  channel: ChatChannel;
  message: string;
};

export const DataParser: PacketDataParser<PacketData> = {
  fromBuffer(dataBuffer: Buffer) {
    const reader = new BufferReader(dataBuffer);
    return {
      channel: reader.read({ type: 'UInt8' }),
      message: reader.read({ type: 'String', encoding: 'ascii' }),
    };
  },

  toBuffer(data) {
    return new BufferWriter()
      .write({ type: 'UInt8', value: data.channel })
      .write({ type: 'String', value: data.message, encoding: 'ascii' })
      .buffer();
  },
};
