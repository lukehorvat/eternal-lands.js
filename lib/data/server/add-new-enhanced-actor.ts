import { BufferReader, BufferWriter } from 'easy-buffer';
import { PacketDataParser } from '../packets';
import {
  ActorBoots,
  ActorCape,
  ActorHair,
  ActorHead,
  ActorHelmet,
  ActorKind,
  ActorPants,
  ActorShield,
  ActorShirt,
  ActorSkin,
  ActorType,
  ActorWeapon,
} from '../../constants';

export type Data = {
  id: number;
  xPos: number;
  yPos: number;
  zRotation: number;
  type: ActorType;
  skin: ActorSkin;
  hair: ActorHair;
  shirt: ActorShirt;
  pants: ActorPants;
  boots: ActorBoots;
  head: ActorHead;
  shield: ActorShield;
  weapon: ActorWeapon;
  cape: ActorCape;
  helmet: ActorHelmet;
  maxHealth: number;
  currentHealth: number;
  kind: ActorKind;
  name: string;
  guild?: string;
};

export const DataParser: PacketDataParser<Data> = {
  fromBuffer(dataBuffer: Buffer) {
    const reader = new BufferReader(dataBuffer);
    return {
      id: reader.read({ type: 'UInt16LE' }),
      xPos: reader.read({ type: 'UInt16LE' }),
      yPos: reader.read({ type: 'UInt16LE' }),
      zRotation: reader.offset(2).read({ type: 'UInt16LE' }),
      type: reader.read({ type: 'UInt8' }),
      skin: reader.offset(1).read({ type: 'UInt8' }),
      hair: reader.read({ type: 'UInt8' }),
      shirt: reader.read({ type: 'UInt8' }),
      pants: reader.read({ type: 'UInt8' }),
      boots: reader.read({ type: 'UInt8' }),
      head: reader.read({ type: 'UInt8' }),
      shield: reader.read({ type: 'UInt8' }),
      weapon: reader.read({ type: 'UInt8' }),
      cape: reader.read({ type: 'UInt8' }),
      helmet: reader.read({ type: 'UInt8' }),
      maxHealth: reader.offset(1).read({ type: 'UInt16LE' }),
      currentHealth: reader.read({ type: 'UInt16LE' }),
      kind: reader.read({ type: 'UInt8' }),
      ...(() => {
        // TODO: Need to strip out any leading color codes from name and guild.
        // https://github.com/raduprv/Eternal-Lands/blob/0c6335c3bf8bdbfbb7bcfb2eab75f00e26ad1a7b/new_actors.c#L312
        const [name, guild] = reader
          .read({ type: 'StringNT', encoding: 'ascii' })
          .split(' ');
        return { name, guild };
      })(),
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
      .write({ type: 'UInt8', value: data.skin })
      .write({ type: 'UInt8', value: data.hair })
      .write({ type: 'UInt8', value: data.shirt })
      .write({ type: 'UInt8', value: data.pants })
      .write({ type: 'UInt8', value: data.boots })
      .write({ type: 'UInt8', value: data.head })
      .write({ type: 'UInt8', value: data.shield })
      .write({ type: 'UInt8', value: data.weapon })
      .write({ type: 'UInt8', value: data.cape })
      .write({ type: 'UInt8', value: data.helmet })
      .offset(1)
      .write({ type: 'UInt16LE', value: data.maxHealth })
      .write({ type: 'UInt16LE', value: data.currentHealth })
      .write({ type: 'UInt8', value: data.kind })
      .write({
        type: 'StringNT',
        value: `${data.name} ${data.guild}`,
        encoding: 'ascii',
      })
      .buffer();
  },
};
