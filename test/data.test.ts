import {
  ClientPacketData,
  ServerPacketData,
  packetDataParsers,
} from '../lib/data';
import { ClientPacketType, ServerPacketType } from '../lib/types';
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
} from '../lib/constants';

test('Client packet data parsing', () => {
  const packetData: {
    [Type in ClientPacketType]: ClientPacketData[Type];
  } = {
    [ClientPacketType.RAW_TEXT]: { message: 'test' },
    [ClientPacketType.PING]: { echo: 123 },
    [ClientPacketType.HEART_BEAT]: {},
    [ClientPacketType.PING_RESPONSE]: { echo: 321 },
    [ClientPacketType.PING_RESPONSE]: { echo: 321 },
    [ClientPacketType.LOG_IN]: { username: 'foo', password: 'bar' },
  };

  (Object.values(ClientPacketType) as ClientPacketType[])
    .filter((value) => !isNaN(Number(value))) // TS enums... 🙈
    .forEach((type) => {
      const dataParser = packetDataParsers.client[type];
      const data = packetData[type];
      const dataBuffer = dataParser.toBuffer(data as any);

      expect(dataParser.fromBuffer(dataBuffer)).toEqual(data);
    });
});

test('Server packet data parsing', () => {
  const packetData: {
    [Type in ServerPacketType]: ServerPacketData[Type];
  } = {
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
    [ServerPacketType.YOU_ARE]: { actorId: 42 },
    [ServerPacketType.SYNC_CLOCK]: { serverTimestamp: 123456789 },
    [ServerPacketType.NEW_MINUTE]: { minute: 138 },
    [ServerPacketType.REMOVE_ACTOR]: { actorId: 42 },
    [ServerPacketType.CHANGE_MAP]: { mapFilePath: './maps/startmap.elm' },
    [ServerPacketType.PONG]: { echo: 123 },
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
        overall: { current: 70, base: 70 },
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
    [ServerPacketType.PING_REQUEST]: { echo: 321 },
    [ServerPacketType.GET_ACTIVE_CHANNELS]: {
      activeChannel: 80100,
      channel1: 6,
      channel2: 80100,
    },
    [ServerPacketType.YOU_DONT_EXIST]: {},
    [ServerPacketType.LOG_IN_OK]: {},
    [ServerPacketType.LOG_IN_NOT_OK]: { reason: 'Wrong password!' },
  };

  (Object.values(ServerPacketType) as ServerPacketType[])
    .filter((value) => !isNaN(Number(value))) // TS enums... 🙈
    .forEach((type) => {
      const dataParser = packetDataParsers.server[type];
      const data = packetData[type];
      const dataBuffer = dataParser.toBuffer(data as any);

      expect(dataParser.fromBuffer(dataBuffer)).toEqual(data);
    });
});
