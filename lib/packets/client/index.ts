import {
  PacketData,
  PacketDataParser,
  PacketWithBufferedData,
  PacketWithParsedData,
  readPacketsFromBuffer,
  writePacketsToBuffer,
} from '../common';
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
import * as AcceptTrade from './accept-trade';
import * as RejectTrade from './reject-trade';
import * as ExitTrade from './exit-trade';
import * as PutObjectOnTrade from './put-object-on-trade';
import * as RemoveObjectFromTrade from './remove-object-from-trade';
import * as LookAtTradeItem from './look-at-trade-item';
import * as AttackSomeone from './attack-someone';
import * as GetStorageCategory from './get-storage-category';
import * as DepositItem from './deposit-item';
import * as WithdrawItem from './withdraw-item';
import * as LookAtStorageItem from './look-at-storage-item';
import * as PingResponse from './ping-response';
import * as DoEmote from './do-emote';
import * as LogIn from './log-in';
import * as GetDate from './get-date';
import * as GetTime from './get-time';
import * as ServerStats from './server-stats';

/**
 * Enum representing the packet types that can be sent from client to server.
 *
 * See: https://github.com/raduprv/Eternal-Lands/blob/968f90742b68659b201ea8c0790be0e60267b750/client_serv.h#L658-L731
 */
export enum ClientPacketType {
  UNSUPPORTED = -1,
  RAW_TEXT = 0,
  MOVE_TO = 1,
  SEND_PM = 2,
  GET_PLAYER_INFO = 5,
  // RUN_TO = 6,
  SIT_DOWN = 7,
  // SEND_ME_MY_ACTORS = 8,
  // SEND_OPENING_SCREEN = 9,
  // SEND_VERSION = 10,
  TURN_LEFT = 11,
  TURN_RIGHT = 12,
  PING = 13,
  HEART_BEAT = 14,
  LOCATE_ME = 15,
  USE_MAP_OBJECT = 16,
  // SEND_MY_STATS = 17,
  // SEND_MY_INVENTORY = 18,
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
  // MANUFACTURE_THIS = 30,
  USE_INVENTORY_ITEM = 31,
  TRADE_WITH = 32,
  ACCEPT_TRADE = 33,
  REJECT_TRADE = 34,
  EXIT_TRADE = 35,
  PUT_OBJECT_ON_TRADE = 36,
  REMOVE_OBJECT_FROM_TRADE = 37,
  LOOK_AT_TRADE_ITEM = 38,
  // CAST_SPELL = 39,
  ATTACK_SOMEONE = 40,
  // GET_KNOWLEDGE_INFO = 41,
  // ITEM_ON_ITEM = 42,
  // SEND_BOOK = 43,
  GET_STORAGE_CATEGORY = 44,
  DEPOSIT_ITEM = 45,
  WITHDRAW_ITEM = 46,
  LOOK_AT_STORAGE_ITEM = 47,
  // SPELL_NAME = 48,
  // SEND_VIDEO_INFO = 49,
  // POPUP_REPLY = 50,
  // FIRE_MISSILE_AT_OBJECT = 51,
  PING_RESPONSE = 60,
  // SET_ACTIVE_CHANNEL = 61,
  // WHAT_QUEST_IS_THIS_ID = 63,
  DO_EMOTE = 70,
  // GET_BUFF_DURATION = 71,
  LOG_IN = 140,
  // CREATE_CHAR = 141,
  GET_DATE = 230,
  GET_TIME = 231,
  SERVER_STATS = 232,
  // ORIGINAL_IP = 233,
  // LETS_ENCRYPT = 234,
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
  [ClientPacketType.ACCEPT_TRADE]: AcceptTrade.Data;
  [ClientPacketType.REJECT_TRADE]: RejectTrade.Data;
  [ClientPacketType.EXIT_TRADE]: ExitTrade.Data;
  [ClientPacketType.PUT_OBJECT_ON_TRADE]: PutObjectOnTrade.Data;
  [ClientPacketType.REMOVE_OBJECT_FROM_TRADE]: RemoveObjectFromTrade.Data;
  [ClientPacketType.LOOK_AT_TRADE_ITEM]: LookAtTradeItem.Data;
  [ClientPacketType.ATTACK_SOMEONE]: AttackSomeone.Data;
  [ClientPacketType.GET_STORAGE_CATEGORY]: GetStorageCategory.Data;
  [ClientPacketType.DEPOSIT_ITEM]: DepositItem.Data;
  [ClientPacketType.WITHDRAW_ITEM]: WithdrawItem.Data;
  [ClientPacketType.LOOK_AT_STORAGE_ITEM]: LookAtStorageItem.Data;
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
  [ClientPacketType.ACCEPT_TRADE]: AcceptTrade.DataParser,
  [ClientPacketType.REJECT_TRADE]: RejectTrade.DataParser,
  [ClientPacketType.EXIT_TRADE]: ExitTrade.DataParser,
  [ClientPacketType.PUT_OBJECT_ON_TRADE]: PutObjectOnTrade.DataParser,
  [ClientPacketType.REMOVE_OBJECT_FROM_TRADE]: RemoveObjectFromTrade.DataParser,
  [ClientPacketType.LOOK_AT_TRADE_ITEM]: LookAtTradeItem.DataParser,
  [ClientPacketType.ATTACK_SOMEONE]: AttackSomeone.DataParser,
  [ClientPacketType.GET_STORAGE_CATEGORY]: GetStorageCategory.DataParser,
  [ClientPacketType.DEPOSIT_ITEM]: DepositItem.DataParser,
  [ClientPacketType.WITHDRAW_ITEM]: WithdrawItem.DataParser,
  [ClientPacketType.LOOK_AT_STORAGE_ITEM]: LookAtStorageItem.DataParser,
  [ClientPacketType.PING_RESPONSE]: PingResponse.DataParser,
  [ClientPacketType.DO_EMOTE]: DoEmote.DataParser,
  [ClientPacketType.LOG_IN]: LogIn.DataParser,
  [ClientPacketType.GET_DATE]: GetDate.DataParser,
  [ClientPacketType.GET_TIME]: GetTime.DataParser,
  [ClientPacketType.SERVER_STATS]: ServerStats.DataParser,
};

/**
 * Class representing a packet that can be sent from client to server.
 */
export class ClientPacket<
  Type extends ClientPacketType
> extends PacketWithParsedData<Type, ClientPacketData[Type]> {
  constructor(type: Type, data: ClientPacketData[Type]) {
    super(type, data);

    if (!(type in ClientPacketType)) {
      throw new Error('Unsupported client packet type.');
    }
  }

  /**
   * Convert the client packet to a buffer.
   *
   * Returns the buffer.
   */
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

  /**
   * Read client packets from a buffer.
   *
   * Returns the packets parsed from the buffer, as well as any remaining buffer
   * that wasn't large enough to contain a packet.
   */
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

  /**
   * Check whether a client packet is of a particular type.
   *
   * Returns a boolean that is `true` if the type matches.
   */
  static isType<Type extends ClientPacketType>(
    packet: ClientPacket<ClientPacketType>,
    type: Type
  ): packet is ClientPacket<Type> {
    return packet.type === type;
  }
}
