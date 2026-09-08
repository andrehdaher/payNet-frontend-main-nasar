export const DEFAULT_USD_TO_SYP_RATE = 135;
export const SYP_SYMBOL = "ل.س";

export const toNumber = (value) => {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;

  const cleaned = String(value || "").replace(/[^0-9.-]/g, "");
  return Number(cleaned) || 0;
};

export const getUsdToSypRate = () => {
  const envRate = toNumber(process.env.REACT_APP_USD_TO_SYP_RATE);
  return envRate > 0 ? envRate : DEFAULT_USD_TO_SYP_RATE;
};

export const convertUsdToSyp = (usdAmount, rate = getUsdToSypRate()) => {
  const amount = toNumber(usdAmount);
  return amount > 0 ? Math.ceil(amount * rate) : 0;
};

export const formatSypAmount = (amount) => {
  return `${toNumber(amount).toLocaleString("en-US")} ${SYP_SYMBOL}`;
};
