import { BufferReader, BufferWriter } from 'easy-buffer';
import { PacketDataParser } from '../packets';

export type Data = {
  activeChannel?: number;
  channels: number[];
};

export const DataParser: PacketDataParser<Data> = {
  fromBuffer(dataBuffer: Buffer) {
    const reader = new BufferReader(dataBuffer);
    const activeChannelIndex = reader.read({ type: 'UInt8' });
    const channels = reader
      .readArray(() => reader.read({ type: 'UInt32LE' }))
      .filter((channel) => channel !== 0); // zero = no channel assigned
    const activeChannel = channels[activeChannelIndex];
    return { activeChannel, channels };
  },

  toBuffer(data) {
    const activeChannelIndex = data.activeChannel
      ? data.channels.indexOf(data.activeChannel)
      : 0;
    return new BufferWriter()
      .write({ type: 'UInt8', value: activeChannelIndex })
      .writeArray(data.channels, (writer, channel) => {
        writer.write({ type: 'UInt32LE', value: channel ?? 0 }); // zero = no channel assigned
      })
      .buffer();
  },
};
