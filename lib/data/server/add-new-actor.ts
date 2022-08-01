import { BufferReader, BufferWriter } from 'easy-buffer';
import { PacketDataParser } from '../packets';
import { ActorType } from '../../constants';

export type PacketData = {
  id: number;
  xPos: number;
  yPos: number;
  zRotation: number;
  type: ActorType;
  maxHealth: number;
  currentHealth: number;
  name: string;
};

export const DataParser: PacketDataParser<PacketData> = {
  fromBuffer(dataBuffer: Buffer) {
    const reader = new BufferReader(dataBuffer);
    return {
      id: reader.read({ type: 'UInt16LE' }),
      xPos: reader.read({ type: 'UInt16LE' }),
      yPos: reader.read({ type: 'UInt16LE' }),
      zRotation: reader.offset(2).read({ type: 'UInt16LE' }),
      type: reader.read({ type: 'UInt8' }),
      maxHealth: reader.offset(1).read({ type: 'UInt16LE' }),
      currentHealth: reader.read({ type: 'UInt16LE' }),
      name: reader.offset(1).read({ type: 'StringNT', encoding: 'ascii' }),
    };
  },

  toBuffer(data) {
    return new BufferWriter()
      .write({ type: 'UInt16LE', value: data.id })
      .write({ type: 'UInt16LE', value: data.xPos })
      .write({ type: 'UInt16LE', value: data.yPos })
      .offset(2)
      .write({ type: 'UInt16LE', value: data.zRotation })
      .write({ type: 'UInt8', value: data.type })
      .offset(1)
      .write({ type: 'UInt16LE', value: data.maxHealth })
      .write({ type: 'UInt16LE', value: data.currentHealth })
      .offset(1)
      .write({ type: 'StringNT', value: data.name, encoding: 'ascii' })
      .buffer();
  },
};
