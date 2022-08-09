import {
  PacketData,
  PacketDataParser,
  PacketWithBufferedData,
  PacketWithParsedData,
  readPacketsFromBuffer,
  writePacketsToBuffer,
} from '../packets';
import * as Unsupported from './unsupported';
import * as RawText from './raw-text';
import * as SitDown from './sit-down';
import * as Ping from './ping';
import * as HeartBeat from './heart-beat';
import * as LocateMe from './locate-me';
import * as Harvest from './harvest';
import * as TradeWith from './trade-with';
import * as PingResponse from './ping-response';
import * as LogIn from './log-in';

export enum ClientPacketType {
  UNSUPPORTED = -1,
  RAW_TEXT = 0,
  SIT_DOWN = 7,
  PING = 13,
  HEART_BEAT = 14,
  LOCATE_ME = 15,
  HARVEST = 21,
  TRADE_WITH = 32,
  PING_RESPONSE = 60,
  LOG_IN = 140,
}

type SupportedClientPacketType = Exclude<
  ClientPacketType,
  ClientPacketType.UNSUPPORTED
>;

export interface ClientPacketData extends Record<ClientPacketType, PacketData> {
  [ClientPacketType.UNSUPPORTED]: Unsupported.Data;
  [ClientPacketType.RAW_TEXT]: RawText.Data;
  [ClientPacketType.SIT_DOWN]: SitDown.Data;
  [ClientPacketType.PING]: Ping.Data;
  [ClientPacketType.HEART_BEAT]: HeartBeat.Data;
  [ClientPacketType.LOCATE_ME]: LocateMe.Data;
  [ClientPacketType.HARVEST]: Harvest.Data;
  [ClientPacketType.TRADE_WITH]: TradeWith.Data;
  [ClientPacketType.PING_RESPONSE]: PingResponse.Data;
  [ClientPacketType.LOG_IN]: LogIn.Data;
}

export const ClientPacketDataParsers: {
  [Type in SupportedClientPacketType]: PacketDataParser<ClientPacketData[Type]>;
} = {
  [ClientPacketType.RAW_TEXT]: RawText.DataParser,
  [ClientPacketType.SIT_DOWN]: SitDown.DataParser,
  [ClientPacketType.PING]: Ping.DataParser,
  [ClientPacketType.HEART_BEAT]: HeartBeat.DataParser,
  [ClientPacketType.LOCATE_ME]: LocateMe.DataParser,
  [ClientPacketType.HARVEST]: Harvest.DataParser,
  [ClientPacketType.TRADE_WITH]: TradeWith.DataParser,
  [ClientPacketType.PING_RESPONSE]: PingResponse.DataParser,
  [ClientPacketType.LOG_IN]: LogIn.DataParser,
};

export class ClientPacket<
  Type extends ClientPacketType
> extends PacketWithParsedData<Type, ClientPacketData[Type]> {
  constructor(type: Type, data: ClientPacketData[Type]) {
    super(type, data);

    if (!(type in ClientPacketType)) {
      throw new Error('Unsupported client packet type.');
    }
  }

  toBuffer(): Buffer {
    return writePacketsToBuffer([this], (packet) => {
      return ClientPacket.isType(packet, ClientPacketType.UNSUPPORTED)
        ? new PacketWithBufferedData(packet.data.type, packet.data.data)
        : new PacketWithBufferedData(
            packet.type,
            ClientPacketDataParsers[
              packet.type as SupportedClientPacketType
            ].toBuffer(packet.data as any /* TODO: Don't use `any`. */)
          );
    });
  }

  static fromBuffer(buffer: Buffer) {
    return readPacketsFromBuffer(buffer, (packet: PacketWithBufferedData) => {
      return packet.type in ClientPacketType
        ? new ClientPacket(
            packet.type as SupportedClientPacketType,
            ClientPacketDataParsers[
              packet.type as SupportedClientPacketType
            ].fromBuffer(packet.dataBuffer)
          )
        : new ClientPacket(ClientPacketType.UNSUPPORTED, {
            type: packet.type,
            data: packet.dataBuffer,
          });
    });
  }

  static isType<Type extends ClientPacketType>(
    packet: ClientPacket<ClientPacketType>,
    type: Type
  ): packet is ClientPacket<Type> {
    return packet.type === type;
  }
}
