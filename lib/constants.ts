export const SERVER_HOST = 'game.eternal-lands.com';

export enum ServerPort {
  MAIN_SERVER = 2000,
  TEST_SERVER = 2001,
  PK_SERVER = 2002,
}

export enum ChatChannel {
  LOCAL = 0,
  PRIVATE = 1,
  GUILD = 2,
  SERVER = 3,
  MODERATOR = 4,
  CHANNEL1 = 5,
  CHANNEL2 = 6,
  CHANNEL3 = 7,
  MODERATOR_PRIVATE = 8,
}

/**
 * See: https://github.com/raduprv/Eternal-Lands/blob/0c6335c3bf8bdbfbb7bcfb2eab75f00e26ad1a7b/client_serv.h#L17-L98
 */
export enum ActorType {
  HUMAN_FEMALE = 0,
  HUMAN_MALE = 1,
  ELF_FEMALE = 2,
  ELF_MALE = 3,
  DWARF_FEMALE = 4,
  DWARF_MALE = 5,
  WRAITH = 6,
  CYCLOPS = 7,
  BEAVER = 8,
  RAT = 9,
  GOBLIN_MALE_2 = 10,
  GOBLIN_FEMALE_1 = 11,
  TOWN_FOLK4 = 12,
  TOWN_FOLK5 = 13,
  SHOP_GIRL3 = 14,
  DEER = 15,
  BEAR = 16,
  WOLF = 17,
  WHITE_RABBIT = 18,
  BROWN_RABBIT = 19,
  BOAR = 20,
  BEAR2 = 21,
  SNAKE1 = 22,
  SNAKE2 = 23,
  SNAKE3 = 24,
  FOX = 25,
  PUMA = 26,
  OGRE_MALE_1 = 27,
  GOBLIN_MALE_1 = 28,
  ORC_MALE_1 = 29,
  ORC_FEMALE_1 = 30,
  SKELETON = 31,
  GARGOYLE1 = 32,
  GARGOYLE2 = 33,
  GARGOYLE3 = 34,
  TROLL = 35,
  CHIMERAN_WOLF_MOUNTAIN = 36,
  GNOME_FEMALE = 37,
  GNOME_MALE = 38,
  ORCHAN_FEMALE = 39,
  ORCHAN_MALE = 40,
  DRAEGONI_FEMALE = 41,
  DRAEGONI_MALE = 42,
  SKUNK_1 = 43,
  RACOON_1 = 44,
  UNICORN_1 = 45,
  CHIMERAN_WOLF_DESERT = 46,
  CHIMERAN_WOLF_FOREST = 47,
  BEAR_3 = 48,
  BEAR_4 = 49,
  PANTHER = 50,
  FERAN = 51,
  LEOPARD_1 = 52,
  LEOPARD_2 = 53,
  CHIMERAN_WOLF_ARCTIC = 54,
  TIGER_1 = 55,
  TIGER_2 = 56,
  ARMED_FEMALE_ORC = 57,
  ARMED_MALE_ORC = 58,
  ARMED_SKELETON = 59,
  PHANTOM_WARRIOR = 60,
  IMP = 61,
  BROWNIE = 62,
  LEPRECHAUN = 63,
  SPIDER_S_1 = 64,
  SPIDER_S_2 = 65,
  SPIDER_S_3 = 66,
  SPIDER_L_1 = 67,
  SPIDER_L_2 = 68,
  SPIDER_L_3 = 69,
  WOOD_SPRITE = 70,
  SPIDER_L_4 = 71,
  SPIDER_S_4 = 72,
  GIANT_1 = 73,
  HOBGOBLIN = 74,
  YETI = 75,
  SNAKE4 = 76,
  FEROS = 77,
  DRAGON1 = 78,
}

/**
 * See: https://github.com/raduprv/Eternal-Lands/blob/0c6335c3bf8bdbfbb7bcfb2eab75f00e26ad1a7b/client_serv.h#L105-L110
 */
export enum ActorSkin {
  BROWN = 0,
  NORMAL = 1,
  PALE = 2,
  TAN = 3,
  DARK_BLUE = 4,
  WHITE = 5,
}

/**
 * See: https://github.com/raduprv/Eternal-Lands/blob/0c6335c3bf8bdbfbb7bcfb2eab75f00e26ad1a7b/client_serv.h#L155-L170
 */
export enum ActorHair {
  BLACK = 0,
  BLOND = 1,
  BROWN = 2,
  GRAY = 3,
  RED = 4,
  WHITE = 5,
  BLUE = 6,
  GREEN = 7,
  PURPLE = 8,
  DARK_BROWN = 9,
  STRAWBERRY = 10,
  LIGHT_BLOND = 11,
  DIRTY_BLOND = 12,
  BROWN_GRAY = 13,
  DARK_GRAY = 14,
  DARK_RED = 15,
}

/**
 * See: https://github.com/raduprv/Eternal-Lands/blob/0c6335c3bf8bdbfbb7bcfb2eab75f00e26ad1a7b/client_serv.h#L117-L138
 */
export enum ActorShirt {
  BLACK = 0,
  BLUE = 1,
  BROWN = 2,
  GREY = 3,
  GREEN = 4,
  LIGHTBROWN = 5,
  ORANGE = 6,
  PINK = 7,
  PURPLE = 8,
  RED = 9,
  WHITE = 10,
  YELLOW = 11,
  LEATHER_ARMOR = 12,
  CHAIN_ARMOR = 13,
  STEEL_CHAIN_ARMOR = 14,
  TITANIUM_CHAIN_ARMOR = 15,
  IRON_PLATE_ARMOR = 16,
  AUGMENTED_LEATHER_ARMOR = 17,
  FUR = 18,
  STEEL_PLATE_ARMOR = 19,
  TITANIUM_PLATE_ARMOR = 20,
  BRONZE_PLATE_ARMOR = 21,
}

/**
 * See: https://github.com/raduprv/Eternal-Lands/blob/0c6335c3bf8bdbfbb7bcfb2eab75f00e26ad1a7b/client_serv.h#L214-L229
 */
export enum ActorPants {
  BLACK = 0,
  BLUE = 1,
  BROWN = 2,
  DARKBROWN = 3,
  GREY = 4,
  GREEN = 5,
  LIGHTBROWN = 6,
  RED = 7,
  WHITE = 8,
  LEATHER = 9,
  IRON_CUISSES = 10,
  FUR = 11,
  STEEL_CUISSES = 12,
  TITANIUM_CUISSES = 13,
  BRONZE_CUISSES = 14,
  AUGMENTED_LEATHER_CUISSES = 15,
}

/**
 * See: https://github.com/raduprv/Eternal-Lands/blob/0c6335c3bf8bdbfbb7bcfb2eab75f00e26ad1a7b/client_serv.h#L195-L207
 */
export enum ActorBoots {
  BLACK = 0,
  BROWN = 1,
  DARKBROWN = 2,
  DULLBROWN = 3,
  LIGHTBROWN = 4,
  ORANGE = 5,
  LEATHER = 6,
  FUR = 7,
  IRON_GREAVE = 8,
  STEEL_GREAVE = 9,
  TITANIUM_GREAVE = 10,
  BRONZE_GREAVE = 11,
  AUGMENTED_LEATHER_GREAVE = 12,
}

/**
 * See: https://github.com/raduprv/Eternal-Lands/blob/0c6335c3bf8bdbfbb7bcfb2eab75f00e26ad1a7b/client_serv.h#L266-L270
 */
export enum ActorHead {
  ONE = 0,
  TWO = 1,
  THREE = 2,
  FOUR = 3,
  FIVE = 4,
}

/**
 * See: https://github.com/raduprv/Eternal-Lands/blob/0c6335c3bf8bdbfbb7bcfb2eab75f00e26ad1a7b/client_serv.h#L315-L323
 */
export enum ActorShield {
  WOOD = 0,
  WOOD_ENHANCED = 1,
  IRON = 2,
  STEEL = 3,
  TITANIUM = 4,
  BRONZE = 5,
  QUIVER_ARROWS = 7,
  NONE = 11,
  QUIVER_BOLTS = 13,
}

/**
 * See: https://github.com/raduprv/Eternal-Lands/blob/0c6335c3bf8bdbfbb7bcfb2eab75f00e26ad1a7b/client_serv.h#L330-L393
 */
export enum ActorWeapon {
  NONE = 0,
  SWORD_1 = 1,
  SWORD_2 = 2,
  SWORD_3 = 3,
  SWORD_4 = 4,
  SWORD_5 = 5,
  SWORD_6 = 6,
  SWORD_7 = 7,
  STAFF_1 = 8,
  STAFF_2 = 9,
  STAFF_3 = 10,
  STAFF_4 = 11,
  HAMMER_1 = 12,
  HAMMER_2 = 13,
  PICKAXE = 14,
  SWORD_1_FIRE = 15,
  SWORD_2_FIRE = 16,
  SWORD_2_COLD = 17,
  SWORD_3_FIRE = 18,
  SWORD_3_COLD = 19,
  SWORD_3_MAGIC = 20,
  SWORD_4_FIRE = 21,
  SWORD_4_COLD = 22,
  SWORD_4_MAGIC = 23,
  SWORD_4_THERMAL = 24,
  SWORD_5_FIRE = 25,
  SWORD_5_COLD = 26,
  SWORD_5_MAGIC = 27,
  SWORD_5_THERMAL = 28,
  SWORD_6_FIRE = 29,
  SWORD_6_COLD = 30,
  SWORD_6_MAGIC = 31,
  SWORD_6_THERMAL = 32,
  SWORD_7_FIRE = 33,
  SWORD_7_COLD = 34,
  SWORD_7_MAGIC = 35,
  SWORD_7_THERMAL = 36,
  PICKAXE_MAGIC = 37,
  BATTLEAXE_IRON = 38,
  BATTLEAXE_STEEL = 39,
  BATTLEAXE_TITANIUM = 40,
  BATTLEAXE_IRON_FIRE = 41,
  BATTLEAXE_STEEL_COLD = 42,
  BATTLEAXE_STEEL_FIRE = 43,
  BATTLEAXE_TITANIUM_COLD = 44,
  BATTLEAXE_TITANIUM_FIRE = 45,
  BATTLEAXE_TITANIUM_MAGIC = 46,
  GLOVE_FUR = 47,
  GLOVE_LEATHER = 48,
  BONE_1 = 49,
  STICK_1 = 50,
  SWORD_EMERALD_CLAYMORE = 51,
  SWORD_CUTLASS = 52,
  SWORD_SUNBREAKER = 53,
  SWORD_ORC_SLAYER = 54,
  SWORD_EAGLE_WING = 55,
  SWORD_RAPIER = 56,
  SWORD_JAGGED_SABER = 57,
  SWORD_BRONZE = 58,
  BOW_LONG = 64,
  BOW_SHORT = 65,
  BOW_RECURVE = 66,
  BOW_ELVEN = 67,
  BOW_CROSS = 68,
}

/**
 * See: https://github.com/raduprv/Eternal-Lands/blob/0c6335c3bf8bdbfbb7bcfb2eab75f00e26ad1a7b/client_serv.h#L236-L259
 */
export enum ActorCape {
  BLACK = 0,
  BLUE = 1,
  BLUEGRAY = 2,
  BROWN = 3,
  BROWNGRAY = 4,
  GRAY = 5,
  GREEN = 6,
  GREENGRAY = 7,
  PURPLE = 8,
  WHITE = 9,
  FUR = 10,
  GOLD = 11,
  RED = 12,
  ORANGE = 13,
  MOD = 14,
  DERIN = 15,
  RAVENOD = 16,
  PLACID = 17,
  LORD_VERMOR = 18,
  AISLINN = 19,
  SOLDUS = 20,
  LOTHARION = 21,
  LEARNER = 22,
  NONE = 30,
}

/**
 * See: https://github.com/raduprv/Eternal-Lands/blob/0c6335c3bf8bdbfbb7bcfb2eab75f00e26ad1a7b/client_serv.h#L298-L308
 */
export enum ActorHelmet {
  IRON = 0,
  FUR = 1,
  LEATHER = 2,
  RACOON = 3,
  SKUNK = 4,
  CROWN_OF_MANA = 5,
  CROWN_OF_LIFE = 6,
  STEEL = 7,
  TITANIUM = 8,
  BRONZE = 9,
  NONE = 20,
}

/**
 * See: https://github.com/raduprv/Eternal-Lands/blob/0c6335c3bf8bdbfbb7bcfb2eab75f00e26ad1a7b/actors.h#L39-L43
 */
export enum ActorKind {
  HUMAN = 1,
  NPC = 2,
  COMPUTER_CONTROLLED_HUMAN = 3,
  PKABLE_HUMAN = 4,
  PKABLE_COMPUTER_CONTROLLED = 5,
}
