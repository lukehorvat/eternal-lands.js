import { ClientPacketType, ServerPacketType } from './types';
import { ChatChannel } from './constants';

export interface ClientPacketData extends Record<ClientPacketType, any[]> {
  [ClientPacketType.PING]: [echo: number];
  [ClientPacketType.HEARTBEAT]: [];
}

export interface ServerPacketData extends Record<ServerPacketType, any[]> {
  [ServerPacketType.UNSUPPORTED]: [type: number];
  [ServerPacketType.PONG]: [echo: number];
  [ServerPacketType.CHAT]: [channel: ChatChannel, message: string];
}

export const clientPacketDataToBuffer: {
  [Type in ClientPacketType]: (...data: ClientPacketData[Type]) => Buffer;
} = {
  [ClientPacketType.PING]: (echo: number) => {
    const echoBuffer = Buffer.alloc(4);
    echoBuffer.writeUInt32LE(echo);
    return echoBuffer;
  },
  [ClientPacketType.HEARTBEAT]: () => {
    return Buffer.alloc(0);
  },
};

export const serverPacketDataFromBuffer: {
  [Type in Exclude<ServerPacketType, ServerPacketType.UNSUPPORTED>]: (
    data: Buffer
  ) => ServerPacketData[Type];
} = {
  [ServerPacketType.PONG]: (data: Buffer) => {
    const echo = data.readUInt32LE(0); // 4 bytes
    return [echo];
  },
  [ServerPacketType.CHAT]: (data: Buffer) => {
    const channel = data.readUInt8(0); // 1 byte
    const message = data.toString('binary', 1);
    return [channel, message];
  },
};
