import fallbackImage from "../assets/application.jpeg";

const localAssets = require.context("../assets", false, /^\.\/[A-Z0-9]+\.jpeg$/);
const images = Object.fromEntries(localAssets.keys().map((path) => [
  path.replace(/^\.\//, "").replace(/\.jpeg$/, ""), localAssets(path),
]));
const aliases = { AHLAN: "AHLANCHAT", SOULCHILL: "SOULHILLCRYSTAL", POPPOLIVE: "POPPOLLIVE", "4FUN": "4FUNCHAT" };
const imageKeys = [...Object.keys(aliases), ...Object.keys(images)].sort((a, b) => b.length - a.length);
const normalize = (value) => String(value || "").toUpperCase().replace(/[^A-Z0-9]/g, "");

const findLocalImage = (name) => {
  const normalized = normalize(name);
  const key = imageKeys.find((candidate) => normalized === candidate ||
    (normalized.startsWith(candidate) && /^\d/.test(normalized.slice(candidate.length))));
  return images[aliases[key] || key] || "";
};

export const getAlraghebImage = (item = {}) => findLocalImage(item.name) ||
  findLocalImage(item.category_name) || item.image_url || fallbackImage;

export const ALRAGHEB_FALLBACK_IMAGE = fallbackImage;
