import { PacketType } from '../common';

export type Data = {
  type: PacketType;
  data: Buffer;
};
