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
import * as Pong from './pong';
import * as HereYourStats from './here-your-stats';
import * as HereYourInventory from './here-your-inventory';
import * as InventoryItemText from './inventory-item-text';
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
  PONG = 11,
  HERE_YOUR_STATS = 18,
  HERE_YOUR_INVENTORY = 19,
  INVENTORY_ITEM_TEXT = 20,
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
  [ServerPacketType.PONG]: Pong.PacketData;
  [ServerPacketType.HERE_YOUR_STATS]: HereYourStats.PacketData;
  [ServerPacketType.HERE_YOUR_INVENTORY]: HereYourInventory.PacketData;
  [ServerPacketType.INVENTORY_ITEM_TEXT]: InventoryItemText.PacketData;
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
  [ServerPacketType.PONG]: Pong.DataParser,
  [ServerPacketType.HERE_YOUR_STATS]: HereYourStats.DataParser,
  [ServerPacketType.HERE_YOUR_INVENTORY]: HereYourInventory.DataParser,
  [ServerPacketType.INVENTORY_ITEM_TEXT]: InventoryItemText.DataParser,
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
