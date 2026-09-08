import {
  convertUsdToSyp,
  formatSypAmount,
  getUsdToSypRate,
  toNumber,
} from "../config/currency";

const PROWAVE_FILES_URL =
  process.env.REACT_APP_PROWAVE_FILES_URL || "https://www.pro-wave.net";

const pickPositiveNumber = (...values) => {
  return values.map(toNumber).find((value) => value > 0) || 0;
};

const pickString = (...values) =>
  values.find((value) => typeof value === "string" && value.trim()) || "";

const getProWaveImageUrl = (image) => {
  if (!image) return "";
  const imagePath = typeof image === "string" ? image : image.image || image.url || "";
  if (!imagePath) return "";
  if (imagePath.startsWith("http")) return imagePath;
  if (imagePath.startsWith("//")) return `https:${imagePath}`;

  try {
    return new URL(imagePath, PROWAVE_FILES_URL).toString();
  } catch {
    return imagePath;
  }
};

const getProWaveItemImage = (item) => {
  const slideshowImage = Array.isArray(item.slideshow_images)
    ? item.slideshow_images.find((image) => image?.image || image?.url)
    : null;

  return getProWaveImageUrl(
    slideshowImage ||
      item.website_image ||
      item.thumbnail ||
      item.image ||
      item.item_image ||
      item.image_url ||
      item.imageUrl ||
      item.file_url ||
      item.custom_image
  );
};

const getAvailabilityPayload = (response) => {
  const payload = response?.source === "prowave" ? response.data : response;

  if (payload?.message && typeof payload.message === "object") {
    return payload.message.data || payload.message;
  }

  return payload?.data || payload?.message || payload;
};

const toAvailabilityBoolean = (value) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value > 0;

  const normalized = String(value || "").trim().toLowerCase();
  if (!normalized) return null;

  if (["1", "true", "yes", "available", "in stock", "متوفر"].includes(normalized)) {
    return true;
  }

  if (["0", "false", "no", "unavailable", "out of stock", "غير متوفر"].includes(normalized)) {
    return false;
  }

  if (
    normalized.includes("not available") ||
    normalized.includes("unavailable") ||
    normalized.includes("out of stock") ||
    normalized.includes("not in stock") ||
    normalized.includes("غير متوفر")
  ) {
    return false;
  }

  if (
    normalized.includes("available") ||
    normalized.includes("in stock") ||
    normalized.includes("متوفر")
  ) {
    return true;
  }

  return null;
};

export const parseProWaveAvailability = (response) => {
  const payload = getAvailabilityPayload(response);
  const candidates = [
    payload?.is_available,
    payload?.available,
    payload?.availability,
    payload?.in_stock,
    payload?.stock_qty,
    payload?.qty,
    payload?.status,
    payload?.message,
    payload,
  ];

  const isAvailable = candidates
    .map(toAvailabilityBoolean)
    .find((value) => value !== null);
  const message =
    payload?.message ||
    payload?.status_message ||
    payload?.error ||
    response?.message ||
    "";

  return {
    isAvailable: Boolean(isAvailable),
    status: isAvailable ? "available" : "unavailable",
    message,
    raw: response,
  };
};

export const getProWaveItemsList = (itemsData) => {
  if (Array.isArray(itemsData)) return itemsData;

  return itemsData?.items || [];
};

export const mapProWaveItemToCard = (item, exchangeRate = getUsdToSypRate()) => {
  const priceUsd = pickPositiveNumber(
    item.paynet_sale_price_usd,
    item.sale_price_usd,
    item.customer_sale_price_usd,
    item.price_without_discount,
    item.priceWithoutDiscount,
    item.price_usd,
    item.prowave_price_usd,
    item.price_list_rate,
    item.price,
    item.web_item_price,
    item.standard_rate,
    item.rate,
    item.amount
  );
  const oldPriceUsd = priceUsd;
  const backendExchangeRate = pickPositiveNumber(
    item.paynet_exchange_rate,
    item.exchange_rate
  );
  const finalExchangeRate = backendExchangeRate || exchangeRate;
  const backendPriceSyp = pickPositiveNumber(
    item.paynet_price_syp,
    item.price_syp
  );
  const priceSyp = backendPriceSyp || convertUsdToSyp(priceUsd, finalExchangeRate);
  const formattedPrice = backendPriceSyp
    ? pickString(item.paynet_formatted_price, item.formatted_price_syp, item.formatted_price)
    : "";
  const stockQty = toNumber(item.stock_qty);
  const listInStock = toNumber(item.in_stock) > 0 || stockQty > 0;
  const title =
    item.custom_item_name_ar ||
    item.web_item_name ||
    item.item_name ||
    item.item_code;

  return {
    _id: item.name || item.item_code,
    title,
    titleAr: item.custom_item_name_ar || "",
    name: item.item_code,
    url: item.item_code,
    price: priceSyp,
    oldPrice: null,
    formattedPrice: formattedPrice || formatSypAmount(priceSyp),
    formattedOldPrice: "",
    priceUsd,
    oldPriceUsd,
    exchangeRate: finalExchangeRate,
    marginPercent: toNumber(item.paynet_margin_percent),
    roundingStep: toNumber(item.paynet_rounding_step) || 1,
    discountPercent: 0,
    discountLabel: "",
    image: getProWaveItemImage(item),
    description: item.custom_item_group_name_ar || item.item_group || "",
    isProWave: true,
    itemCode: item.item_code,
    proWaveName: item.name,
    stockQty,
    listInStock,
    inStock: true,
    availabilityStatus: "unknown",
    availabilityMessage: "",
    isDigitalCard: Boolean(toNumber(item.is_digital_card)),
    raw: item,
  };
};
