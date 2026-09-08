export const PROWAVE_GROUPS = {
  PUBG: "PUBG Cards",
  "PUBG CARDS": "PUBG Cards",

  FREEFIRE: "Free Fire Cards",
  "FREE FIRE": "Free Fire Cards",
  "FREE FIRE CARDS": "Free Fire Cards",

  FORTNITE: "Fortnite USA Cards",
  "FORTNITE USA": "Fortnite USA Cards",
  "FORTNITE USA CARDS": "Fortnite USA Cards",

  VALORANT: "Valorant",
  "VALORANT TURKEY": "Valorant Turkey",
  "VALORANT TR": "Valorant Turkey",
  "VALORANT MIDDLE EAST": "Valorant Middle East",

  ROBLOX: "Roblox USA Cards",
  "ROBLOX USA": "Roblox USA Cards",
  "ROBLOX USA CARDS": "Roblox USA Cards",

  "LEAGUE OF LEGENDS": "League Of Legends USA",
  "LEAGUE OF LEGENDS USA": "League Of Legends USA",
  LOL: "League Of Legends USA",

  "EPIC GAMES KSA": "Epic Games KSA",
  "EPIC GAMES UAE": "Epic Games UAE",
};

export const PROWAVE_GAME_CARD_CATEGORIES = [
  {
    title: "شحن PUBG Mobile",
    formType: "PUBG",
    itemGroup: "PUBG Cards",
    description: "شحن بطاقات PUBG Mobile بسرعة وأمان.",
    imageKey: "PUBG",
    group: "ألعاب",
  },
  {
    title: "شحن Free Fire",
    formType: "FREE FIRE",
    itemGroup: "Free Fire Cards",
    description: "شحن بطاقات Free Fire بسرعة وأمان.",
    imageKey: "FREE_FIRE",
    group: "ألعاب",
  },
  {
    title: "بطاقات Fortnite USA",
    formType: "FORTNITE USA",
    itemGroup: "Fortnite USA Cards",
    description: "عرض وشراء بطاقات Fortnite USA المتاحة.",
    imageKey: "DEFAULT",
    group: "ألعاب",
  },
  {
    title: "شحن Valorant Turkey",
    formType: "VALORANT TURKEY",
    itemGroup: "Valorant Turkey",
    description: "عرض وشراء بطاقات Valorant Turkey المتاحة.",
    imageKey: "DEFAULT",
    group: "ألعاب",
  },
  {
    title: "شحن Valorant Middle East",
    formType: "VALORANT MIDDLE EAST",
    itemGroup: "Valorant Middle East",
    description: "عرض وشراء بطاقات Valorant Middle East المتاحة.",
    imageKey: "DEFAULT",
    group: "ألعاب",
  },
  {
    title: "بطاقات Roblox USA",
    formType: "ROBLOX USA",
    itemGroup: "Roblox USA Cards",
    description: "عرض وشراء بطاقات Roblox USA المتاحة.",
    imageKey: "DEFAULT",
    group: "ألعاب",
  },
  {
    title: "League of Legends USA",
    formType: "LEAGUE OF LEGENDS USA",
    itemGroup: "League Of Legends USA",
    description: "عرض وشراء بطاقات League of Legends USA.",
    imageKey: "DEFAULT",
    group: "ألعاب",
  },
  {
    title: "بطاقات Epic Games KSA",
    formType: "EPIC GAMES KSA",
    itemGroup: "Epic Games KSA",
    description: "عرض وشراء بطاقات Epic Games السعودية.",
    imageKey: "DEFAULT",
    group: "ألعاب",
  },
  {
    title: "بطاقات Epic Games UAE",
    formType: "EPIC GAMES UAE",
    itemGroup: "Epic Games UAE",
    description: "عرض وشراء بطاقات Epic Games الإماراتية.",
    imageKey: "DEFAULT",
    group: "ألعاب",
  },
];

export const PROWAVE_PLAY_GAMES = PROWAVE_GAME_CARD_CATEGORIES;

export const PROWAVE_DIRECT_TOPUP_GAMES = [
  {
    title: "شحن PUBG Mobile مباشر",
    game: "pubg",
    formType: "PROWAVE_DIRECT_PUBG",
    description: "شحن حساب PUBG Mobile مباشرة عبر ID اللاعب.",
    imageKey: "PUBG",
    inputLabel: "أدخل ID لاعب PUBG",
  },
  {
    title: "شحن Free Fire مباشر",
    game: "free_fire",
    formType: "PROWAVE_DIRECT_FREE_FIRE",
    description: "شحن حساب Free Fire مباشرة عبر ID اللاعب.",
    imageKey: "FREE_FIRE",
    inputLabel: "أدخل ID لاعب Free Fire",
  },
];

const normalizeDirectTopUpAlias = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");

const PROWAVE_DIRECT_TOPUP_GAME_BY_ALIAS = {
  pubg: "pubg",
  "pubg mobile": "pubg",
  "prowave direct pubg": "pubg",
  freefire: "free_fire",
  "free fire": "free_fire",
  "free fire mobile": "free_fire",
  "prowave direct free fire": "free_fire",
};

export const getProWaveDirectTopUpGameByAlias = (value) => {
  const normalizedAlias = normalizeDirectTopUpAlias(value);
  const gameCode = PROWAVE_DIRECT_TOPUP_GAME_BY_ALIAS[normalizedAlias];

  if (!gameCode) return null;

  return PROWAVE_DIRECT_TOPUP_GAMES.find((game) => game.game === gameCode) || null;
};

export const buildProWaveDirectTopUpRouteState = (game) => {
  if (!game) return null;

  return {
    provider: "prowave",
    mode: "direct-topup",
    game: game.game,
    title: game.title,
    inputLabel: game.inputLabel,
  };
};
