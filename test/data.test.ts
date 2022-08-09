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
  EmoteId,
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
    [ClientPacketType.MOVE_TO]: {
      x: 135,
      y: 270,
    },
    [ClientPacketType.SEND_PM]: {
      recipientName: 'Player',
      message: 'hi there!',
    },
    [ClientPacketType.GET_PLAYER_INFO]: {
      actorId: 344,
    },
    [ClientPacketType.SIT_DOWN]: {
      sit: true,
    },
    [ClientPacketType.TURN_LEFT]: {},
    [ClientPacketType.TURN_RIGHT]: {},
    [ClientPacketType.PING]: {
      echo: Buffer.from([0x01, 0x02, 0x03, 0x04]),
    },
    [ClientPacketType.HEART_BEAT]: {},
    [ClientPacketType.LOCATE_ME]: {},
    [ClientPacketType.USE_MAP_OBJECT]: {
      objectId: 322,
      useWith: 4,
    },
    [ClientPacketType.LOOK_AT_INVENTORY_ITEM]: {
      position: 27,
    },
    [ClientPacketType.MOVE_INVENTORY_ITEM]: {
      positionFrom: 7,
      positionTo: 12,
    },
    [ClientPacketType.HARVEST]: {
      objectId: 1859,
    },
    [ClientPacketType.DROP_ITEM]: {
      position: 2,
      quantity: 10000,
    },
    [ClientPacketType.PICK_UP_ITEM]: {
      position: 4,
      quantity: 500,
    },
    [ClientPacketType.LOOK_AT_GROUND_ITEM]: {
      position: 5,
    },
    [ClientPacketType.INSPECT_BAG]: {
      bagId: 8,
    },
    [ClientPacketType.CLOSE_BAG]: {},
    [ClientPacketType.LOOK_AT_MAP_OBJECT]: {
      objectId: 329,
    },
    [ClientPacketType.USE_INVENTORY_ITEM]: {
      position: 11,
    },
    [ClientPacketType.TRADE_WITH]: {
      actorId: 42,
    },
    [ClientPacketType.PING_RESPONSE]: {
      echo: Buffer.from([0x04, 0x03, 0x02, 0x01]),
    },
    [ClientPacketType.DO_EMOTE]: {
      emoteId: EmoteId.PAT_BELLY,
    },
    [ClientPacketType.LOG_IN]: {
      username: 'foo',
      password: 'bar',
    },
    [ClientPacketType.GET_DATE]: {},
    [ClientPacketType.GET_TIME]: {},
    [ClientPacketType.SERVER_STATS]: {},
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
      echo: Buffer.from([0x06, 0x07, 0x08, 0x09]),
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
    [ServerPacketType.NPC_TEXT]: {
      text: 'What would you like to buy?',
    },
    [ServerPacketType.NPC_OPTIONS_LIST]: {
      options: [
        {
          responseText: 'Buy',
          responseId: 1,
          toActorId: 3024,
        },
        {
          responseText: 'Sell',
          responseId: 2,
          toActorId: 3024,
        },
        {
          responseText: 'Just passing by...',
          responseId: 3,
          toActorId: 3024,
        },
      ],
    },
    [ServerPacketType.SEND_NPC_INFO]: {
      npcName: 'Xaquelina',
      npcPortrait: 60,
    },
    [ServerPacketType.GET_TRADE_OBJECT]: {
      imageId: 316,
      quantity: 120,
      position: 1,
      id: 505,
      isFromStorage: false,
      isYours: true,
    },
    [ServerPacketType.GET_TRADE_ACCEPT]: {
      youAccepted: true,
    },
    [ServerPacketType.GET_TRADE_REJECT]: {
      youRejected: false,
    },
    [ServerPacketType.GET_TRADE_EXIT]: {},
    [ServerPacketType.REMOVE_TRADE_OBJECT]: {
      quantity: 50,
      position: 2,
      isYours: false,
    },
    [ServerPacketType.GET_YOUR_TRADEOBJECTS]: {
      items: [
        { imageId: 1, quantity: 20, position: 0, flags: 14, id: 43 },
        { imageId: 54, quantity: 6, position: 27, flags: 6, id: 35 },
        { imageId: 55, quantity: 6, position: 28, flags: 6, id: 36 },
        { imageId: 56, quantity: 30, position: 29, flags: 6, id: 37 },
        { imageId: 86, quantity: 1, position: 32, flags: 0, id: 93 },
        { imageId: 421, quantity: 1, position: 33, flags: 0, id: 620 },
        { imageId: 59, quantity: 8, position: 34, flags: 6, id: 40 },
      ],
    },
    [ServerPacketType.GET_TRADE_PARTNER_NAME]: {
      isStorageAvailable: true,
      tradePartnerName: 'Player',
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
      echo: Buffer.from([0x09, 0x08, 0x07, 0x06]),
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
