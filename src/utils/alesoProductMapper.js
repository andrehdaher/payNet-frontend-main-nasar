import {
  convertUsdToSyp,
  formatSypAmount,
  getUsdToSypRate,
  toNumber,
} from "../config/currency";

const ALESO_FILES_URL =
  process.env.REACT_APP_ALESO_FILES_URL || "https://api.alesostore.com";

const pickPositiveNumber = (...values) =>
  values.map(toNumber).find((value) => value > 0) || 0;

const pickString = (...values) =>
  values.find((value) => typeof value === "string" && value.trim()) || "";

const getAlesoImageUrl = (image) => {
  if (!image) return "";
  const imagePath = typeof image === "string" ? image : image.image || image.url || "";
  if (!imagePath) return "";
  if (imagePath.startsWith("http")) return imagePath;
  if (imagePath.startsWith("//")) return `https:${imagePath}`;

  try {
    return new URL(imagePath.replace(/^\/+/, ""), `${ALESO_FILES_URL}/`).toString();
  } catch {
    return imagePath;
  }
};

export const getAlesoItemsList = (itemsData) => {
  if (Array.isArray(itemsData)) return itemsData;
  if (Array.isArray(itemsData?.items)) return itemsData.items;
  if (Array.isArray(itemsData?.products)) return itemsData.products;

  return [];
};

export const getAlesoInputFields = (item) => {
  const params = Array.isArray(item?.params) ? item.params : [];

  return params.map((param, index) => ({
    name: index === 0 ? "playerId" : `param_${index + 1}`,
    label: String(param || `Field ${index + 1}`).trim(),
    required: true,
  }));
};

export const mapAlesoProductToCard = (item, fallbackImage = "") => {
  const priceUsd = pickPositiveNumber(
    item.paynet_sale_price_usd,
    item.aleso_price_usd,
    item.price_usd,
    item.price,
  );
  const exchangeRate = pickPositiveNumber(item.paynet_exchange_rate) || getUsdToSypRate();
  const backendPriceSyp = pickPositiveNumber(
    item.paynet_price_syp,
    item.price_syp,
  );
  const priceSyp = backendPriceSyp || convertUsdToSyp(priceUsd, exchangeRate);
  const formattedPrice = pickString(
    item.paynet_formatted_price,
    item.formatted_price_syp,
    item.formatted_price,
  );
  const quantityRules = item.quantity_rules || { mode: "fixed", min: 1, max: 1, defaultQty: 1 };
  const available = item.available !== false;
  const title = item.name || `Aleso #${item.id}`;

  return {
    _id: `aleso-${item.id}`,
    title,
    name: `Aleso #${item.id}`,
    url: String(item.id || ""),
    price: priceSyp,
    oldPrice: null,
    formattedPrice: formattedPrice || formatSypAmount(priceSyp),
    formattedOldPrice: "",
    priceUsd,
    exchangeRate,
    marginPercent: toNumber(item.paynet_margin_percent),
    roundingStep: toNumber(item.paynet_rounding_step) || 1,
    image: getAlesoImageUrl(item.image_url || item.category_img || item.image) || fallbackImage,
    description: item.category_name || item.section_label || "",
    isAleso: true,
    providerName: "Aleso",
    alesoProductId: Number(item.product_id || item.aleso_product_id || item.id),
    alesoParams: Array.isArray(item.params) ? item.params : [],
    inputFields: getAlesoInputFields(item),
    qtyValues: item.qty_values,
    quantityRules,
    productType: item.product_type,
    categoryName: item.category_name,
    inStock: available,
    availabilityStatus: available ? "available" : "unavailable",
    availabilityMessage: available ? "" : "غير متوفر حاليا لدى Aleso",
    btntext: available ? "شراء" : "غير متوفر",
    raw: item,
  };
};
