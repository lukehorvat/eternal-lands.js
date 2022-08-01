import { PacketDataParser } from '../packets';
import * as RawText from './raw-text';
import * as Ping from './ping';
import * as HeartBeat from './heart-beat';
import * as LocateMe from './locate-me';
import * as TradeWith from './trade-with';
import * as PingResponse from './ping-response';
import * as LogIn from './log-in';

export enum ClientPacketType {
  RAW_TEXT = 0,
  PING = 13,
  HEART_BEAT = 14,
  LOCATE_ME = 15,
  TRADE_WITH = 32,
  PING_RESPONSE = 60,
  LOG_IN = 140,
}

export interface ClientPacketData
  extends Record<ClientPacketType, Record<string, any | never>> {
  [ClientPacketType.RAW_TEXT]: RawText.PacketData;
  [ClientPacketType.PING]: Ping.PacketData;
  [ClientPacketType.HEART_BEAT]: HeartBeat.PacketData;
  [ClientPacketType.LOCATE_ME]: LocateMe.PacketData;
  [ClientPacketType.TRADE_WITH]: TradeWith.PacketData;
  [ClientPacketType.PING_RESPONSE]: PingResponse.PacketData;
  [ClientPacketType.LOG_IN]: LogIn.PacketData;
}

export const ClientPacketDataParsers: {
  [Type in ClientPacketType]: PacketDataParser<ClientPacketData[Type]>;
} = {
  [ClientPacketType.RAW_TEXT]: RawText.DataParser,
  [ClientPacketType.PING]: Ping.DataParser,
  [ClientPacketType.HEART_BEAT]: HeartBeat.DataParser,
  [ClientPacketType.LOCATE_ME]: LocateMe.DataParser,
  [ClientPacketType.TRADE_WITH]: TradeWith.DataParser,
  [ClientPacketType.PING_RESPONSE]: PingResponse.DataParser,
  [ClientPacketType.LOG_IN]: LogIn.DataParser,
};
