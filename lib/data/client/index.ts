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
import * as MoveTo from './move-to';
import * as SendPM from './send-pm';
import * as GetPlayerInfo from './get-player-info';
import * as SitDown from './sit-down';
import * as TurnLeft from './turn-left';
import * as TurnRight from './turn-right';
import * as Ping from './ping';
import * as HeartBeat from './heart-beat';
import * as LocateMe from './locate-me';
import * as UseMapObject from './use-map-object';
import * as LookAtInventoryItem from './look-at-inventory-item';
import * as MoveInventoryItem from './move-inventory-item';
import * as Harvest from './harvest';
import * as DropItem from './drop-item';
import * as PickUpItem from './pick-up-item';
import * as LookAtGroundItem from './look-at-ground-item';
import * as InspectBag from './inspect-bag';
import * as CloseBag from './close-bag';
import * as LookAtMapObject from './look-at-map-object';
import * as TouchPlayer from './touch-player';
import * as RespondToNpc from './respond-to-npc';
import * as UseInventoryItem from './use-inventory-item';
import * as TradeWith from './trade-with';
import * as RejectTrade from './reject-trade';
import * as ExitTrade from './exit-trade';
import * as AttackSomeone from './attack-someone';
import * as PingResponse from './ping-response';
import * as DoEmote from './do-emote';
import * as LogIn from './log-in';
import * as GetDate from './get-date';
import * as GetTime from './get-time';
import * as ServerStats from './server-stats';

export enum ClientPacketType {
  UNSUPPORTED = -1,
  RAW_TEXT = 0,
  MOVE_TO = 1,
  SEND_PM = 2,
  GET_PLAYER_INFO = 5,
  SIT_DOWN = 7,
  TURN_LEFT = 11,
  TURN_RIGHT = 12,
  PING = 13,
  HEART_BEAT = 14,
  LOCATE_ME = 15,
  USE_MAP_OBJECT = 16,
  LOOK_AT_INVENTORY_ITEM = 19,
  MOVE_INVENTORY_ITEM = 20,
  HARVEST = 21,
  DROP_ITEM = 22,
  PICK_UP_ITEM = 23,
  LOOK_AT_GROUND_ITEM = 24,
  INSPECT_BAG = 25,
  CLOSE_BAG = 26,
  LOOK_AT_MAP_OBJECT = 27,
  TOUCH_PLAYER = 28,
  RESPOND_TO_NPC = 29,
  USE_INVENTORY_ITEM = 31,
  TRADE_WITH = 32,
  REJECT_TRADE = 34,
  EXIT_TRADE = 35,
  ATTACK_SOMEONE = 40,
  PING_RESPONSE = 60,
  DO_EMOTE = 70,
  LOG_IN = 140,
  GET_DATE = 230,
  GET_TIME = 231,
  SERVER_STATS = 232,
}

type SupportedClientPacketType = Exclude<
  ClientPacketType,
  ClientPacketType.UNSUPPORTED
>;

export interface ClientPacketData extends Record<ClientPacketType, PacketData> {
  [ClientPacketType.UNSUPPORTED]: Unsupported.Data;
  [ClientPacketType.RAW_TEXT]: RawText.Data;
  [ClientPacketType.MOVE_TO]: MoveTo.Data;
  [ClientPacketType.SEND_PM]: SendPM.Data;
  [ClientPacketType.GET_PLAYER_INFO]: GetPlayerInfo.Data;
  [ClientPacketType.SIT_DOWN]: SitDown.Data;
  [ClientPacketType.TURN_LEFT]: TurnLeft.Data;
  [ClientPacketType.TURN_RIGHT]: TurnRight.Data;
  [ClientPacketType.PING]: Ping.Data;
  [ClientPacketType.HEART_BEAT]: HeartBeat.Data;
  [ClientPacketType.LOCATE_ME]: LocateMe.Data;
  [ClientPacketType.USE_MAP_OBJECT]: UseMapObject.Data;
  [ClientPacketType.LOOK_AT_INVENTORY_ITEM]: LookAtInventoryItem.Data;
  [ClientPacketType.MOVE_INVENTORY_ITEM]: MoveInventoryItem.Data;
  [ClientPacketType.HARVEST]: Harvest.Data;
  [ClientPacketType.DROP_ITEM]: DropItem.Data;
  [ClientPacketType.PICK_UP_ITEM]: PickUpItem.Data;
  [ClientPacketType.LOOK_AT_GROUND_ITEM]: LookAtGroundItem.Data;
  [ClientPacketType.INSPECT_BAG]: InspectBag.Data;
  [ClientPacketType.CLOSE_BAG]: CloseBag.Data;
  [ClientPacketType.LOOK_AT_MAP_OBJECT]: LookAtMapObject.Data;
  [ClientPacketType.TOUCH_PLAYER]: TouchPlayer.Data;
  [ClientPacketType.RESPOND_TO_NPC]: RespondToNpc.Data;
  [ClientPacketType.USE_INVENTORY_ITEM]: UseInventoryItem.Data;
  [ClientPacketType.TRADE_WITH]: TradeWith.Data;
  [ClientPacketType.REJECT_TRADE]: RejectTrade.Data;
  [ClientPacketType.EXIT_TRADE]: ExitTrade.Data;
  [ClientPacketType.ATTACK_SOMEONE]: AttackSomeone.Data;
  [ClientPacketType.PING_RESPONSE]: PingResponse.Data;
  [ClientPacketType.DO_EMOTE]: DoEmote.Data;
  [ClientPacketType.LOG_IN]: LogIn.Data;
  [ClientPacketType.GET_DATE]: GetDate.Data;
  [ClientPacketType.GET_TIME]: GetTime.Data;
  [ClientPacketType.SERVER_STATS]: ServerStats.Data;
}

export const ClientPacketDataParsers: {
  [Type in SupportedClientPacketType]: PacketDataParser<ClientPacketData[Type]>;
} = {
  [ClientPacketType.RAW_TEXT]: RawText.DataParser,
  [ClientPacketType.MOVE_TO]: MoveTo.DataParser,
  [ClientPacketType.SEND_PM]: SendPM.DataParser,
  [ClientPacketType.GET_PLAYER_INFO]: GetPlayerInfo.DataParser,
  [ClientPacketType.SIT_DOWN]: SitDown.DataParser,
  [ClientPacketType.TURN_LEFT]: TurnLeft.DataParser,
  [ClientPacketType.TURN_RIGHT]: TurnRight.DataParser,
  [ClientPacketType.PING]: Ping.DataParser,
  [ClientPacketType.HEART_BEAT]: HeartBeat.DataParser,
  [ClientPacketType.LOCATE_ME]: LocateMe.DataParser,
  [ClientPacketType.USE_MAP_OBJECT]: UseMapObject.DataParser,
  [ClientPacketType.LOOK_AT_INVENTORY_ITEM]: LookAtInventoryItem.DataParser,
  [ClientPacketType.MOVE_INVENTORY_ITEM]: MoveInventoryItem.DataParser,
  [ClientPacketType.HARVEST]: Harvest.DataParser,
  [ClientPacketType.DROP_ITEM]: DropItem.DataParser,
  [ClientPacketType.PICK_UP_ITEM]: PickUpItem.DataParser,
  [ClientPacketType.LOOK_AT_GROUND_ITEM]: LookAtGroundItem.DataParser,
  [ClientPacketType.INSPECT_BAG]: InspectBag.DataParser,
  [ClientPacketType.CLOSE_BAG]: CloseBag.DataParser,
  [ClientPacketType.LOOK_AT_MAP_OBJECT]: LookAtMapObject.DataParser,
  [ClientPacketType.TOUCH_PLAYER]: TouchPlayer.DataParser,
  [ClientPacketType.RESPOND_TO_NPC]: RespondToNpc.DataParser,
  [ClientPacketType.USE_INVENTORY_ITEM]: UseInventoryItem.DataParser,
  [ClientPacketType.TRADE_WITH]: TradeWith.DataParser,
  [ClientPacketType.REJECT_TRADE]: RejectTrade.DataParser,
  [ClientPacketType.EXIT_TRADE]: ExitTrade.DataParser,
  [ClientPacketType.ATTACK_SOMEONE]: AttackSomeone.DataParser,
  [ClientPacketType.PING_RESPONSE]: PingResponse.DataParser,
  [ClientPacketType.DO_EMOTE]: DoEmote.DataParser,
  [ClientPacketType.LOG_IN]: LogIn.DataParser,
  [ClientPacketType.GET_DATE]: GetDate.DataParser,
  [ClientPacketType.GET_TIME]: GetTime.DataParser,
  [ClientPacketType.SERVER_STATS]: ServerStats.DataParser,
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
