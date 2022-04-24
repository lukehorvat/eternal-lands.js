import { ClientPacketType, ServerPacketType } from './types';
import { ChatChannel } from './constants';

export interface ClientPacketData extends Record<ClientPacketType, any[]> {
  [ClientPacketType.RAW_TEXT]: [message: string];
  [ClientPacketType.PING]: [echo: number];
  [ClientPacketType.HEARTBEAT]: [];
  [ClientPacketType.PING_RESPONSE]: [echo: number];
  [ClientPacketType.LOGIN]: [username: string, password: string];
}

export interface ServerPacketData extends Record<ServerPacketType, any[]> {
  [ServerPacketType.RAW_TEXT]: [channel: ChatChannel, message: string];
  [ServerPacketType.YOU_ARE]: [actorId: number];
  [ServerPacketType.SYNC_CLOCK]: [serverTimestamp: number];
  [ServerPacketType.NEW_MINUTE]: [minute: number];
  [ServerPacketType.CHANGE_MAP]: [mapFilePath: string];
  [ServerPacketType.PONG]: [echo: number];
  [ServerPacketType.PING_REQUEST]: [echo: number];
  [ServerPacketType.YOU_DONT_EXIST]: [];
  [ServerPacketType.LOGIN_SUCCESSFUL]: [];
  [ServerPacketType.LOGIN_FAILED]: [reason: string];
}

export const packetDataParsers: {
  client: {
    [Type in ClientPacketType]: {
      fromBuffer: (dataBuffer: Buffer) => ClientPacketData[Type];
      toBuffer: (data: ClientPacketData[Type]) => Buffer;
    };
  };
  server: {
    [Type in ServerPacketType]: {
      fromBuffer: (dataBuffer: Buffer) => ServerPacketData[Type];
      toBuffer: (data: ServerPacketData[Type]) => Buffer;
    };
  };
} = {
  client: {
    [ClientPacketType.RAW_TEXT]: {
      fromBuffer(dataBuffer: Buffer) {
        const message = dataBuffer.toString('ascii');
        return [message];
      },
      toBuffer([message]) {
        return Buffer.from(message, 'ascii');
      },
    },
    [ClientPacketType.PING]: {
      fromBuffer(dataBuffer: Buffer) {
        const echo = dataBuffer.readUInt32LE(0); // 4 bytes
        return [echo];
      },
      toBuffer([echo]) {
        const echoBuffer = Buffer.alloc(4);
        echoBuffer.writeUInt32LE(echo);
        return echoBuffer;
      },
    },
    [ClientPacketType.HEARTBEAT]: {
      fromBuffer(dataBuffer: Buffer) {
        return [];
      },
      toBuffer() {
        return Buffer.alloc(0);
      },
    },
    [ClientPacketType.PING_RESPONSE]: {
      fromBuffer(dataBuffer: Buffer) {
        const echo = dataBuffer.readUInt32LE(0); // 4 bytes
        return [echo];
      },
      toBuffer([echo]) {
        const echoBuffer = Buffer.alloc(4);
        echoBuffer.writeUInt32LE(echo);
        return echoBuffer;
      },
    },
    [ClientPacketType.LOGIN]: {
      fromBuffer(dataBuffer: Buffer) {
        const [_, username, password] = dataBuffer
          .toString('ascii')
          .match(/^(\w+)\s(.+)\0$/)!;
        return [username, password];
      },
      toBuffer([username, password]) {
        // A string with username and password separated by a space, ending with
        // a null-terminator.
        return Buffer.from(`${username} ${password}\0`, 'ascii');
      },
    },
  },
  server: {
    [ServerPacketType.RAW_TEXT]: {
      fromBuffer(dataBuffer: Buffer) {
        const channel = dataBuffer.readUInt8(0); // 1 byte
        const message = dataBuffer.toString('ascii', 1);
        return [channel, message];
      },
      toBuffer([channel, message]) {
        const channelBuffer = Buffer.alloc(1);
        channelBuffer.writeUInt8(channel); // 1 byte
        const messageBuffer = Buffer.from(message, 'ascii');
        return Buffer.concat([channelBuffer, messageBuffer]);
      },
    },
    [ServerPacketType.YOU_ARE]: {
      fromBuffer(dataBuffer: Buffer) {
        const actorId = dataBuffer.readUInt16LE(0);
        return [actorId];
      },
      toBuffer([actorId]) {
        const actorIdBuffer = Buffer.alloc(2);
        actorIdBuffer.writeUInt16LE(actorId); // 2 bytes
        return actorIdBuffer;
      },
    },
    [ServerPacketType.SYNC_CLOCK]: {
      fromBuffer(dataBuffer: Buffer) {
        const serverTimestamp = dataBuffer.readUInt32LE(0); // 4 bytes
        return [serverTimestamp];
      },
      toBuffer([serverTimestamp]) {
        const serverTimestampBuffer = Buffer.alloc(4);
        serverTimestampBuffer.writeUInt32LE(serverTimestamp);
        return serverTimestampBuffer;
      },
    },
    [ServerPacketType.NEW_MINUTE]: {
      fromBuffer(dataBuffer: Buffer) {
        const minute = dataBuffer.readUInt16LE(0);
        return [minute];
      },
      toBuffer([minute]) {
        const minuteBuffer = Buffer.alloc(2);
        minuteBuffer.writeUInt16LE(minute); // 2 bytes
        return minuteBuffer;
      },
    },
    [ServerPacketType.CHANGE_MAP]: {
      fromBuffer(dataBuffer: Buffer) {
        const [_, mapFilePath] = dataBuffer
          .toString('ascii')
          .match(/^(.+)\0$/)!;
        return [mapFilePath];
      },
      toBuffer([mapFilePath]) {
        // A string representing the path to a map file, ending with a null-terminator.
        return Buffer.from(`${mapFilePath}\0`, 'ascii');
      },
    },
    [ServerPacketType.PONG]: {
      fromBuffer(dataBuffer: Buffer) {
        const echo = dataBuffer.readUInt32LE(0); // 4 bytes
        return [echo];
      },
      toBuffer([echo]) {
        const echoBuffer = Buffer.alloc(4);
        echoBuffer.writeUInt32LE(echo);
        return echoBuffer;
      },
    },
    [ServerPacketType.PING_REQUEST]: {
      fromBuffer(dataBuffer: Buffer) {
        const echo = dataBuffer.readUInt32LE(0); // 4 bytes
        return [echo];
      },
      toBuffer([echo]) {
        const echoBuffer = Buffer.alloc(4);
        echoBuffer.writeUInt32LE(echo);
        return echoBuffer;
      },
    },
    [ServerPacketType.YOU_DONT_EXIST]: {
      fromBuffer(dataBuffer: Buffer) {
        return [];
      },
      toBuffer() {
        return Buffer.alloc(0);
      },
    },
    [ServerPacketType.LOGIN_SUCCESSFUL]: {
      fromBuffer(dataBuffer: Buffer) {
        return [];
      },
      toBuffer() {
        return Buffer.alloc(0);
      },
    },
    [ServerPacketType.LOGIN_FAILED]: {
      fromBuffer(dataBuffer: Buffer) {
        const reason = dataBuffer.toString('ascii');
        return [reason];
      },
      toBuffer([reason]) {
        return Buffer.from(reason, 'ascii');
      },
    },
  },
};
