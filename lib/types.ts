export enum ClientPacketType {
  PING = 13,
  HEARTBEAT = 14,
}

export enum ServerPacketType {
  UNSUPPORTED = -1,
  CHAT = 0,
  PONG = 11,
}
