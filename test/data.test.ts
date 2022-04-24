import {
  ClientPacketData,
  ServerPacketData,
  packetDataParsers,
} from '../lib/data';
import { ClientPacketType, ServerPacketType } from '../lib/types';
import { ChatChannel } from '../lib/constants';

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
