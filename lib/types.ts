export enum ClientPacketType {
  PING = 13,
  HEARTBEAT = 14,
  PING_RESPONSE = 60,
  LOGIN = 140,
}

export enum ServerPacketType {
  CHAT = 0,
  PONG = 11,
  PING_REQUEST = 60,
  YOU_DONT_EXIST = 249,
  LOGIN_SUCCESSFUL = 250,
  LOGIN_FAILED = 251,
}
