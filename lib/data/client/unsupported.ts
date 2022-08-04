import { PacketType } from '../packets';

export type PacketData = {
  type: PacketType;
  data: Buffer;
};
