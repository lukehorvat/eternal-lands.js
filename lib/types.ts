export enum ClientPacketType {
  RAW_TEXT = 0,
  PING = 13,
  HEARTBEAT = 14,
  PING_RESPONSE = 60,
  LOGIN = 140,
}

export enum ServerPacketType {
  RAW_TEXT = 0,
  YOU_ARE = 3,
  SYNC_CLOCK = 4,
  NEW_MINUTE = 5,
  CHANGE_MAP = 7,
  PONG = 11,
  PING_REQUEST = 60,
  YOU_DONT_EXIST = 249,
  LOGIN_SUCCESSFUL = 250,
  LOGIN_FAILED = 251,
}
