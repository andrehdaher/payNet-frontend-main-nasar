const PROWAVE_FILES_URL =
  process.env.REACT_APP_PROWAVE_FILES_URL || "https://www.pro-wave.net";

export const getProWaveImageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  if (path.startsWith("//")) return `https:${path}`;

  try {
    return new URL(path, PROWAVE_FILES_URL).toString();
  } catch {
    return path;
  }
};

const PROWAVE_GROUP_IMAGE_PATHS = {
  "Steam USA Cards": "/files/Steam USA.jpg",
  "Steam European Cards": "/files/Steam Europe.png",
  "Steam KSA Cards": "/files/Steam KSAf0ae5e.jpg",
  "Steam UAE Cards": "/files/Steam UAE.jpg",
  "iTunes USA Cards": "/files/Apple USA.png",
  "iTunes Germany Cards": "/files/iTunes Germany.png",
  "iTunes KSA Cards": "/files/iTunes KSA 1.jpg",
  "iTunes UAE Cards": "/files/Apple UAE.jpg",
  "iTunes Turkey Cards": "/files/iTunes Turkey 03.png",
  "PlayStation USA Cards": "/files/PSN USA.png",
  "PlayStation KSA Cards": "/files/PSN KSA.jpg",
  "PlayStation UAE Cards": "/files/PSN UAE 01.jpg",
  "XBOX USA Cards": "/files/Xbox USA 01.jpg",
  "XBOX KSA Cards": "/files/Xbox KSA 01.jpg",
  "XBOX UAE Cards": "/files/Xbox LIVE UAE.png",
  "Google Play USA cards": "/files/Google Play USA 2.png",
  "Google Play KSA cards": "/files/Google Play KSA.jpg",
  "Amazon USA Cards": "/files/Amazone USA51f851.jpg",
  "Amazon KSA Cards": "/files/Amazone KSA.png",
  "Amazon UAE Cards": "/files/Amazone UAE.png",
  "Netflix KSA Cards": "/files/Netflix KSA 02.png",
  "Netflix UAE Cards": "/files/Netflix UAE 02.png",
  "Shahid International Cards": "/files/Shahid VIP International - 3 Monthc9c491.png",
  "Shahid KSA Cards": "/files/Shahid VIP KSA - 3 Month.png",
  "Shahid UAE Cards": "/files/Shahid VIP UAE - 3 Month.png",
  "Nintendo USA Cards": "/files/Nintendo 3M Membership.png",
  "Spotify USA": "/files/Spotify 03.png",
  "Razer Gold Global Cards": "/files/razergold.png",
  "Razer Gold USA Cards": "/files/Razer 1.jpg",
  "Noon KSA Cards": "/files/Noon KSA.jpg",
  "Noon UAE Cards": "/files/Noon UAE.jpg",
  "EA Play USA": "/files/EA Play USA.png",
  "Anghami Global Cards": "/files/Anghami Plus Global - 1 Month.png",
  "SHEIN GCC Cards": "/files/Shein 07.png",
  "Blizzard USA Cards": "/files/Blizzard 01.webp",
  "Roblox USA Cards": "/files/ROBLOX.png",
  "PUBG Cards": "/files/PUBG 2.png",
  "Free Fire Cards": "/files/Free Fire.webp",
  "Fortnite USA Cards": "/files/Fortnite 10.png",
  "Valorant Turkey": "/files/Valorant Turkey 01.png",
  "Valorant Middle East": "/files/Valorant Middle East 017fe909.png",
  "League Of Legends USA": "/files/League Of Legends USA 01.png",
  "Epic Games KSA": "/files/Epic Games KSA 02.png",
  "Epic Games UAE": "/files/Epic Games UAE 03.png",
};

export const PROWAVE_PRODUCT_SECTION_IMAGE = getProWaveImageUrl(
  PROWAVE_GROUP_IMAGE_PATHS["Google Play USA cards"]
);

export const getProWaveGroupImage = (itemGroup, fallback = PROWAVE_PRODUCT_SECTION_IMAGE) => {
  return getProWaveImageUrl(PROWAVE_GROUP_IMAGE_PATHS[itemGroup]) || fallback;
};
