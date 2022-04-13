import { ClientPacketType, ServerPacketType } from './types';

export { Connection as ELPackets } from './connection';

export * as ELConstants from './constants';

export const ELPacketType = {
  client: ClientPacketType,
  server: ServerPacketType,
};
