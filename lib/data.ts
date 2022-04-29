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
        const message = dataBuffer.toString('ascii');
        return { message };
      },
      toBuffer({ message }) {
        return Buffer.from(message, 'ascii');
      },
    },
    [ClientPacketType.PING]: {
      fromBuffer(dataBuffer: Buffer) {
        const echo = dataBuffer.readUInt32LE(0); // 4 bytes
        return { echo };
      },
      toBuffer({ echo }) {
        const echoBuffer = Buffer.alloc(4);
        echoBuffer.writeUInt32LE(echo);
        return echoBuffer;
      },
    },
    [ClientPacketType.HEART_BEAT]: {
      fromBuffer(dataBuffer: Buffer) {
        return {};
      },
      toBuffer() {
        return Buffer.alloc(0);
      },
    },
    [ClientPacketType.PING_RESPONSE]: {
      fromBuffer(dataBuffer: Buffer) {
        const echo = dataBuffer.readUInt32LE(0); // 4 bytes
        return { echo };
      },
      toBuffer({ echo }) {
        const echoBuffer = Buffer.alloc(4);
        echoBuffer.writeUInt32LE(echo);
        return echoBuffer;
      },
    },
    [ClientPacketType.LOG_IN]: {
      fromBuffer(dataBuffer: Buffer) {
        const [_, username, password] = dataBuffer
          .toString('ascii')
          .match(/^(\w+)\s(.+)\0$/)!;
        return { username, password };
      },
      toBuffer({ username, password }) {
        // A string with username and password separated by a space, ending with
        // a null-terminator.
        return Buffer.from(`${username} ${password}\0`, 'ascii');
      },
    },
  },
  server: {
    [ServerPacketType.RAW_TEXT]: {
      fromBuffer(dataBuffer: Buffer) {
        const channel = dataBuffer.readUInt8(0); // 1 byte
        const message = dataBuffer.toString('ascii', 1);
        return { channel, message };
      },
      toBuffer({ channel, message }) {
        const channelBuffer = Buffer.alloc(1);
        channelBuffer.writeUInt8(channel); // 1 byte
        const messageBuffer = Buffer.from(message, 'ascii');
        return Buffer.concat([channelBuffer, messageBuffer]);
      },
    },
    [ServerPacketType.ADD_NEW_ACTOR]: {
      fromBuffer(dataBuffer: Buffer) {
        const id = dataBuffer.readUInt16LE(0);
        const xPos = dataBuffer.readUInt16LE(2);
        const yPos = dataBuffer.readUInt16LE(4);
        const zRotation = dataBuffer.readUInt16LE(8);
        const type = dataBuffer.readUInt8(10);
        const maxHealth = dataBuffer.readUInt16LE(12);
        const currentHealth = dataBuffer.readUInt16LE(14);
        const [_, name] = dataBuffer
          .slice(17)
          .toString('ascii')
          .match(/^(.+?)\0/)!; // Capture until we encounter a null-terminator.

        return {
          id,
          xPos,
          yPos,
          zRotation,
          type,
          maxHealth,
          currentHealth,
          name,
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
        const idBuffer = Buffer.alloc(2);
        idBuffer.writeUInt16LE(id);
        const xPosBuffer = Buffer.alloc(2);
        xPosBuffer.writeUInt16LE(xPos);
        const yPosBuffer = Buffer.alloc(2);
        yPosBuffer.writeUInt16LE(yPos);
        const zRotationBuffer = Buffer.alloc(2);
        zRotationBuffer.writeUInt16LE(zRotation);
        const typeBuffer = Buffer.alloc(1);
        typeBuffer.writeUInt8(type);
        const maxHealthBuffer = Buffer.alloc(2);
        maxHealthBuffer.writeUInt16LE(maxHealth);
        const currentHealthBuffer = Buffer.alloc(2);
        currentHealthBuffer.writeUInt16LE(currentHealth);
        const nameBuffer = Buffer.from(`${name}\0`, 'ascii');

        return Buffer.concat([
          idBuffer,
          xPosBuffer,
          yPosBuffer,
          Buffer.alloc(2),
          zRotationBuffer,
          typeBuffer,
          Buffer.alloc(1),
          maxHealthBuffer,
          currentHealthBuffer,
          Buffer.alloc(1),
          nameBuffer,
        ]);
      },
    },
    [ServerPacketType.ADD_ACTOR_COMMAND]: {
      fromBuffer(dataBuffer: Buffer) {
        const actorId = dataBuffer.readUInt16LE(0); // 2 bytes
        const command = dataBuffer.readUInt8(2); // 1 byte
        return { actorId, command };
      },
      toBuffer({ actorId, command }) {
        const actorIdBuffer = Buffer.alloc(2);
        actorIdBuffer.writeUInt16LE(actorId); // 2 bytes
        const commandBuffer = Buffer.alloc(1);
        commandBuffer.writeUInt8(command); // 1 byte
        return Buffer.concat([actorIdBuffer, commandBuffer]);
      },
    },
    [ServerPacketType.YOU_ARE]: {
      fromBuffer(dataBuffer: Buffer) {
        const actorId = dataBuffer.readUInt16LE(0);
        return { actorId };
      },
      toBuffer({ actorId }) {
        const actorIdBuffer = Buffer.alloc(2);
        actorIdBuffer.writeUInt16LE(actorId); // 2 bytes
        return actorIdBuffer;
      },
    },
    [ServerPacketType.SYNC_CLOCK]: {
      fromBuffer(dataBuffer: Buffer) {
        const serverTimestamp = dataBuffer.readUInt32LE(0); // 4 bytes
        return { serverTimestamp };
      },
      toBuffer({ serverTimestamp }) {
        const serverTimestampBuffer = Buffer.alloc(4);
        serverTimestampBuffer.writeUInt32LE(serverTimestamp);
        return serverTimestampBuffer;
      },
    },
    [ServerPacketType.NEW_MINUTE]: {
      fromBuffer(dataBuffer: Buffer) {
        const minute = dataBuffer.readUInt16LE(0);
        return { minute };
      },
      toBuffer({ minute }) {
        const minuteBuffer = Buffer.alloc(2);
        minuteBuffer.writeUInt16LE(minute); // 2 bytes
        return minuteBuffer;
      },
    },
    [ServerPacketType.REMOVE_ACTOR]: {
      fromBuffer(dataBuffer: Buffer) {
        const actorId = dataBuffer.readUInt16LE(0);
        return { actorId };
      },
      toBuffer({ actorId }) {
        const actorIdBuffer = Buffer.alloc(2);
        actorIdBuffer.writeUInt16LE(actorId); // 2 bytes
        return actorIdBuffer;
      },
    },
    [ServerPacketType.CHANGE_MAP]: {
      fromBuffer(dataBuffer: Buffer) {
        const [_, mapFilePath] = dataBuffer
          .toString('ascii')
          .match(/^(.+)\0$/)!;
        return { mapFilePath };
      },
      toBuffer({ mapFilePath }) {
        // A string representing the path to a map file, ending with a null-terminator.
        return Buffer.from(`${mapFilePath}\0`, 'ascii');
      },
    },
    [ServerPacketType.PONG]: {
      fromBuffer(dataBuffer: Buffer) {
        const echo = dataBuffer.readUInt32LE(0); // 4 bytes
        return { echo };
      },
      toBuffer({ echo }) {
        const echoBuffer = Buffer.alloc(4);
        echoBuffer.writeUInt32LE(echo);
        return echoBuffer;
      },
    },
    [ServerPacketType.HERE_YOUR_STATS]: {
      fromBuffer(dataBuffer: Buffer) {
        return {
          attributes: {
            physique: {
              current: dataBuffer.readUInt16LE(0),
              base: dataBuffer.readUInt16LE(2),
            },
            coordination: {
              current: dataBuffer.readUInt16LE(4),
              base: dataBuffer.readUInt16LE(6),
            },
            reasoning: {
              current: dataBuffer.readUInt16LE(8),
              base: dataBuffer.readUInt16LE(10),
            },
            will: {
              current: dataBuffer.readUInt16LE(12),
              base: dataBuffer.readUInt16LE(14),
            },
            instinct: {
              current: dataBuffer.readUInt16LE(16),
              base: dataBuffer.readUInt16LE(18),
            },
            vitality: {
              current: dataBuffer.readUInt16LE(20),
              base: dataBuffer.readUInt16LE(22),
            },
          },
          nexus: {
            human: {
              current: dataBuffer.readUInt16LE(24),
              base: dataBuffer.readUInt16LE(26),
            },
            animal: {
              current: dataBuffer.readUInt16LE(28),
              base: dataBuffer.readUInt16LE(30),
            },
            vegetal: {
              current: dataBuffer.readUInt16LE(32),
              base: dataBuffer.readUInt16LE(34),
            },
            inorganic: {
              current: dataBuffer.readUInt16LE(36),
              base: dataBuffer.readUInt16LE(38),
            },
            artificial: {
              current: dataBuffer.readUInt16LE(40),
              base: dataBuffer.readUInt16LE(42),
            },
            magic: {
              current: dataBuffer.readUInt16LE(44),
              base: dataBuffer.readUInt16LE(46),
            },
          },
          skills: {
            attack: {
              current: dataBuffer.readUInt16LE(64),
              base: dataBuffer.readUInt16LE(66),
            },
            defense: {
              current: dataBuffer.readUInt16LE(68),
              base: dataBuffer.readUInt16LE(70),
            },
            harvesting: {
              current: dataBuffer.readUInt16LE(52),
              base: dataBuffer.readUInt16LE(54),
            },
            alchemy: {
              current: dataBuffer.readUInt16LE(56),
              base: dataBuffer.readUInt16LE(58),
            },
            magic: {
              current: dataBuffer.readUInt16LE(72),
              base: dataBuffer.readUInt16LE(74),
            },
            potion: {
              current: dataBuffer.readUInt16LE(76),
              base: dataBuffer.readUInt16LE(78),
            },
            summoning: {
              current: dataBuffer.readUInt16LE(166),
              base: dataBuffer.readUInt16LE(168),
            },
            manufacturing: {
              current: dataBuffer.readUInt16LE(48),
              base: dataBuffer.readUInt16LE(50),
            },
            crafting: {
              current: dataBuffer.readUInt16LE(178),
              base: dataBuffer.readUInt16LE(180),
            },
            engineering: {
              current: dataBuffer.readUInt16LE(190),
              base: dataBuffer.readUInt16LE(192),
            },
            tailoring: {
              current: dataBuffer.readUInt16LE(202),
              base: dataBuffer.readUInt16LE(204),
            },
            ranging: {
              current: dataBuffer.readUInt16LE(214),
              base: dataBuffer.readUInt16LE(216),
            },
            overall: {
              current: dataBuffer.readUInt16LE(60),
              base: dataBuffer.readUInt16LE(62),
            },
          },
          carryCapacity: {
            current: dataBuffer.readUInt16LE(80),
            base: dataBuffer.readUInt16LE(82),
          },
          materialPoints: {
            current: dataBuffer.readUInt16LE(84),
            base: dataBuffer.readUInt16LE(86),
          },
          etherealPoints: {
            current: dataBuffer.readUInt16LE(88),
            base: dataBuffer.readUInt16LE(90),
          },
          actionPoints: {
            current: dataBuffer.readUInt16LE(226),
            base: dataBuffer.readUInt16LE(228),
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
        const physiqueBuffer = Buffer.alloc(4);
        physiqueBuffer.writeUInt16LE(attributes.physique.current, 0);
        physiqueBuffer.writeUInt16LE(attributes.physique.base, 2);
        const coordinationBuffer = Buffer.alloc(4);
        coordinationBuffer.writeUInt16LE(attributes.coordination.current, 0);
        coordinationBuffer.writeUInt16LE(attributes.coordination.base, 2);
        const reasoningBuffer = Buffer.alloc(4);
        reasoningBuffer.writeUInt16LE(attributes.reasoning.current, 0);
        reasoningBuffer.writeUInt16LE(attributes.reasoning.base, 2);
        const willBuffer = Buffer.alloc(4);
        willBuffer.writeUInt16LE(attributes.will.current, 0);
        willBuffer.writeUInt16LE(attributes.will.base, 2);
        const instinctBuffer = Buffer.alloc(4);
        instinctBuffer.writeUInt16LE(attributes.instinct.current, 0);
        instinctBuffer.writeUInt16LE(attributes.instinct.base, 2);
        const vitalityBuffer = Buffer.alloc(4);
        vitalityBuffer.writeUInt16LE(attributes.vitality.current, 0);
        vitalityBuffer.writeUInt16LE(attributes.vitality.base, 2);
        const humanBuffer = Buffer.alloc(4);
        humanBuffer.writeUInt16LE(nexus.human.current, 0);
        humanBuffer.writeUInt16LE(nexus.human.base, 2);
        const animalBuffer = Buffer.alloc(4);
        animalBuffer.writeUInt16LE(nexus.animal.current, 0);
        animalBuffer.writeUInt16LE(nexus.animal.base, 2);
        const vegetalBuffer = Buffer.alloc(4);
        vegetalBuffer.writeUInt16LE(nexus.vegetal.current, 0);
        vegetalBuffer.writeUInt16LE(nexus.vegetal.base, 2);
        const inorganicBuffer = Buffer.alloc(4);
        inorganicBuffer.writeUInt16LE(nexus.inorganic.current, 0);
        inorganicBuffer.writeUInt16LE(nexus.inorganic.base, 2);
        const artificialBuffer = Buffer.alloc(4);
        artificialBuffer.writeUInt16LE(nexus.artificial.current, 0);
        artificialBuffer.writeUInt16LE(nexus.artificial.base, 2);
        const magicBuffer = Buffer.alloc(4);
        magicBuffer.writeUInt16LE(nexus.magic.current, 0);
        magicBuffer.writeUInt16LE(nexus.magic.base, 2);
        const attackBuffer = Buffer.alloc(4);
        attackBuffer.writeUInt16LE(skills.attack.current, 0);
        attackBuffer.writeUInt16LE(skills.attack.base, 2);
        const defenseBuffer = Buffer.alloc(4);
        defenseBuffer.writeUInt16LE(skills.defense.current, 0);
        defenseBuffer.writeUInt16LE(skills.defense.base, 2);
        const harvestingBuffer = Buffer.alloc(4);
        harvestingBuffer.writeUInt16LE(skills.harvesting.current, 0);
        harvestingBuffer.writeUInt16LE(skills.harvesting.base, 2);
        const alchemyBuffer = Buffer.alloc(4);
        alchemyBuffer.writeUInt16LE(skills.alchemy.current, 0);
        alchemyBuffer.writeUInt16LE(skills.alchemy.base, 2);
        const magicSkillBuffer = Buffer.alloc(4);
        magicSkillBuffer.writeUInt16LE(skills.magic.current, 0);
        magicSkillBuffer.writeUInt16LE(skills.magic.base, 2);
        const potionBuffer = Buffer.alloc(4);
        potionBuffer.writeUInt16LE(skills.potion.current, 0);
        potionBuffer.writeUInt16LE(skills.potion.base, 2);
        const summoningBuffer = Buffer.alloc(4);
        summoningBuffer.writeUInt16LE(skills.summoning.current, 0);
        summoningBuffer.writeUInt16LE(skills.summoning.base, 2);
        const manufacturingBuffer = Buffer.alloc(4);
        manufacturingBuffer.writeUInt16LE(skills.manufacturing.current, 0);
        manufacturingBuffer.writeUInt16LE(skills.manufacturing.base, 2);
        const craftingBuffer = Buffer.alloc(4);
        craftingBuffer.writeUInt16LE(skills.crafting.current, 0);
        craftingBuffer.writeUInt16LE(skills.crafting.base, 2);
        const engineeringBuffer = Buffer.alloc(4);
        engineeringBuffer.writeUInt16LE(skills.engineering.current, 0);
        engineeringBuffer.writeUInt16LE(skills.engineering.base, 2);
        const tailoringBuffer = Buffer.alloc(4);
        tailoringBuffer.writeUInt16LE(skills.tailoring.current, 0);
        tailoringBuffer.writeUInt16LE(skills.tailoring.base, 2);
        const rangingBuffer = Buffer.alloc(4);
        rangingBuffer.writeUInt16LE(skills.ranging.current, 0);
        rangingBuffer.writeUInt16LE(skills.ranging.base, 2);
        const overallBuffer = Buffer.alloc(4);
        overallBuffer.writeUInt16LE(skills.overall.current, 0);
        overallBuffer.writeUInt16LE(skills.overall.base, 2);
        const carryCapacityBuffer = Buffer.alloc(4);
        carryCapacityBuffer.writeUInt16LE(carryCapacity.current, 0);
        carryCapacityBuffer.writeUInt16LE(carryCapacity.base, 2);
        const materialPointsBuffer = Buffer.alloc(4);
        materialPointsBuffer.writeUInt16LE(materialPoints.current, 0);
        materialPointsBuffer.writeUInt16LE(materialPoints.base, 2);
        const etherealPointsBuffer = Buffer.alloc(4);
        etherealPointsBuffer.writeUInt16LE(etherealPoints.current, 0);
        etherealPointsBuffer.writeUInt16LE(etherealPoints.base, 2);
        const actionPointsBuffer = Buffer.alloc(4);
        actionPointsBuffer.writeUInt16LE(actionPoints.current, 0);
        actionPointsBuffer.writeUInt16LE(actionPoints.base, 2);

        return Buffer.concat([
          physiqueBuffer,
          coordinationBuffer,
          reasoningBuffer,
          willBuffer,
          instinctBuffer,
          vitalityBuffer,
          humanBuffer,
          animalBuffer,
          vegetalBuffer,
          inorganicBuffer,
          artificialBuffer,
          magicBuffer,
          manufacturingBuffer,
          harvestingBuffer,
          alchemyBuffer,
          overallBuffer,
          attackBuffer,
          defenseBuffer,
          magicSkillBuffer,
          potionBuffer,
          carryCapacityBuffer,
          materialPointsBuffer,
          etherealPointsBuffer,
          Buffer.alloc(74),
          summoningBuffer,
          Buffer.alloc(8),
          craftingBuffer,
          Buffer.alloc(8),
          engineeringBuffer,
          Buffer.alloc(8),
          tailoringBuffer,
          Buffer.alloc(8),
          rangingBuffer,
          Buffer.alloc(8),
          actionPointsBuffer,
        ]);
      },
    },
    [ServerPacketType.HERE_YOUR_INVENTORY]: {
      fromBuffer(dataBuffer: Buffer) {
        const itemsCount = dataBuffer.readUInt8(0);
        const itemsBuffer = dataBuffer.slice(1);
        const itemUidsEnabled = itemsCount * 10 === itemsBuffer.byteLength;
        const items = itemsBuffer
          .reduce<Buffer[]>((arr, byte, index) => {
            const itemBuffer =
              index % (itemUidsEnabled ? 10 : 8) === 0
                ? Buffer.alloc(0)
                : arr.pop()!;
            return [...arr, Buffer.from([...itemBuffer.values(), byte])];
          }, [])
          .map((itemBuffer) => {
            const imageId = itemBuffer.readUInt16LE(0);
            const quantity = itemBuffer.readUInt32LE(2);
            const position = itemBuffer.readUInt8(6);
            const flags = itemBuffer.readUInt8(7);
            const id = itemUidsEnabled ? itemBuffer.readUInt16LE(8) : undefined;
            return { imageId, quantity, position, flags, id };
          });

        return { items };
      },
      toBuffer({ items }) {
        const itemsCountBuffer = Buffer.alloc(1);
        itemsCountBuffer.writeUInt8(items.length);
        const itemBuffers = items.map(
          ({ imageId, quantity, position, flags, id }) => {
            const imageIdBuffer = Buffer.alloc(2);
            imageIdBuffer.writeUInt16LE(imageId);
            const quantityBuffer = Buffer.alloc(4);
            quantityBuffer.writeUInt32LE(quantity);
            const positionBuffer = Buffer.alloc(1);
            positionBuffer.writeUInt8(position);
            const flagsBuffer = Buffer.alloc(1);
            flagsBuffer.writeUInt8(flags);

            let idBuffer = Buffer.alloc(0);
            if (id != null) {
              idBuffer = Buffer.alloc(2);
              idBuffer.writeUInt16LE(id);
            }

            return Buffer.concat([
              imageIdBuffer,
              quantityBuffer,
              positionBuffer,
              flagsBuffer,
              idBuffer,
            ]);
          }
        );

        return Buffer.concat([itemsCountBuffer, ...itemBuffers]);
      },
    },
    [ServerPacketType.ADD_NEW_ENHANCED_ACTOR]: {
      fromBuffer(dataBuffer: Buffer) {
        const id = dataBuffer.readUInt16LE(0);
        const xPos = dataBuffer.readUInt16LE(2);
        const yPos = dataBuffer.readUInt16LE(4);
        const zRotation = dataBuffer.readUInt16LE(8);
        const type = dataBuffer.readUInt8(10);
        const skin = dataBuffer.readUInt8(12);
        const hair = dataBuffer.readUInt8(13);
        const shirt = dataBuffer.readUInt8(14);
        const pants = dataBuffer.readUInt8(15);
        const boots = dataBuffer.readUInt8(16);
        const head = dataBuffer.readUInt8(17);
        const shield = dataBuffer.readUInt8(18);
        const weapon = dataBuffer.readUInt8(19);
        const cape = dataBuffer.readUInt8(20);
        const helmet = dataBuffer.readUInt8(21);
        const maxHealth = dataBuffer.readUInt16LE(23);
        const currentHealth = dataBuffer.readUInt16LE(25);
        const kind = dataBuffer.readUInt8(27);

        // TODO: Need to strip out any leading color codes from name and guild.
        // https://github.com/raduprv/Eternal-Lands/blob/0c6335c3bf8bdbfbb7bcfb2eab75f00e26ad1a7b/new_actors.c#L312
        const [name, guild] = dataBuffer
          .slice(28)
          .toString('ascii')
          .match(/^(.+?)\0/)![1] // Capture until we encounter a null-terminator.
          .split(' '); // Name and guild are separated by a space.

        return {
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
        const idBuffer = Buffer.alloc(2);
        idBuffer.writeUInt16LE(id);
        const xPosBuffer = Buffer.alloc(2);
        xPosBuffer.writeUInt16LE(xPos);
        const yPosBuffer = Buffer.alloc(2);
        yPosBuffer.writeUInt16LE(yPos);
        const zRotationBuffer = Buffer.alloc(2);
        zRotationBuffer.writeUInt16LE(zRotation);
        const typeBuffer = Buffer.alloc(1);
        typeBuffer.writeUInt8(type);
        const skinBuffer = Buffer.alloc(1);
        skinBuffer.writeUInt8(skin);
        const hairBuffer = Buffer.alloc(1);
        hairBuffer.writeUInt8(hair);
        const shirtBuffer = Buffer.alloc(1);
        shirtBuffer.writeUInt8(shirt);
        const pantsBuffer = Buffer.alloc(1);
        pantsBuffer.writeUInt8(pants);
        const bootsBuffer = Buffer.alloc(1);
        bootsBuffer.writeUInt8(boots);
        const headBuffer = Buffer.alloc(1);
        headBuffer.writeUInt8(head);
        const shieldBuffer = Buffer.alloc(1);
        shieldBuffer.writeUInt8(shield);
        const weaponBuffer = Buffer.alloc(1);
        weaponBuffer.writeUInt8(weapon);
        const capeBuffer = Buffer.alloc(1);
        capeBuffer.writeUInt8(cape);
        const helmetBuffer = Buffer.alloc(1);
        helmetBuffer.writeUInt8(helmet);
        const maxHealthBuffer = Buffer.alloc(2);
        maxHealthBuffer.writeUInt16LE(maxHealth);
        const currentHealthBuffer = Buffer.alloc(2);
        currentHealthBuffer.writeUInt16LE(currentHealth);
        const kindBuffer = Buffer.alloc(1);
        kindBuffer.writeUInt8(kind);
        const nameAndGuildBuffer = Buffer.from(`${name} ${guild}\0`, 'ascii');

        return Buffer.concat([
          idBuffer,
          xPosBuffer,
          yPosBuffer,
          Buffer.alloc(2),
          zRotationBuffer,
          typeBuffer,
          Buffer.alloc(1),
          skinBuffer,
          hairBuffer,
          shirtBuffer,
          pantsBuffer,
          bootsBuffer,
          headBuffer,
          shieldBuffer,
          weaponBuffer,
          capeBuffer,
          helmetBuffer,
          Buffer.alloc(1),
          maxHealthBuffer,
          currentHealthBuffer,
          kindBuffer,
          nameAndGuildBuffer,
        ]);
      },
    },
    [ServerPacketType.PING_REQUEST]: {
      fromBuffer(dataBuffer: Buffer) {
        const echo = dataBuffer.readUInt32LE(0); // 4 bytes
        return { echo };
      },
      toBuffer({ echo }) {
        const echoBuffer = Buffer.alloc(4);
        echoBuffer.writeUInt32LE(echo);
        return echoBuffer;
      },
    },
    [ServerPacketType.YOU_DONT_EXIST]: {
      fromBuffer(dataBuffer: Buffer) {
        return {};
      },
      toBuffer() {
        return Buffer.alloc(0);
      },
    },
    [ServerPacketType.LOG_IN_OK]: {
      fromBuffer(dataBuffer: Buffer) {
        return {};
      },
      toBuffer() {
        return Buffer.alloc(0);
      },
    },
    [ServerPacketType.LOG_IN_NOT_OK]: {
      fromBuffer(dataBuffer: Buffer) {
        const reason = dataBuffer.toString('ascii');
        return { reason };
      },
      toBuffer({ reason }) {
        return Buffer.from(reason, 'ascii');
      },
    },
  },
};
