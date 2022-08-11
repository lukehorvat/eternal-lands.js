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
import * as AddNewActor from './add-new-actor';
import * as AddActorCommand from './add-actor-command';
import * as YouAre from './you-are';
import * as SyncClock from './sync-clock';
import * as NewMinute from './new-minute';
import * as RemoveActor from './remove-actor';
import * as ChangeMap from './change-map';
import * as KillAllActors from './kill-all-actors';
import * as GetTeleportersList from './get-teleporters-list';
import * as Pong from './pong';
import * as TeleportIn from './teleport-in';
import * as TeleportOut from './teleport-out';
import * as HereYourStats from './here-your-stats';
import * as HereYourInventory from './here-your-inventory';
import * as InventoryItemText from './inventory-item-text';
import * as GetNewInventoryItem from './get-new-inventory-item';
import * as RemoveItemFromInventory from './remove-item-from-inventory';
import * as HereYourGroundItems from './here-your-ground-items';
import * as GetNewGroundItem from './get-new-ground-item';
import * as RemoveItemFromGround from './remove-item-from-ground';
import * as CloseBag from './close-bag';
import * as GetNewBag from './get-new-bag';
import * as GetBagsList from './get-bags-list';
import * as DestroyBag from './destroy-bag';
import * as NpcText from './npc-text';
import * as NpcOptionsList from './npc-options-list';
import * as SendNpcInfo from './send-npc-info';
import * as GetTradeObject from './get-trade-object';
import * as GetTradeAccept from './get-trade-accept';
import * as GetTradeReject from './get-trade-reject';
import * as GetTradeExit from './get-trade-exit';
import * as RemoveTradeObject from './remove-trade-object';
import * as GetYourTradeObjects from './get-your-trade-objects';
import * as GetTradePartnerName from './get-trade-partner-name';
import * as GetActorDamage from './get-actor-damage';
import * as GetActorHeal from './get-actor-heal';
import * as SendPartialStat from './send-partial-stat';
import * as AddNewEnhancedActor from './add-new-enhanced-actor';
import * as PingRequest from './ping-request';
import * as GetActiveChannels from './get-active-channels';
import * as YouDontExist from './you-dont-exist';
import * as LogInOk from './log-in-ok';
import * as LogInNotOk from './log-in-not-ok';

export enum ServerPacketType {
  UNSUPPORTED = -1,
  RAW_TEXT = 0,
  ADD_NEW_ACTOR = 1,
  ADD_ACTOR_COMMAND = 2,
  YOU_ARE = 3,
  SYNC_CLOCK = 4,
  NEW_MINUTE = 5,
  REMOVE_ACTOR = 6,
  CHANGE_MAP = 7,
  // COMBAT_MODE = 8,
  KILL_ALL_ACTORS = 9,
  GET_TELEPORTERS_LIST = 10,
  PONG = 11,
  TELEPORT_IN = 12,
  TELEPORT_OUT = 13,
  // PLAY_SOUND = 14,
  // START_RAIN = 15,
  // STOP_RAIN = 16,
  // THUNDER = 17,
  HERE_YOUR_STATS = 18,
  HERE_YOUR_INVENTORY = 19,
  INVENTORY_ITEM_TEXT = 20,
  GET_NEW_INVENTORY_ITEM = 21,
  REMOVE_ITEM_FROM_INVENTORY = 22,
  HERE_YOUR_GROUND_ITEMS = 23,
  GET_NEW_GROUND_ITEM = 24,
  REMOVE_ITEM_FROM_GROUND = 25,
  CLOSE_BAG = 26,
  GET_NEW_BAG = 27,
  GET_BAGS_LIST = 28,
  DESTROY_BAG = 29,
  NPC_TEXT = 30,
  NPC_OPTIONS_LIST = 31,
  // CLOSE_NPC_MENU = 32,
  SEND_NPC_INFO = 33,
  // GET_TRADE_INFO = 34,
  GET_TRADE_OBJECT = 35,
  GET_TRADE_ACCEPT = 36,
  GET_TRADE_REJECT = 37,
  GET_TRADE_EXIT = 38,
  REMOVE_TRADE_OBJECT = 39,
  GET_YOUR_TRADEOBJECTS = 40,
  GET_TRADE_PARTNER_NAME = 41,
  // GET_YOUR_SIGILS = 42,
  // SPELL_ITEM_TEXT = 43,
  // GET_ACTIVE_SPELL = 44,
  // GET_ACTIVE_SPELL_LIST = 45,
  // REMOVE_ACTIVE_SPELL = 46,
  GET_ACTOR_DAMAGE = 47,
  GET_ACTOR_HEAL = 48,
  SEND_PARTIAL_STAT = 49,
  // SPAWN_BAG_PARTICLES = 50,
  ADD_NEW_ENHANCED_ACTOR = 51,
  // ACTOR_WEAR_ITEM = 52,
  // ACTOR_UNWEAR_ITEM = 53,
  // PLAY_MUSIC = 54,
  // GET_KNOWLEDGE_LIST = 55,
  // GET_NEW_KNOWLEDGE = 56,
  // GET_KNOWLEDGE_TEXT = 57,
  // BUDDY_EVENT = 59,
  PING_REQUEST = 60,
  // FIRE_PARTICLES = 61,
  // REMOVE_FIRE_AT = 62,
  // DISPLAY_CLIENT_WINDOW = 63,
  // OPEN_BOOK = 64,
  // READ_BOOK = 65,
  // CLOSE_BOOK = 66,
  // STORAGE_LIST = 67,
  // STORAGE_ITEMS = 68,
  // STORAGE_TEXT = 69,
  // SPELL_CAST = 70,
  GET_ACTIVE_CHANNELS = 71,
  // MAP_FLAGS = 72,
  // GET_ACTOR_HEALTH = 73,
  // GET_3D_OBJ_LIST = 74,
  // GET_3D_OBJ = 75,
  // REMOVE_3D_OBJ = 76,
  // GET_ITEMS_COOLDOWN = 77,
  // SEND_BUFFS = 78,
  // SEND_SPECIAL_EFFECT = 79,
  // REMOVE_MINE = 80,
  // GET_NEW_MINE = 81,
  // GET_MINES_LIST = 82,
  // DISPLAY_POPUP = 83,
  // MISSILE_AIM_A_AT_B = 84,
  // MISSILE_AIM_A_AT_XYZ = 85,
  // MISSILE_FIRE_A_TO_B = 86,
  // MISSILE_FIRE_A_TO_XYZ = 87,
  // MISSILE_FIRE_XYZ_TO_B = 88,
  // ADD_ACTOR_ANIMATION = 89,
  // SEND_MAP_MARKER = 90,
  // REMOVE_MAP_MARKER = 91,
  // NEXT_NPC_MESSAGE_IS_QUEST = 92,
  // HERE_IS_QUEST_ID = 93,
  // QUEST_FINISHED = 94,
  // SEND_ACHIEVEMENTS = 95,
  // SEND_BUFF_DURATION = 96,
  // SEND_WEATHER = 100,
  // MAP_SET_OBJECTS = 220,
  // MAP_STATE_OBJECTS = 221,
  // UPGRADE_NEW_VERSION = 240,
  // UPGRADE_TOO_OLD = 241,
  // REDEFINE_YOUR_COLORS = 248,
  YOU_DONT_EXIST = 249,
  LOG_IN_OK = 250,
  LOG_IN_NOT_OK = 251,
  // CREATE_CHAR_OK = 252,
  // CREATE_CHAR_NOT_OK = 253,
}

type SupportedServerPacketType = Exclude<
  ServerPacketType,
  ServerPacketType.UNSUPPORTED
>;

export interface ServerPacketData extends Record<ServerPacketType, PacketData> {
  [ServerPacketType.UNSUPPORTED]: Unsupported.Data;
  [ServerPacketType.RAW_TEXT]: RawText.Data;
  [ServerPacketType.ADD_NEW_ACTOR]: AddNewActor.Data;
  [ServerPacketType.ADD_ACTOR_COMMAND]: AddActorCommand.Data;
  [ServerPacketType.YOU_ARE]: YouAre.Data;
  [ServerPacketType.SYNC_CLOCK]: SyncClock.Data;
  [ServerPacketType.NEW_MINUTE]: NewMinute.Data;
  [ServerPacketType.REMOVE_ACTOR]: RemoveActor.Data;
  [ServerPacketType.CHANGE_MAP]: ChangeMap.Data;
  [ServerPacketType.KILL_ALL_ACTORS]: KillAllActors.Data;
  [ServerPacketType.GET_TELEPORTERS_LIST]: GetTeleportersList.Data;
  [ServerPacketType.PONG]: Pong.Data;
  [ServerPacketType.TELEPORT_IN]: TeleportIn.Data;
  [ServerPacketType.TELEPORT_OUT]: TeleportOut.Data;
  [ServerPacketType.HERE_YOUR_STATS]: HereYourStats.Data;
  [ServerPacketType.HERE_YOUR_INVENTORY]: HereYourInventory.Data;
  [ServerPacketType.INVENTORY_ITEM_TEXT]: InventoryItemText.Data;
  [ServerPacketType.GET_NEW_INVENTORY_ITEM]: GetNewInventoryItem.Data;
  [ServerPacketType.REMOVE_ITEM_FROM_INVENTORY]: RemoveItemFromInventory.Data;
  [ServerPacketType.HERE_YOUR_GROUND_ITEMS]: HereYourGroundItems.Data;
  [ServerPacketType.GET_NEW_GROUND_ITEM]: GetNewGroundItem.Data;
  [ServerPacketType.REMOVE_ITEM_FROM_GROUND]: RemoveItemFromGround.Data;
  [ServerPacketType.CLOSE_BAG]: CloseBag.Data;
  [ServerPacketType.GET_NEW_BAG]: GetNewBag.Data;
  [ServerPacketType.GET_BAGS_LIST]: GetBagsList.Data;
  [ServerPacketType.DESTROY_BAG]: DestroyBag.Data;
  [ServerPacketType.NPC_TEXT]: NpcText.Data;
  [ServerPacketType.NPC_OPTIONS_LIST]: NpcOptionsList.Data;
  [ServerPacketType.SEND_NPC_INFO]: SendNpcInfo.Data;
  [ServerPacketType.GET_TRADE_OBJECT]: GetTradeObject.Data;
  [ServerPacketType.GET_TRADE_ACCEPT]: GetTradeAccept.Data;
  [ServerPacketType.GET_TRADE_REJECT]: GetTradeReject.Data;
  [ServerPacketType.GET_TRADE_EXIT]: GetTradeExit.Data;
  [ServerPacketType.REMOVE_TRADE_OBJECT]: RemoveTradeObject.Data;
  [ServerPacketType.GET_YOUR_TRADEOBJECTS]: GetYourTradeObjects.Data;
  [ServerPacketType.GET_TRADE_PARTNER_NAME]: GetTradePartnerName.Data;
  [ServerPacketType.GET_ACTOR_DAMAGE]: GetActorDamage.Data;
  [ServerPacketType.GET_ACTOR_HEAL]: GetActorHeal.Data;
  [ServerPacketType.SEND_PARTIAL_STAT]: SendPartialStat.Data;
  [ServerPacketType.ADD_NEW_ENHANCED_ACTOR]: AddNewEnhancedActor.Data;
  [ServerPacketType.PING_REQUEST]: PingRequest.Data;
  [ServerPacketType.GET_ACTIVE_CHANNELS]: GetActiveChannels.Data;
  [ServerPacketType.YOU_DONT_EXIST]: YouDontExist.Data;
  [ServerPacketType.LOG_IN_OK]: LogInOk.Data;
  [ServerPacketType.LOG_IN_NOT_OK]: LogInNotOk.Data;
}

export const ServerPacketDataParsers: {
  [Type in SupportedServerPacketType]: PacketDataParser<ServerPacketData[Type]>;
} = {
  [ServerPacketType.RAW_TEXT]: RawText.DataParser,
  [ServerPacketType.ADD_NEW_ACTOR]: AddNewActor.DataParser,
  [ServerPacketType.ADD_ACTOR_COMMAND]: AddActorCommand.DataParser,
  [ServerPacketType.YOU_ARE]: YouAre.DataParser,
  [ServerPacketType.SYNC_CLOCK]: SyncClock.DataParser,
  [ServerPacketType.NEW_MINUTE]: NewMinute.DataParser,
  [ServerPacketType.REMOVE_ACTOR]: RemoveActor.DataParser,
  [ServerPacketType.CHANGE_MAP]: ChangeMap.DataParser,
  [ServerPacketType.KILL_ALL_ACTORS]: KillAllActors.DataParser,
  [ServerPacketType.GET_TELEPORTERS_LIST]: GetTeleportersList.DataParser,
  [ServerPacketType.PONG]: Pong.DataParser,
  [ServerPacketType.TELEPORT_IN]: TeleportIn.DataParser,
  [ServerPacketType.TELEPORT_OUT]: TeleportOut.DataParser,
  [ServerPacketType.HERE_YOUR_STATS]: HereYourStats.DataParser,
  [ServerPacketType.HERE_YOUR_INVENTORY]: HereYourInventory.DataParser,
  [ServerPacketType.INVENTORY_ITEM_TEXT]: InventoryItemText.DataParser,
  [ServerPacketType.GET_NEW_INVENTORY_ITEM]: GetNewInventoryItem.DataParser,
  [ServerPacketType.REMOVE_ITEM_FROM_INVENTORY]:
    RemoveItemFromInventory.DataParser,
  [ServerPacketType.HERE_YOUR_GROUND_ITEMS]: HereYourGroundItems.DataParser,
  [ServerPacketType.GET_NEW_GROUND_ITEM]: GetNewGroundItem.DataParser,
  [ServerPacketType.REMOVE_ITEM_FROM_GROUND]: RemoveItemFromGround.DataParser,
  [ServerPacketType.CLOSE_BAG]: CloseBag.DataParser,
  [ServerPacketType.GET_NEW_BAG]: GetNewBag.DataParser,
  [ServerPacketType.GET_BAGS_LIST]: GetBagsList.DataParser,
  [ServerPacketType.DESTROY_BAG]: DestroyBag.DataParser,
  [ServerPacketType.NPC_TEXT]: NpcText.DataParser,
  [ServerPacketType.NPC_OPTIONS_LIST]: NpcOptionsList.DataParser,
  [ServerPacketType.SEND_NPC_INFO]: SendNpcInfo.DataParser,
  [ServerPacketType.GET_TRADE_OBJECT]: GetTradeObject.DataParser,
  [ServerPacketType.GET_TRADE_ACCEPT]: GetTradeAccept.DataParser,
  [ServerPacketType.GET_TRADE_REJECT]: GetTradeReject.DataParser,
  [ServerPacketType.GET_TRADE_EXIT]: GetTradeExit.DataParser,
  [ServerPacketType.REMOVE_TRADE_OBJECT]: RemoveTradeObject.DataParser,
  [ServerPacketType.GET_YOUR_TRADEOBJECTS]: GetYourTradeObjects.DataParser,
  [ServerPacketType.GET_TRADE_PARTNER_NAME]: GetTradePartnerName.DataParser,
  [ServerPacketType.GET_ACTOR_DAMAGE]: GetActorDamage.DataParser,
  [ServerPacketType.GET_ACTOR_HEAL]: GetActorHeal.DataParser,
  [ServerPacketType.SEND_PARTIAL_STAT]: SendPartialStat.DataParser,
  [ServerPacketType.ADD_NEW_ENHANCED_ACTOR]: AddNewEnhancedActor.DataParser,
  [ServerPacketType.PING_REQUEST]: PingRequest.DataParser,
  [ServerPacketType.GET_ACTIVE_CHANNELS]: GetActiveChannels.DataParser,
  [ServerPacketType.YOU_DONT_EXIST]: YouDontExist.DataParser,
  [ServerPacketType.LOG_IN_OK]: LogInOk.DataParser,
  [ServerPacketType.LOG_IN_NOT_OK]: LogInNotOk.DataParser,
};

export class ServerPacket<
  Type extends ServerPacketType
> extends PacketWithParsedData<Type, ServerPacketData[Type]> {
  constructor(type: Type, data: ServerPacketData[Type]) {
    super(type, data);

    if (!(type in ServerPacketType)) {
      throw new Error('Unsupported server packet type.');
    }
  }

  toBuffer(): Buffer {
    return writePacketsToBuffer([this], (packet) => {
      return ServerPacket.isType(packet, ServerPacketType.UNSUPPORTED)
        ? new PacketWithBufferedData(packet.data.type, packet.data.data)
        : new PacketWithBufferedData(
            packet.type,
            ServerPacketDataParsers[
              packet.type as SupportedServerPacketType
            ].toBuffer(packet.data as any /* TODO: Don't use `any`. */)
          );
    });
  }

  static fromBuffer(buffer: Buffer) {
    return readPacketsFromBuffer(buffer, (packet: PacketWithBufferedData) => {
      return packet.type in ServerPacketType
        ? new ServerPacket(
            packet.type as SupportedServerPacketType,
            ServerPacketDataParsers[
              packet.type as SupportedServerPacketType
            ].fromBuffer(packet.dataBuffer)
          )
        : new ServerPacket(ServerPacketType.UNSUPPORTED, {
            type: packet.type,
            data: packet.dataBuffer,
          });
    });
  }

  static isType<Type extends ServerPacketType>(
    packet: ServerPacket<ServerPacketType>,
    type: Type
  ): packet is ServerPacket<Type> {
    return packet.type === type;
  }
}
