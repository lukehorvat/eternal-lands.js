import { BufferReader, BufferWriter } from 'easy-buffer';
import { PacketDataParser } from '../common';
import { ActorCommand } from '../../constants';

export type Data = {
  actorId: number;
  command: ActorCommand;
};

export const DataParser: PacketDataParser<Data> = {
  fromBuffer(dataBuffer: Buffer) {
    const reader = new BufferReader(dataBuffer);
    return {
      actorId: reader.read({ type: 'UInt16LE' }),
      command: reader.read({ type: 'UInt8' }),
    };
  },

  toBuffer(data) {
    return new BufferWriter()
      .write({ type: 'UInt16LE', value: data.actorId })
      .write({ type: 'UInt8', value: data.command })
      .buffer();
  },
};
