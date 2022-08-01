import { PacketDataParser } from '../packets';
import * as RawText from './raw-text';
import * as AddNewActor from './add-new-actor';
import * as AddActorCommand from './add-actor-command';
import * as YouAre from './you-are';
import * as SyncClock from './sync-clock';
import * as NewMinute from './new-minute';
import * as RemoveActor from './remove-actor';
import * as ChangeMap from './change-map';
import * as Pong from './pong';
import * as HereYourStats from './here-your-stats';
import * as HereYourInventory from './here-your-inventory';
import * as AddNewEnhancedActor from './add-new-enhanced-actor';
import * as PingRequest from './ping-request';
import * as GetActiveChannels from './get-active-channels';
import * as YouDontExist from './you-dont-exist';
import * as LogInOk from './log-in-ok';
import * as LogInNotOk from './log-in-not-ok';

export enum ServerPacketType {
  RAW_TEXT = 0,
  ADD_NEW_ACTOR = 1,
  ADD_ACTOR_COMMAND = 2,
  YOU_ARE = 3,
  SYNC_CLOCK = 4,
  NEW_MINUTE = 5,
  REMOVE_ACTOR = 6,
  CHANGE_MAP = 7,
  PONG = 11,
  HERE_YOUR_STATS = 18,
  HERE_YOUR_INVENTORY = 19,
  ADD_NEW_ENHANCED_ACTOR = 51,
  PING_REQUEST = 60,
  GET_ACTIVE_CHANNELS = 71,
  YOU_DONT_EXIST = 249,
  LOG_IN_OK = 250,
  LOG_IN_NOT_OK = 251,
}

export interface ServerPacketData
  extends Record<ServerPacketType, Record<string, any | never>> {
  [ServerPacketType.RAW_TEXT]: RawText.PacketData;
  [ServerPacketType.ADD_NEW_ACTOR]: AddNewActor.PacketData;
  [ServerPacketType.ADD_ACTOR_COMMAND]: AddActorCommand.PacketData;
  [ServerPacketType.YOU_ARE]: YouAre.PacketData;
  [ServerPacketType.SYNC_CLOCK]: SyncClock.PacketData;
  [ServerPacketType.NEW_MINUTE]: NewMinute.PacketData;
  [ServerPacketType.REMOVE_ACTOR]: RemoveActor.PacketData;
  [ServerPacketType.CHANGE_MAP]: ChangeMap.PacketData;
  [ServerPacketType.PONG]: Pong.PacketData;
  [ServerPacketType.HERE_YOUR_STATS]: HereYourStats.PacketData;
  [ServerPacketType.HERE_YOUR_INVENTORY]: HereYourInventory.PacketData;
  [ServerPacketType.ADD_NEW_ENHANCED_ACTOR]: AddNewEnhancedActor.PacketData;
  [ServerPacketType.PING_REQUEST]: PingRequest.PacketData;
  [ServerPacketType.GET_ACTIVE_CHANNELS]: GetActiveChannels.PacketData;
  [ServerPacketType.YOU_DONT_EXIST]: YouDontExist.PacketData;
  [ServerPacketType.LOG_IN_OK]: LogInOk.PacketData;
  [ServerPacketType.LOG_IN_NOT_OK]: LogInNotOk.PacketData;
}

export const ServerPacketDataParsers: {
  [Type in ServerPacketType]: PacketDataParser<ServerPacketData[Type]>;
} = {
  [ServerPacketType.RAW_TEXT]: RawText.DataParser,
  [ServerPacketType.ADD_NEW_ACTOR]: AddNewActor.DataParser,
  [ServerPacketType.ADD_ACTOR_COMMAND]: AddActorCommand.DataParser,
  [ServerPacketType.YOU_ARE]: YouAre.DataParser,
  [ServerPacketType.SYNC_CLOCK]: SyncClock.DataParser,
  [ServerPacketType.NEW_MINUTE]: NewMinute.DataParser,
  [ServerPacketType.REMOVE_ACTOR]: RemoveActor.DataParser,
  [ServerPacketType.CHANGE_MAP]: ChangeMap.DataParser,
  [ServerPacketType.PONG]: Pong.DataParser,
  [ServerPacketType.HERE_YOUR_STATS]: HereYourStats.DataParser,
  [ServerPacketType.HERE_YOUR_INVENTORY]: HereYourInventory.DataParser,
  [ServerPacketType.ADD_NEW_ENHANCED_ACTOR]: AddNewEnhancedActor.DataParser,
  [ServerPacketType.PING_REQUEST]: PingRequest.DataParser,
  [ServerPacketType.GET_ACTIVE_CHANNELS]: GetActiveChannels.DataParser,
  [ServerPacketType.YOU_DONT_EXIST]: YouDontExist.DataParser,
  [ServerPacketType.LOG_IN_OK]: LogInOk.DataParser,
  [ServerPacketType.LOG_IN_NOT_OK]: LogInNotOk.DataParser,
};
