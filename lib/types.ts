export enum ClientPacketType {
  PING = 13,
  HEARTBEAT = 14,
  PING_RESPONSE = 60,
}

export enum ServerPacketType {
  UNSUPPORTED = -1,
  CHAT = 0,
  PONG = 11,
  PING_REQUEST = 60,
}
