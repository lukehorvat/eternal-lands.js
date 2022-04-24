import { ClientPacketType, ServerPacketType } from './types';
import {
  ActorBoots,
  ActorCape,
  ActorCommand,
  ActorHair,
  ActorHead,
  ActorHelmet,
  ActorKind,
  ActorPants,
  ActorShield,
  ActorShirt,
  ActorSkin,
  ActorType,
  ActorWeapon,
  ChatChannel,
} from './constants';

export interface ClientPacketData extends Record<ClientPacketType, any[]> {
  [ClientPacketType.RAW_TEXT]: [message: string];
  [ClientPacketType.PING]: [echo: number];
  [ClientPacketType.HEARTBEAT]: [];
  [ClientPacketType.PING_RESPONSE]: [echo: number];
  [ClientPacketType.LOGIN]: [username: string, password: string];
}

export interface ServerPacketData extends Record<ServerPacketType, any[]> {
  [ServerPacketType.RAW_TEXT]: [channel: ChatChannel, message: string];
  [ServerPacketType.ADD_NEW_ACTOR]: [
    id: number,
    xPos: number,
    yPos: number,
    zRotation: number,
    type: ActorType,
    maxHealth: number,
    currentHealth: number,
    name: string
  ];
  [ServerPacketType.ADD_ACTOR_COMMAND]: [
    actorId: number,
    command: ActorCommand
  ];
  [ServerPacketType.YOU_ARE]: [actorId: number];
  [ServerPacketType.SYNC_CLOCK]: [serverTimestamp: number];
  [ServerPacketType.NEW_MINUTE]: [minute: number];
  [ServerPacketType.REMOVE_ACTOR]: [actorId: number];
  [ServerPacketType.CHANGE_MAP]: [mapFilePath: string];
  [ServerPacketType.PONG]: [echo: number];
  [ServerPacketType.ADD_NEW_ENHANCED_ACTOR]: [
    id: number,
    xPos: number,
    yPos: number,
    zRotation: number,
    type: ActorType,
    skin: ActorSkin,
    hair: ActorHair,
    shirt: ActorShirt,
    pants: ActorPants,
    boots: ActorBoots,
    head: ActorHead,
    shield: ActorShield,
    weapon: ActorWeapon,
    cape: ActorCape,
    helmet: ActorHelmet,
    maxHealth: number,
    currentHealth: number,
    kind: ActorKind,
    name: string,
    guild?: string
  ];
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
    [ServerPacketType.ADD_NEW_ACTOR]: {
      fromBuffer(dataBuffer: Buffer) {
        const id = dataBuffer.readUInt16LE(0);
        const xPos = dataBuffer.readUInt16LE(2);
        const yPos = dataBuffer.readUInt16LE(4);
        const zRotation = dataBuffer.readUInt16LE(8);
        const type = dataBuffer.readUInt8(10);
        const maxHealth = dataBuffer.readUInt16LE(12);
        const currentHealth = dataBuffer.readUInt16LE(14);
        const [_, name] = dataBuffer
          .slice(17)
          .toString('ascii')
          .match(/^(.+?)\0/)!; // Capture until we encounter a null-terminator.

        return [
          id,
          xPos,
          yPos,
          zRotation,
          type,
          maxHealth,
          currentHealth,
          name,
        ];
      },
      toBuffer([
        id,
        xPos,
        yPos,
        zRotation,
        type,
        maxHealth,
        currentHealth,
        name,
      ]) {
        const idBuffer = Buffer.alloc(2);
        idBuffer.writeUInt16LE(id);
        const xPosBuffer = Buffer.alloc(2);
        xPosBuffer.writeUInt16LE(xPos);
        const yPosBuffer = Buffer.alloc(2);
        yPosBuffer.writeUInt16LE(yPos);
        const zRotationBuffer = Buffer.alloc(2);
        zRotationBuffer.writeUInt16LE(zRotation);
        const typeBuffer = Buffer.alloc(1);
        typeBuffer.writeUInt8(type);
        const maxHealthBuffer = Buffer.alloc(2);
        maxHealthBuffer.writeUInt16LE(maxHealth);
        const currentHealthBuffer = Buffer.alloc(2);
        currentHealthBuffer.writeUInt16LE(currentHealth);
        const nameBuffer = Buffer.from(`${name}\0`, 'ascii');

        return Buffer.concat([
          idBuffer,
          xPosBuffer,
          yPosBuffer,
          Buffer.alloc(2),
          zRotationBuffer,
          typeBuffer,
          Buffer.alloc(1),
          maxHealthBuffer,
          currentHealthBuffer,
          Buffer.alloc(1),
          nameBuffer,
        ]);
      },
    },
    [ServerPacketType.ADD_ACTOR_COMMAND]: {
      fromBuffer(dataBuffer: Buffer) {
        const actorId = dataBuffer.readUInt16LE(0); // 2 bytes
        const command = dataBuffer.readUInt8(2); // 1 byte
        return [actorId, command];
      },
      toBuffer([actorId, command]) {
        const actorIdBuffer = Buffer.alloc(2);
        actorIdBuffer.writeUInt16LE(actorId); // 2 bytes
        const commandBuffer = Buffer.alloc(1);
        commandBuffer.writeUInt8(command); // 1 byte
        return Buffer.concat([actorIdBuffer, commandBuffer]);
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
    [ServerPacketType.REMOVE_ACTOR]: {
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
    [ServerPacketType.ADD_NEW_ENHANCED_ACTOR]: {
      fromBuffer(dataBuffer: Buffer) {
        const id = dataBuffer.readUInt16LE(0);
        const xPos = dataBuffer.readUInt16LE(2);
        const yPos = dataBuffer.readUInt16LE(4);
        const zRotation = dataBuffer.readUInt16LE(8);
        const type = dataBuffer.readUInt8(10);
        const skin = dataBuffer.readUInt8(12);
        const hair = dataBuffer.readUInt8(13);
        const shirt = dataBuffer.readUInt8(14);
        const pants = dataBuffer.readUInt8(15);
        const boots = dataBuffer.readUInt8(16);
        const head = dataBuffer.readUInt8(17);
        const shield = dataBuffer.readUInt8(18);
        const weapon = dataBuffer.readUInt8(19);
        const cape = dataBuffer.readUInt8(20);
        const helmet = dataBuffer.readUInt8(21);
        const maxHealth = dataBuffer.readUInt16LE(23);
        const currentHealth = dataBuffer.readUInt16LE(25);
        const kind = dataBuffer.readUInt8(27);

        // TODO: Need to strip out any leading color codes from name and guild.
        // https://github.com/raduprv/Eternal-Lands/blob/0c6335c3bf8bdbfbb7bcfb2eab75f00e26ad1a7b/new_actors.c#L312
        const [name, guild] = dataBuffer
          .slice(28)
          .toString('ascii')
          .match(/^(.+?)\0/)![1] // Capture until we encounter a null-terminator.
          .split(' '); // Name and guild are separated by a space.

        return [
          id,
          xPos,
          yPos,
          zRotation,
          type,
          skin,
          hair,
          shirt,
          pants,
          boots,
          head,
          shield,
          weapon,
          cape,
          helmet,
          maxHealth,
          currentHealth,
          kind,
          name,
          guild,
        ];
      },
      toBuffer([
        id,
        xPos,
        yPos,
        zRotation,
        type,
        skin,
        hair,
        shirt,
        pants,
        boots,
        head,
        shield,
        weapon,
        cape,
        helmet,
        maxHealth,
        currentHealth,
        kind,
        name,
        guild,
      ]) {
        const idBuffer = Buffer.alloc(2);
        idBuffer.writeUInt16LE(id);
        const xPosBuffer = Buffer.alloc(2);
        xPosBuffer.writeUInt16LE(xPos);
        const yPosBuffer = Buffer.alloc(2);
        yPosBuffer.writeUInt16LE(yPos);
        const zRotationBuffer = Buffer.alloc(2);
        zRotationBuffer.writeUInt16LE(zRotation);
        const typeBuffer = Buffer.alloc(1);
        typeBuffer.writeUInt8(type);
        const skinBuffer = Buffer.alloc(1);
        skinBuffer.writeUInt8(skin);
        const hairBuffer = Buffer.alloc(1);
        hairBuffer.writeUInt8(hair);
        const shirtBuffer = Buffer.alloc(1);
        shirtBuffer.writeUInt8(shirt);
        const pantsBuffer = Buffer.alloc(1);
        pantsBuffer.writeUInt8(pants);
        const bootsBuffer = Buffer.alloc(1);
        bootsBuffer.writeUInt8(boots);
        const headBuffer = Buffer.alloc(1);
        headBuffer.writeUInt8(head);
        const shieldBuffer = Buffer.alloc(1);
        shieldBuffer.writeUInt8(shield);
        const weaponBuffer = Buffer.alloc(1);
        weaponBuffer.writeUInt8(weapon);
        const capeBuffer = Buffer.alloc(1);
        capeBuffer.writeUInt8(cape);
        const helmetBuffer = Buffer.alloc(1);
        helmetBuffer.writeUInt8(helmet);
        const maxHealthBuffer = Buffer.alloc(2);
        maxHealthBuffer.writeUInt16LE(maxHealth);
        const currentHealthBuffer = Buffer.alloc(2);
        currentHealthBuffer.writeUInt16LE(currentHealth);
        const kindBuffer = Buffer.alloc(1);
        kindBuffer.writeUInt8(kind);
        const nameAndGuildBuffer = Buffer.from(`${name} ${guild}\0`, 'ascii');

        return Buffer.concat([
          idBuffer,
          xPosBuffer,
          yPosBuffer,
          Buffer.alloc(2),
          zRotationBuffer,
          typeBuffer,
          Buffer.alloc(1),
          skinBuffer,
          hairBuffer,
          shirtBuffer,
          pantsBuffer,
          bootsBuffer,
          headBuffer,
          shieldBuffer,
          weaponBuffer,
          capeBuffer,
          helmetBuffer,
          Buffer.alloc(1),
          maxHealthBuffer,
          currentHealthBuffer,
          kindBuffer,
          nameAndGuildBuffer,
        ]);
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
