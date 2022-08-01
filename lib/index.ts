import { ClientPacketType } from './data/client';
import { ServerPacketType } from './data/server';

export { Connection as ELPackets } from './connection';

export * as ELConstants from './constants';

export const ELPacketType = {
  client: ClientPacketType,
  server: ServerPacketType,
};
