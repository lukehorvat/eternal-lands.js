import {
  ClientPacketData,
  ServerPacketData,
  packetDataParsers,
} from '../lib/data';
import { ClientPacketType, ServerPacketType } from '../lib/types';
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
  ChatChannel,
} from '../lib/constants';

test('Client packet data parsing', () => {
  const packetData: {
    [Type in ClientPacketType]: ClientPacketData[Type];
  } = {
    [ClientPacketType.RAW_TEXT]: ['test'],
    [ClientPacketType.PING]: [123],
    [ClientPacketType.HEARTBEAT]: [],
    [ClientPacketType.PING_RESPONSE]: [321],
    [ClientPacketType.PING_RESPONSE]: [321],
    [ClientPacketType.LOGIN]: ['foo', 'bar'],
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
    [ServerPacketType.RAW_TEXT]: [ChatChannel.LOCAL, 'test'],
    [ServerPacketType.YOU_ARE]: [5],
    [ServerPacketType.SYNC_CLOCK]: [123456789],
    [ServerPacketType.NEW_MINUTE]: [138],
    [ServerPacketType.CHANGE_MAP]: ['./maps/startmap_insides.elm'],
    [ServerPacketType.PONG]: [123],
    [ServerPacketType.ADD_NEW_ENHANCED_ACTOR]: [
      123,
      100,
      100,
      270,
      ActorType.HUMAN_MALE,
      ActorSkin.PALE,
      ActorHair.BROWN,
      ActorShirt.STEEL_PLATE_ARMOR,
      ActorPants.STEEL_CUISSES,
      ActorBoots.STEEL_GREAVE,
      ActorHead.ONE,
      ActorShield.STEEL,
      ActorWeapon.SWORD_ORC_SLAYER,
      ActorCape.FUR,
      ActorHelmet.CROWN_OF_LIFE,
      200,
      150,
      ActorKind.HUMAN,
      'Player',
      'TEST',
    ],
    [ServerPacketType.PING_REQUEST]: [321],
    [ServerPacketType.YOU_DONT_EXIST]: [],
    [ServerPacketType.LOGIN_SUCCESSFUL]: [],
    [ServerPacketType.LOGIN_FAILED]: ['Wrong password!'],
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
