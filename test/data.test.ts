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
    [ClientPacketType.HEARTBEAT]: {},
    [ClientPacketType.PING_RESPONSE]: { echo: 321 },
    [ClientPacketType.PING_RESPONSE]: { echo: 321 },
    [ClientPacketType.LOGIN]: { username: 'foo', password: 'bar' },
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
    [ServerPacketType.YOU_DONT_EXIST]: {},
    [ServerPacketType.LOGIN_SUCCESSFUL]: {},
    [ServerPacketType.LOGIN_FAILED]: { reason: 'Wrong password!' },
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
