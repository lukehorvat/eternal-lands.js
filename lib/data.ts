import { ClientPacketType, ServerPacketType } from './types';
import { ChatChannel } from './constants';

export interface ClientPacketData extends Record<ClientPacketType, any[]> {
  [ClientPacketType.PING]: [echo: number];
  [ClientPacketType.HEARTBEAT]: [];
  [ClientPacketType.PING_RESPONSE]: [echo: number];
}

export interface ServerPacketData extends Record<ServerPacketType, any[]> {
  [ServerPacketType.UNSUPPORTED]: [type: number];
  [ServerPacketType.CHAT]: [channel: ChatChannel, message: string];
  [ServerPacketType.PONG]: [echo: number];
  [ServerPacketType.PING_REQUEST]: [echo: number];
}

export const clientPacketDataFromBuffer: {
  [Type in ClientPacketType]: (data: Buffer) => ClientPacketData[Type];
} = {
  [ClientPacketType.PING]: (data: Buffer) => {
    const echo = data.readUInt32LE(0); // 4 bytes
    return [echo];
  },
  [ClientPacketType.HEARTBEAT]: (data: Buffer) => {
    return [];
  },
  [ClientPacketType.PING_RESPONSE]: (data: Buffer) => {
    const echo = data.readUInt32LE(0); // 4 bytes
    return [echo];
  },
};

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
  [ClientPacketType.PING_RESPONSE]: (echo: number) => {
    const echoBuffer = Buffer.alloc(4);
    echoBuffer.writeUInt32LE(echo);
    return echoBuffer;
  },
};

export const serverPacketDataFromBuffer: {
  [Type in Exclude<ServerPacketType, ServerPacketType.UNSUPPORTED>]: (
    data: Buffer
  ) => ServerPacketData[Type];
} = {
  [ServerPacketType.CHAT]: (data: Buffer) => {
    const channel = data.readUInt8(0); // 1 byte
    const message = data.toString('binary', 1);
    return [channel, message];
  },
  [ServerPacketType.PONG]: (data: Buffer) => {
    const echo = data.readUInt32LE(0); // 4 bytes
    return [echo];
  },
  [ServerPacketType.PING_REQUEST]: (data: Buffer) => {
    const echo = data.readUInt32LE(0); // 4 bytes
    return [echo];
  },
};

export const serverPacketDataToBuffer: {
  [Type in Exclude<ServerPacketType, ServerPacketType.UNSUPPORTED>]: (
    ...data: ServerPacketData[Type]
  ) => Buffer;
} = {
  [ServerPacketType.CHAT]: (channel: ChatChannel, message: string) => {
    const channelBuffer = Buffer.alloc(1);
    channelBuffer.writeUInt8(channel); // 1 byte
    const messageBuffer = Buffer.from(message, 'binary');
    return Buffer.concat([channelBuffer, messageBuffer]);
  },
  [ServerPacketType.PONG]: (echo: number) => {
    const echoBuffer = Buffer.alloc(4);
    echoBuffer.writeUInt32LE(echo);
    return echoBuffer;
  },
  [ServerPacketType.PING_REQUEST]: (echo: number) => {
    const echoBuffer = Buffer.alloc(4);
    echoBuffer.writeUInt32LE(echo);
    return echoBuffer;
  },
};
