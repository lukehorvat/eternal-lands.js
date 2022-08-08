import {
  ClientPacket,
  ClientPacketData,
  ClientPacketType,
} from '../lib/data/client';
import {
  ServerPacket,
  ServerPacketData,
  ServerPacketType,
} from '../lib/data/server';
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
  StatType,
} from '../lib/constants';

test('Parsing complete and incomplete client packets', () => {
  const packetData: {
    [Type in ClientPacketType]: ClientPacketData[Type];
  } = {
    [ClientPacketType.UNSUPPORTED]: {
      type: 255,
      data: Buffer.from([0x01, 0x02, 0x03]),
    },
    [ClientPacketType.RAW_TEXT]: {
      message: 'test',
    },
    [ClientPacketType.PING]: {
      echo: 123,
    },
    [ClientPacketType.HEART_BEAT]: {},
    [ClientPacketType.LOCATE_ME]: {},
    [ClientPacketType.TRADE_WITH]: {
      actorId: 42,
    },
    [ClientPacketType.PING_RESPONSE]: {
      echo: 321,
    },
    [ClientPacketType.LOG_IN]: {
      username: 'foo',
      password: 'bar',
    },
  };

  (Object.values(ClientPacketType) as ClientPacketType[])
    .filter((value) => !isNaN(Number(value))) // TS enums... 🙈
    .map((type) => new ClientPacket(type, packetData[type]))
    .forEach((_, index, arr) => {
      const packets = arr.slice(0, index + 1);
      const packetBuffers = packets.map((packet) => packet.toBuffer());
      const lastPacketBuffer = packetBuffers.pop()!;

      for (let i = 0; i <= lastPacketBuffer.length; i++) {
        const slicedLastPacketBuffer = lastPacketBuffer.subarray(0, i);
        const { packets: parsedPackets, remainingBuffer } =
          ClientPacket.fromBuffer(
            Buffer.concat([...packetBuffers, slicedLastPacketBuffer])
          );
        if (slicedLastPacketBuffer.length < lastPacketBuffer.length) {
          expect(parsedPackets).toStrictEqual(
            packets.slice(0, packets.length - 1)
          );
          expect(remainingBuffer).toStrictEqual(slicedLastPacketBuffer);
        } else {
          expect(parsedPackets).toStrictEqual(packets);
          expect(remainingBuffer.length).toBe(0);
        }
      }
    });
});

test('Parsing complete and incomplete server packets', () => {
  const packetData: {
    [Type in ServerPacketType]: ServerPacketData[Type];
  } = {
    [ServerPacketType.UNSUPPORTED]: {
      type: 255,
      data: Buffer.from([0x01, 0x02, 0x03]),
    },
    [ServerPacketType.RAW_TEXT]: {
      channel: ChatChannel.LOCAL,
      message: 'test',
    },
    [ServerPacketType.ADD_NEW_ACTOR]: {
      id: 42,
      xPos: 100,
      yPos: 100,
      zRotation: 270,
      type: ActorType.RAT,
      maxHealth: 15,
      currentHealth: 10,
      name: 'Rat',
    },
    [ServerPacketType.ADD_ACTOR_COMMAND]: {
      actorId: 42,
      command: ActorCommand.MOVE_NW,
    },
    [ServerPacketType.YOU_ARE]: {
      actorId: 42,
    },
    [ServerPacketType.SYNC_CLOCK]: {
      serverTimestamp: 123456789,
    },
    [ServerPacketType.NEW_MINUTE]: {
      minute: 138,
    },
    [ServerPacketType.REMOVE_ACTOR]: {
      actorId: 42,
    },
    [ServerPacketType.CHANGE_MAP]: {
      mapFilePath: './maps/startmap.elm',
    },
    [ServerPacketType.KILL_ALL_ACTORS]: {},
    [ServerPacketType.GET_TELEPORTERS_LIST]: {
      teleporters: [
        { x: 509, y: 147 },
        { x: 84, y: 520 },
        { x: 143, y: 259 },
        { x: 484, y: 518 },
      ],
    },
    [ServerPacketType.PONG]: {
      echo: 123,
    },
    [ServerPacketType.TELEPORT_IN]: {
      x: 150,
      y: 555,
    },
    [ServerPacketType.TELEPORT_OUT]: {
      x: 63,
      y: 26,
    },
    [ServerPacketType.HERE_YOUR_STATS]: {
      attributes: {
        physique: { current: 24, base: 24 },
        coordination: { current: 30, base: 30 },
        reasoning: { current: 10, base: 10 },
        will: { current: 16, base: 16 },
        instinct: { current: 4, base: 4 },
        vitality: { current: 8, base: 8 },
      },
      nexus: {
        human: { current: 7, base: 7 },
        animal: { current: 1, base: 1 },
        vegetal: { current: 5, base: 5 },
        inorganic: { current: 2, base: 2 },
        artificial: { current: 3, base: 3 },
        magic: { current: 0, base: 0 },
      },
      skills: {
        overall: { current: 101, base: 103 },
        attack: { current: 42, base: 42 },
        defense: { current: 43, base: 43 },
        harvesting: { current: 44, base: 44 },
        alchemy: { current: 52, base: 52 },
        magic: { current: 26, base: 26 },
        potion: { current: 12, base: 12 },
        summoning: { current: 24, base: 24 },
        manufacturing: { current: 15, base: 15 },
        crafting: { current: 11, base: 11 },
        engineering: { current: 38, base: 38 },
        tailoring: { current: 7, base: 7 },
        ranging: { current: 19, base: 19 },
      },
      carryCapacity: { current: 507, base: 540 },
      materialPoints: { current: 70, base: 75 },
      etherealPoints: { current: 31, base: 40 },
      actionPoints: { current: 80, base: 100 },
    },
    [ServerPacketType.HERE_YOUR_INVENTORY]: {
      items: [
        { imageId: 28, quantity: 79, position: 0, flags: 7, id: 3 },
        { imageId: 3, quantity: 11, position: 1, flags: 4, id: 20 },
        { imageId: 59, quantity: 36, position: 3, flags: 6, id: 40 },
      ],
    },
    [ServerPacketType.INVENTORY_ITEM_TEXT]: {
      text: `You can't wear this item!`,
    },
    [ServerPacketType.GET_NEW_INVENTORY_ITEM]: {
      imageId: 473,
      quantity: 154,
      position: 1,
      flags: 6,
      id: 719,
    },
    [ServerPacketType.REMOVE_ITEM_FROM_INVENTORY]: {
      position: 9,
    },
    [ServerPacketType.HERE_YOUR_GROUND_ITEMS]: {
      items: [
        { imageId: 77, quantity: 2, position: 0 },
        { imageId: 59, quantity: 8, position: 1 },
      ],
    },
    [ServerPacketType.GET_NEW_GROUND_ITEM]: {
      imageId: 86,
      quantity: 3,
      position: 1,
    },
    [ServerPacketType.REMOVE_ITEM_FROM_GROUND]: {
      position: 4,
    },
    [ServerPacketType.CLOSE_BAG]: {},
    [ServerPacketType.GET_NEW_BAG]: {
      x: 134,
      y: 159,
      bagId: 1,
    },
    [ServerPacketType.GET_BAGS_LIST]: {
      bags: [
        { x: 266, y: 61, bagId: 0 },
        { x: 268, y: 62, bagId: 1 },
      ],
    },
    [ServerPacketType.DESTROY_BAG]: {
      bagId: 2,
    },
    [ServerPacketType.GET_ACTOR_DAMAGE]: {
      actorId: 123,
      damageAmount: 46,
    },
    [ServerPacketType.GET_ACTOR_HEAL]: {
      actorId: 456,
      healAmount: 218,
    },
    [ServerPacketType.SEND_PARTIAL_STAT]: {
      statType: StatType.FOOD_LEVEL,
      statValue: -16,
    },
    [ServerPacketType.ADD_NEW_ENHANCED_ACTOR]: {
      id: 42,
      xPos: 100,
      yPos: 100,
      zRotation: 270,
      type: ActorType.HUMAN_MALE,
      skin: ActorSkin.PALE,
      hair: ActorHair.BROWN,
      shirt: ActorShirt.STEEL_PLATE_ARMOR,
      pants: ActorPants.STEEL_CUISSES,
      boots: ActorBoots.STEEL_GREAVE,
      head: ActorHead.ONE,
      shield: ActorShield.STEEL,
      weapon: ActorWeapon.SWORD_ORC_SLAYER,
      cape: ActorCape.FUR,
      helmet: ActorHelmet.CROWN_OF_LIFE,
      maxHealth: 200,
      currentHealth: 150,
      kind: ActorKind.HUMAN,
      name: 'Player',
      guild: 'TEST',
    },
    [ServerPacketType.PING_REQUEST]: {
      echo: 321,
    },
    [ServerPacketType.GET_ACTIVE_CHANNELS]: {
      activeChannel: 80100,
      channels: [6, 80100],
    },
    [ServerPacketType.YOU_DONT_EXIST]: {},
    [ServerPacketType.LOG_IN_OK]: {},
    [ServerPacketType.LOG_IN_NOT_OK]: {
      reason: 'Wrong password!',
    },
  };

  (Object.values(ServerPacketType) as ServerPacketType[])
    .filter((value) => !isNaN(Number(value))) // TS enums... 🙈
    .map((type) => new ServerPacket(type, packetData[type]))
    .forEach((_, index, arr) => {
      const packets = arr.slice(0, index + 1);
      const packetBuffers = packets.map((packet) => packet.toBuffer());
      const lastPacketBuffer = packetBuffers.pop()!;

      for (let i = 0; i <= lastPacketBuffer.length; i++) {
        const slicedLastPacketBuffer = lastPacketBuffer.subarray(0, i);
        const { packets: parsedPackets, remainingBuffer } =
          ServerPacket.fromBuffer(
            Buffer.concat([...packetBuffers, slicedLastPacketBuffer])
          );
        if (slicedLastPacketBuffer.length < lastPacketBuffer.length) {
          expect(parsedPackets).toStrictEqual(
            packets.slice(0, packets.length - 1)
          );
          expect(remainingBuffer).toStrictEqual(slicedLastPacketBuffer);
        } else {
          expect(parsedPackets).toStrictEqual(packets);
          expect(remainingBuffer.length).toBe(0);
        }
      }
    });
});
