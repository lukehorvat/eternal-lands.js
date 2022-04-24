export enum ClientPacketType {
  RAW_TEXT = 0,
  PING = 13,
  HEART_BEAT = 14,
  PING_RESPONSE = 60,
  LOG_IN = 140,
}

export enum ServerPacketType {
  RAW_TEXT = 0,
  ADD_NEW_ACTOR = 1,
  ADD_ACTOR_COMMAND = 2,
  YOU_ARE = 3,
  SYNC_CLOCK = 4,
  NEW_MINUTE = 5,
  REMOVE_ACTOR = 6,
  CHANGE_MAP = 7,
  PONG = 11,
  ADD_NEW_ENHANCED_ACTOR = 51,
  PING_REQUEST = 60,
  YOU_DONT_EXIST = 249,
  LOG_IN_OK = 250,
  LOG_IN_NOT_OK = 251,
}
