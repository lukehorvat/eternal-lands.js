import { PacketType } from '../packets';

export type Data = {
  type: PacketType;
  data: Buffer;
};
