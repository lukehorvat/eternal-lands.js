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
  KILL_ALL_ACTORS = 9,
  GET_TELEPORTERS_LIST = 10,
  PONG = 11,
  TELEPORT_IN = 12,
  TELEPORT_OUT = 13,
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
  SEND_NPC_INFO = 33,
  GET_TRADE_OBJECT = 35,
  GET_TRADE_ACCEPT = 36,
  GET_TRADE_REJECT = 37,
  GET_TRADE_EXIT = 38,
  GET_YOUR_TRADEOBJECTS = 40,
  GET_TRADE_PARTNER_NAME = 41,
  GET_ACTOR_DAMAGE = 47,
  GET_ACTOR_HEAL = 48,
  SEND_PARTIAL_STAT = 49,
  ADD_NEW_ENHANCED_ACTOR = 51,
  PING_REQUEST = 60,
  GET_ACTIVE_CHANNELS = 71,
  YOU_DONT_EXIST = 249,
  LOG_IN_OK = 250,
  LOG_IN_NOT_OK = 251,
}

type SupportedServerPacketType = Exclude<
  ServerPacketType,
  ServerPacketType.UNSUPPORTED
>;

export interface ServerPacketData extends Record<ServerPacketType, PacketData> {
  [ServerPacketType.UNSUPPORTED]: Unsupported.PacketData;
  [ServerPacketType.RAW_TEXT]: RawText.PacketData;
  [ServerPacketType.ADD_NEW_ACTOR]: AddNewActor.PacketData;
  [ServerPacketType.ADD_ACTOR_COMMAND]: AddActorCommand.PacketData;
  [ServerPacketType.YOU_ARE]: YouAre.PacketData;
  [ServerPacketType.SYNC_CLOCK]: SyncClock.PacketData;
  [ServerPacketType.NEW_MINUTE]: NewMinute.PacketData;
  [ServerPacketType.REMOVE_ACTOR]: RemoveActor.PacketData;
  [ServerPacketType.CHANGE_MAP]: ChangeMap.PacketData;
  [ServerPacketType.KILL_ALL_ACTORS]: KillAllActors.PacketData;
  [ServerPacketType.GET_TELEPORTERS_LIST]: GetTeleportersList.PacketData;
  [ServerPacketType.PONG]: Pong.PacketData;
  [ServerPacketType.TELEPORT_IN]: TeleportIn.PacketData;
  [ServerPacketType.TELEPORT_OUT]: TeleportOut.PacketData;
  [ServerPacketType.HERE_YOUR_STATS]: HereYourStats.PacketData;
  [ServerPacketType.HERE_YOUR_INVENTORY]: HereYourInventory.PacketData;
  [ServerPacketType.INVENTORY_ITEM_TEXT]: InventoryItemText.PacketData;
  [ServerPacketType.GET_NEW_INVENTORY_ITEM]: GetNewInventoryItem.PacketData;
  [ServerPacketType.REMOVE_ITEM_FROM_INVENTORY]: RemoveItemFromInventory.PacketData;
  [ServerPacketType.HERE_YOUR_GROUND_ITEMS]: HereYourGroundItems.PacketData;
  [ServerPacketType.GET_NEW_GROUND_ITEM]: GetNewGroundItem.PacketData;
  [ServerPacketType.REMOVE_ITEM_FROM_GROUND]: RemoveItemFromGround.PacketData;
  [ServerPacketType.CLOSE_BAG]: CloseBag.PacketData;
  [ServerPacketType.GET_NEW_BAG]: GetNewBag.PacketData;
  [ServerPacketType.GET_BAGS_LIST]: GetBagsList.PacketData;
  [ServerPacketType.DESTROY_BAG]: DestroyBag.PacketData;
  [ServerPacketType.NPC_TEXT]: NpcText.PacketData;
  [ServerPacketType.NPC_OPTIONS_LIST]: NpcOptionsList.PacketData;
  [ServerPacketType.SEND_NPC_INFO]: SendNpcInfo.PacketData;
  [ServerPacketType.GET_TRADE_OBJECT]: GetTradeObject.PacketData;
  [ServerPacketType.GET_TRADE_ACCEPT]: GetTradeAccept.PacketData;
  [ServerPacketType.GET_TRADE_REJECT]: GetTradeReject.PacketData;
  [ServerPacketType.GET_TRADE_EXIT]: GetTradeExit.PacketData;
  [ServerPacketType.GET_YOUR_TRADEOBJECTS]: GetYourTradeObjects.PacketData;
  [ServerPacketType.GET_TRADE_PARTNER_NAME]: GetTradePartnerName.PacketData;
  [ServerPacketType.GET_ACTOR_DAMAGE]: GetActorDamage.PacketData;
  [ServerPacketType.GET_ACTOR_HEAL]: GetActorHeal.PacketData;
  [ServerPacketType.SEND_PARTIAL_STAT]: SendPartialStat.PacketData;
  [ServerPacketType.ADD_NEW_ENHANCED_ACTOR]: AddNewEnhancedActor.PacketData;
  [ServerPacketType.PING_REQUEST]: PingRequest.PacketData;
  [ServerPacketType.GET_ACTIVE_CHANNELS]: GetActiveChannels.PacketData;
  [ServerPacketType.YOU_DONT_EXIST]: YouDontExist.PacketData;
  [ServerPacketType.LOG_IN_OK]: LogInOk.PacketData;
  [ServerPacketType.LOG_IN_NOT_OK]: LogInNotOk.PacketData;
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
