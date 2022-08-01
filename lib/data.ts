import { BufferReader, BufferWriter } from 'easy-buffer';
import { ClientPacketType, ServerPacketType } from './types';
import {
  ActorBoots,
  ActorCape,
  ActorCommand,
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
  ChatChannel,
} from './constants';

type PacketData = Record<string, any>;
type PacketDataEmpty = Record<string, never>;

export interface ClientPacketData
  extends Record<ClientPacketType, PacketData | PacketDataEmpty> {
  [ClientPacketType.RAW_TEXT]: { message: string };
  [ClientPacketType.PING]: { echo: number };
  [ClientPacketType.HEART_BEAT]: PacketDataEmpty;
  [ClientPacketType.LOCATE_ME]: PacketDataEmpty;
  [ClientPacketType.TRADE_WITH]: { actorId: number };
  [ClientPacketType.PING_RESPONSE]: { echo: number };
  [ClientPacketType.LOG_IN]: { username: string; password: string };
}

export interface ServerPacketData
  extends Record<ServerPacketType, PacketData | PacketDataEmpty> {
  [ServerPacketType.RAW_TEXT]: { channel: ChatChannel; message: string };
  [ServerPacketType.ADD_NEW_ACTOR]: {
    id: number;
    xPos: number;
    yPos: number;
    zRotation: number;
    type: ActorType;
    maxHealth: number;
    currentHealth: number;
    name: string;
  };
  [ServerPacketType.ADD_ACTOR_COMMAND]: {
    actorId: number;
    command: ActorCommand;
  };
  [ServerPacketType.YOU_ARE]: { actorId: number };
  [ServerPacketType.SYNC_CLOCK]: { serverTimestamp: number };
  [ServerPacketType.NEW_MINUTE]: { minute: number };
  [ServerPacketType.REMOVE_ACTOR]: { actorId: number };
  [ServerPacketType.CHANGE_MAP]: { mapFilePath: string };
  [ServerPacketType.PONG]: { echo: number };
  [ServerPacketType.HERE_YOUR_STATS]: {
    attributes: {
      physique: {
        current: number;
        base: number;
      };
      coordination: {
        current: number;
        base: number;
      };
      reasoning: {
        current: number;
        base: number;
      };
      will: {
        current: number;
        base: number;
      };
      instinct: {
        current: number;
        base: number;
      };
      vitality: {
        current: number;
        base: number;
      };
    };
    nexus: {
      human: {
        current: number;
        base: number;
      };
      animal: {
        current: number;
        base: number;
      };
      vegetal: {
        current: number;
        base: number;
      };
      inorganic: {
        current: number;
        base: number;
      };
      artificial: {
        current: number;
        base: number;
      };
      magic: {
        current: number;
        base: number;
      };
    };
    skills: {
      attack: {
        current: number;
        base: number;
      };
      defense: {
        current: number;
        base: number;
      };
      harvesting: {
        current: number;
        base: number;
      };
      alchemy: {
        current: number;
        base: number;
      };
      magic: {
        current: number;
        base: number;
      };
      potion: {
        current: number;
        base: number;
      };
      summoning: {
        current: number;
        base: number;
      };
      manufacturing: {
        current: number;
        base: number;
      };
      crafting: {
        current: number;
        base: number;
      };
      engineering: {
        current: number;
        base: number;
      };
      tailoring: {
        current: number;
        base: number;
      };
      ranging: {
        current: number;
        base: number;
      };
      overall: {
        current: number;
        base: number;
      };
    };
    carryCapacity: {
      current: number;
      base: number;
    };
    materialPoints: {
      current: number;
      base: number;
    };
    etherealPoints: {
      current: number;
      base: number;
    };
    actionPoints: {
      current: number;
      base: number;
    };
  };
  [ServerPacketType.HERE_YOUR_INVENTORY]: {
    items: {
      imageId: number;
      quantity: number;
      position: number;
      flags: number;
      id?: number; // Defined when item UIDs is enabled.
    }[];
  };
  [ServerPacketType.ADD_NEW_ENHANCED_ACTOR]: {
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
  [ServerPacketType.PING_REQUEST]: { echo: number };
  [ServerPacketType.GET_ACTIVE_CHANNELS]: {
    activeChannel?: number;
    channels: number[];
  };
  [ServerPacketType.YOU_DONT_EXIST]: PacketDataEmpty;
  [ServerPacketType.LOG_IN_OK]: PacketDataEmpty;
  [ServerPacketType.LOG_IN_NOT_OK]: { reason: string };
}

export const packetDataParsers: {
  client: {
    [Type in ClientPacketType]: {
      fromBuffer: (dataBuffer: Buffer) => ClientPacketData[Type];
      toBuffer: (data: ClientPacketData[Type]) => Buffer;
    };
  };
  server: {
    [Type in ServerPacketType]: {
      fromBuffer: (dataBuffer: Buffer) => ServerPacketData[Type];
      toBuffer: (data: ServerPacketData[Type]) => Buffer;
    };
  };
} = {
  client: {
    [ClientPacketType.RAW_TEXT]: {
      fromBuffer(dataBuffer: Buffer) {
        const reader = new BufferReader(dataBuffer);
        return {
          message: reader.read({ type: 'String', encoding: 'ascii' }),
        };
      },
      toBuffer({ message }) {
        return new BufferWriter()
          .write({ type: 'String', value: message, encoding: 'ascii' })
          .buffer();
      },
    },
    [ClientPacketType.PING]: {
      fromBuffer(dataBuffer: Buffer) {
        const reader = new BufferReader(dataBuffer);
        return {
          echo: reader.read({ type: 'UInt32LE' }),
        };
      },
      toBuffer({ echo }) {
        return new BufferWriter()
          .write({ type: 'UInt32LE', value: echo })
          .buffer();
      },
    },
    [ClientPacketType.HEART_BEAT]: {
      fromBuffer(dataBuffer: Buffer) {
        return {};
      },
      toBuffer() {
        return new BufferWriter().buffer();
      },
    },
    [ClientPacketType.LOCATE_ME]: {
      fromBuffer(dataBuffer: Buffer) {
        return {};
      },
      toBuffer() {
        return new BufferWriter().buffer();
      },
    },
    [ClientPacketType.TRADE_WITH]: {
      fromBuffer(dataBuffer: Buffer) {
        const reader = new BufferReader(dataBuffer);
        return {
          actorId: reader.read({ type: 'UInt32LE' }),
        };
      },
      toBuffer({ actorId }) {
        return new BufferWriter()
          .write({ type: 'UInt32LE', value: actorId })
          .buffer();
      },
    },
    [ClientPacketType.PING_RESPONSE]: {
      fromBuffer(dataBuffer: Buffer) {
        const reader = new BufferReader(dataBuffer);
        return {
          echo: reader.read({ type: 'UInt32LE' }),
        };
      },
      toBuffer({ echo }) {
        return new BufferWriter()
          .write({ type: 'UInt32LE', value: echo })
          .buffer();
      },
    },
    [ClientPacketType.LOG_IN]: {
      fromBuffer(dataBuffer: Buffer) {
        const reader = new BufferReader(dataBuffer);
        const [username, password] = reader
          .read({ type: 'StringNT', encoding: 'ascii' })
          .split(' ');
        return { username, password };
      },
      toBuffer({ username, password }) {
        return new BufferWriter()
          .write({
            type: 'StringNT',
            value: `${username} ${password}`,
            encoding: 'ascii',
          })
          .buffer();
      },
    },
  },
  server: {
    [ServerPacketType.RAW_TEXT]: {
      fromBuffer(dataBuffer: Buffer) {
        const reader = new BufferReader(dataBuffer);
        return {
          channel: reader.read({ type: 'UInt8' }),
          message: reader.read({ type: 'String', encoding: 'ascii' }),
        };
      },
      toBuffer({ channel, message }) {
        return new BufferWriter()
          .write({ type: 'UInt8', value: channel })
          .write({ type: 'String', value: message, encoding: 'ascii' })
          .buffer();
      },
    },
    [ServerPacketType.ADD_NEW_ACTOR]: {
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
      toBuffer({
        id,
        xPos,
        yPos,
        zRotation,
        type,
        maxHealth,
        currentHealth,
        name,
      }) {
        return new BufferWriter()
          .write({ type: 'UInt16LE', value: id })
          .write({ type: 'UInt16LE', value: xPos })
          .write({ type: 'UInt16LE', value: yPos })
          .offset(2)
          .write({ type: 'UInt16LE', value: zRotation })
          .write({ type: 'UInt8', value: type })
          .offset(1)
          .write({ type: 'UInt16LE', value: maxHealth })
          .write({ type: 'UInt16LE', value: currentHealth })
          .offset(1)
          .write({ type: 'StringNT', value: name, encoding: 'ascii' })
          .buffer();
      },
    },
    [ServerPacketType.ADD_ACTOR_COMMAND]: {
      fromBuffer(dataBuffer: Buffer) {
        const reader = new BufferReader(dataBuffer);
        return {
          actorId: reader.read({ type: 'UInt16LE' }),
          command: reader.read({ type: 'UInt8' }),
        };
      },
      toBuffer({ actorId, command }) {
        return new BufferWriter()
          .write({ type: 'UInt16LE', value: actorId })
          .write({ type: 'UInt8', value: command })
          .buffer();
      },
    },
    [ServerPacketType.YOU_ARE]: {
      fromBuffer(dataBuffer: Buffer) {
        const reader = new BufferReader(dataBuffer);
        return {
          actorId: reader.read({ type: 'UInt16LE' }),
        };
      },
      toBuffer({ actorId }) {
        return new BufferWriter()
          .write({ type: 'UInt16LE', value: actorId })
          .buffer();
      },
    },
    [ServerPacketType.SYNC_CLOCK]: {
      fromBuffer(dataBuffer: Buffer) {
        const reader = new BufferReader(dataBuffer);
        return {
          serverTimestamp: reader.read({ type: 'UInt32LE' }),
        };
      },
      toBuffer({ serverTimestamp }) {
        return new BufferWriter()
          .write({ type: 'UInt32LE', value: serverTimestamp })
          .buffer();
      },
    },
    [ServerPacketType.NEW_MINUTE]: {
      fromBuffer(dataBuffer: Buffer) {
        const reader = new BufferReader(dataBuffer);
        return {
          minute: reader.read({ type: 'UInt16LE' }),
        };
      },
      toBuffer({ minute }) {
        return new BufferWriter()
          .write({ type: 'UInt16LE', value: minute })
          .buffer();
      },
    },
    [ServerPacketType.REMOVE_ACTOR]: {
      fromBuffer(dataBuffer: Buffer) {
        const reader = new BufferReader(dataBuffer);
        return {
          actorId: reader.read({ type: 'UInt16LE' }),
        };
      },
      toBuffer({ actorId }) {
        return new BufferWriter()
          .write({ type: 'UInt16LE', value: actorId })
          .buffer();
      },
    },
    [ServerPacketType.CHANGE_MAP]: {
      fromBuffer(dataBuffer: Buffer) {
        const reader = new BufferReader(dataBuffer);
        return {
          mapFilePath: reader.read({ type: 'StringNT', encoding: 'ascii' }),
        };
      },
      toBuffer({ mapFilePath }) {
        return new BufferWriter()
          .write({ type: 'StringNT', value: mapFilePath, encoding: 'ascii' })
          .buffer();
      },
    },
    [ServerPacketType.PONG]: {
      fromBuffer(dataBuffer: Buffer) {
        const reader = new BufferReader(dataBuffer);
        return {
          echo: reader.read({ type: 'UInt32LE' }),
        };
      },
      toBuffer({ echo }) {
        return new BufferWriter()
          .write({ type: 'UInt32LE', value: echo })
          .buffer();
      },
    },
    [ServerPacketType.HERE_YOUR_STATS]: {
      fromBuffer(dataBuffer: Buffer) {
        const reader = new BufferReader(dataBuffer);

        return {
          attributes: {
            physique: {
              current: reader.read({ type: 'UInt16LE' }),
              base: reader.read({ type: 'UInt16LE' }),
            },
            coordination: {
              current: reader.read({ type: 'UInt16LE' }),
              base: reader.read({ type: 'UInt16LE' }),
            },
            reasoning: {
              current: reader.read({ type: 'UInt16LE' }),
              base: reader.read({ type: 'UInt16LE' }),
            },
            will: {
              current: reader.read({ type: 'UInt16LE' }),
              base: reader.read({ type: 'UInt16LE' }),
            },
            instinct: {
              current: reader.read({ type: 'UInt16LE' }),
              base: reader.read({ type: 'UInt16LE' }),
            },
            vitality: {
              current: reader.read({ type: 'UInt16LE' }),
              base: reader.read({ type: 'UInt16LE' }),
            },
          },
          nexus: {
            human: {
              current: reader.read({ type: 'UInt16LE' }),
              base: reader.read({ type: 'UInt16LE' }),
            },
            animal: {
              current: reader.read({ type: 'UInt16LE' }),
              base: reader.read({ type: 'UInt16LE' }),
            },
            vegetal: {
              current: reader.read({ type: 'UInt16LE' }),
              base: reader.read({ type: 'UInt16LE' }),
            },
            inorganic: {
              current: reader.read({ type: 'UInt16LE' }),
              base: reader.read({ type: 'UInt16LE' }),
            },
            artificial: {
              current: reader.read({ type: 'UInt16LE' }),
              base: reader.read({ type: 'UInt16LE' }),
            },
            magic: {
              current: reader.read({ type: 'UInt16LE' }),
              base: reader.read({ type: 'UInt16LE' }),
            },
          },
          skills: {
            attack: {
              current: reader.offset(16).read({ type: 'UInt16LE' }),
              base: reader.read({ type: 'UInt16LE' }),
            },
            defense: {
              current: reader.read({ type: 'UInt16LE' }),
              base: reader.read({ type: 'UInt16LE' }),
            },
            harvesting: {
              current: reader.offset(-20).read({ type: 'UInt16LE' }),
              base: reader.read({ type: 'UInt16LE' }),
            },
            alchemy: {
              current: reader.read({ type: 'UInt16LE' }),
              base: reader.read({ type: 'UInt16LE' }),
            },
            magic: {
              current: reader.offset(12).read({ type: 'UInt16LE' }),
              base: reader.read({ type: 'UInt16LE' }),
            },
            potion: {
              current: reader.read({ type: 'UInt16LE' }),
              base: reader.read({ type: 'UInt16LE' }),
            },
            summoning: {
              current: reader.offset(86).read({ type: 'UInt16LE' }),
              base: reader.read({ type: 'UInt16LE' }),
            },
            manufacturing: {
              current: reader.offset(-122).read({ type: 'UInt16LE' }),
              base: reader.read({ type: 'UInt16LE' }),
            },
            crafting: {
              current: reader.offset(126).read({ type: 'UInt16LE' }),
              base: reader.read({ type: 'UInt16LE' }),
            },
            engineering: {
              current: reader.offset(8).read({ type: 'UInt16LE' }),
              base: reader.read({ type: 'UInt16LE' }),
            },
            tailoring: {
              current: reader.offset(8).read({ type: 'UInt16LE' }),
              base: reader.read({ type: 'UInt16LE' }),
            },
            ranging: {
              current: reader.offset(8).read({ type: 'UInt16LE' }),
              base: reader.read({ type: 'UInt16LE' }),
            },
            overall: {
              current: reader.offset(-158).read({ type: 'UInt16LE' }),
              base: reader.read({ type: 'UInt16LE' }),
            },
          },
          carryCapacity: {
            current: reader.offset(16).read({ type: 'UInt16LE' }),
            base: reader.read({ type: 'UInt16LE' }),
          },
          materialPoints: {
            current: reader.read({ type: 'UInt16LE' }),
            base: reader.read({ type: 'UInt16LE' }),
          },
          etherealPoints: {
            current: reader.read({ type: 'UInt16LE' }),
            base: reader.read({ type: 'UInt16LE' }),
          },
          actionPoints: {
            current: reader.offset(134).read({ type: 'UInt16LE' }),
            base: reader.read({ type: 'UInt16LE' }),
          },
        };
      },
      toBuffer({
        attributes,
        nexus,
        skills,
        carryCapacity,
        materialPoints,
        etherealPoints,
        actionPoints,
      }) {
        return new BufferWriter()
          .write({ type: 'UInt16LE', value: attributes.physique.current })
          .write({ type: 'UInt16LE', value: attributes.physique.base })
          .write({ type: 'UInt16LE', value: attributes.coordination.current })
          .write({ type: 'UInt16LE', value: attributes.coordination.base })
          .write({ type: 'UInt16LE', value: attributes.reasoning.current })
          .write({ type: 'UInt16LE', value: attributes.reasoning.base })
          .write({ type: 'UInt16LE', value: attributes.will.current })
          .write({ type: 'UInt16LE', value: attributes.will.base })
          .write({ type: 'UInt16LE', value: attributes.instinct.current })
          .write({ type: 'UInt16LE', value: attributes.instinct.base })
          .write({ type: 'UInt16LE', value: attributes.vitality.current })
          .write({ type: 'UInt16LE', value: attributes.vitality.base })
          .write({ type: 'UInt16LE', value: nexus.human.current })
          .write({ type: 'UInt16LE', value: nexus.human.base })
          .write({ type: 'UInt16LE', value: nexus.animal.current })
          .write({ type: 'UInt16LE', value: nexus.animal.base })
          .write({ type: 'UInt16LE', value: nexus.vegetal.current })
          .write({ type: 'UInt16LE', value: nexus.vegetal.base })
          .write({ type: 'UInt16LE', value: nexus.inorganic.current })
          .write({ type: 'UInt16LE', value: nexus.inorganic.base })
          .write({ type: 'UInt16LE', value: nexus.artificial.current })
          .write({ type: 'UInt16LE', value: nexus.artificial.base })
          .write({ type: 'UInt16LE', value: nexus.magic.current })
          .write({ type: 'UInt16LE', value: nexus.magic.base })
          .write({ type: 'UInt16LE', value: skills.manufacturing.current })
          .write({ type: 'UInt16LE', value: skills.manufacturing.base })
          .write({ type: 'UInt16LE', value: skills.harvesting.current })
          .write({ type: 'UInt16LE', value: skills.harvesting.base })
          .write({ type: 'UInt16LE', value: skills.alchemy.current })
          .write({ type: 'UInt16LE', value: skills.alchemy.base })
          .write({ type: 'UInt16LE', value: skills.overall.current })
          .write({ type: 'UInt16LE', value: skills.overall.base })
          .write({ type: 'UInt16LE', value: skills.attack.current })
          .write({ type: 'UInt16LE', value: skills.attack.base })
          .write({ type: 'UInt16LE', value: skills.defense.current })
          .write({ type: 'UInt16LE', value: skills.defense.base })
          .write({ type: 'UInt16LE', value: skills.magic.current })
          .write({ type: 'UInt16LE', value: skills.magic.base })
          .write({ type: 'UInt16LE', value: skills.potion.current })
          .write({ type: 'UInt16LE', value: skills.potion.base })
          .write({ type: 'UInt16LE', value: carryCapacity.current })
          .write({ type: 'UInt16LE', value: carryCapacity.base })
          .write({ type: 'UInt16LE', value: materialPoints.current })
          .write({ type: 'UInt16LE', value: materialPoints.base })
          .write({ type: 'UInt16LE', value: etherealPoints.current })
          .write({ type: 'UInt16LE', value: etherealPoints.base })
          .offset(74)
          .write({ type: 'UInt16LE', value: skills.summoning.current })
          .write({ type: 'UInt16LE', value: skills.summoning.base })
          .offset(8)
          .write({ type: 'UInt16LE', value: skills.crafting.current })
          .write({ type: 'UInt16LE', value: skills.crafting.base })
          .offset(8)
          .write({ type: 'UInt16LE', value: skills.engineering.current })
          .write({ type: 'UInt16LE', value: skills.engineering.base })
          .offset(8)
          .write({ type: 'UInt16LE', value: skills.tailoring.current })
          .write({ type: 'UInt16LE', value: skills.tailoring.base })
          .offset(8)
          .write({ type: 'UInt16LE', value: skills.ranging.current })
          .write({ type: 'UInt16LE', value: skills.ranging.base })
          .offset(8)
          .write({ type: 'UInt16LE', value: actionPoints.current })
          .write({ type: 'UInt16LE', value: actionPoints.base })
          .buffer();
      },
    },
    [ServerPacketType.HERE_YOUR_INVENTORY]: {
      fromBuffer(dataBuffer: Buffer) {
        const reader = new BufferReader(dataBuffer);
        const itemsCount = reader.read({ type: 'UInt8' });
        const itemUidsEnabled =
          itemsCount * 10 === reader.bufferRemaining().length;
        const items = reader.readArray(() => {
          const imageId = reader.read({ type: 'UInt16LE' });
          const quantity = reader.read({ type: 'UInt32LE' });
          const position = reader.read({ type: 'UInt8' });
          const flags = reader.read({ type: 'UInt8' });
          const id = itemUidsEnabled
            ? reader.read({ type: 'UInt16LE' })
            : undefined;
          return { imageId, quantity, position, flags, id };
        });
        return { items };
      },
      toBuffer({ items }) {
        return new BufferWriter()
          .write({ type: 'UInt8', value: items.length })
          .writeArray(items, (writer, item) => {
            writer.write({ type: 'UInt16LE', value: item.imageId });
            writer.write({ type: 'UInt32LE', value: item.quantity });
            writer.write({ type: 'UInt8', value: item.position });
            writer.write({ type: 'UInt8', value: item.flags });

            if (item.id != null) {
              writer.write({ type: 'UInt16LE', value: item.id });
            }
          })
          .buffer();
      },
    },
    [ServerPacketType.ADD_NEW_ENHANCED_ACTOR]: {
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
      toBuffer({
        id,
        xPos,
        yPos,
        zRotation,
        type,
        skin,
        hair,
        shirt,
        pants,
        boots,
        head,
        shield,
        weapon,
        cape,
        helmet,
        maxHealth,
        currentHealth,
        kind,
        name,
        guild,
      }) {
        return new BufferWriter()
          .write({ type: 'UInt16LE', value: id })
          .write({ type: 'UInt16LE', value: xPos })
          .write({ type: 'UInt16LE', value: yPos })
          .offset(2)
          .write({ type: 'UInt16LE', value: zRotation })
          .write({ type: 'UInt8', value: type })
          .offset(1)
          .write({ type: 'UInt8', value: skin })
          .write({ type: 'UInt8', value: hair })
          .write({ type: 'UInt8', value: shirt })
          .write({ type: 'UInt8', value: pants })
          .write({ type: 'UInt8', value: boots })
          .write({ type: 'UInt8', value: head })
          .write({ type: 'UInt8', value: shield })
          .write({ type: 'UInt8', value: weapon })
          .write({ type: 'UInt8', value: cape })
          .write({ type: 'UInt8', value: helmet })
          .offset(1)
          .write({ type: 'UInt16LE', value: maxHealth })
          .write({ type: 'UInt16LE', value: currentHealth })
          .write({ type: 'UInt8', value: kind })
          .write({
            type: 'StringNT',
            value: `${name} ${guild}`,
            encoding: 'ascii',
          })
          .buffer();
      },
    },
    [ServerPacketType.PING_REQUEST]: {
      fromBuffer(dataBuffer: Buffer) {
        const reader = new BufferReader(dataBuffer);
        return {
          echo: reader.read({ type: 'UInt32LE' }),
        };
      },
      toBuffer({ echo }) {
        return new BufferWriter()
          .write({ type: 'UInt32LE', value: echo })
          .buffer();
      },
    },
    [ServerPacketType.GET_ACTIVE_CHANNELS]: {
      fromBuffer(dataBuffer: Buffer) {
        const reader = new BufferReader(dataBuffer);
        const activeChannelIndex = reader.read({ type: 'UInt8' });
        const channels = reader
          .readArray(() => reader.read({ type: 'UInt32LE' }))
          .filter((channel) => channel !== 0); // zero = no channel assigned

        const activeChannel = channels[activeChannelIndex];
        return { activeChannel, channels };
      },
      toBuffer({ activeChannel, channels }) {
        const activeChannelIndex = activeChannel
          ? channels.indexOf(activeChannel)
          : 0;
        return new BufferWriter()
          .write({ type: 'UInt8', value: activeChannelIndex })
          .writeArray(channels, (writer, channel) => {
            writer.write({ type: 'UInt32LE', value: channel ?? 0 }); // zero = no channel assigned
          })
          .buffer();
      },
    },
    [ServerPacketType.YOU_DONT_EXIST]: {
      fromBuffer(dataBuffer: Buffer) {
        return {};
      },
      toBuffer() {
        return new BufferWriter().buffer();
      },
    },
    [ServerPacketType.LOG_IN_OK]: {
      fromBuffer(dataBuffer: Buffer) {
        return {};
      },
      toBuffer() {
        return new BufferWriter().buffer();
      },
    },
    [ServerPacketType.LOG_IN_NOT_OK]: {
      fromBuffer(dataBuffer: Buffer) {
        const reader = new BufferReader(dataBuffer);
        return {
          reason: reader.read({ type: 'String', encoding: 'ascii' }),
        };
      },
      toBuffer({ reason }) {
        return new BufferWriter()
          .write({ type: 'String', value: reason, encoding: 'ascii' })
          .buffer();
      },
    },
  },
};
