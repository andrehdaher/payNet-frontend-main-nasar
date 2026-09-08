const enabledValues = new Set(["1", "true", "yes", "on"]);

const readBooleanFlag = (value, defaultValue = false) => {
  if (value === undefined || value === null || value === "") {
    return defaultValue;
  }

  return enabledValues.has(String(value).trim().toLowerCase());
};

export const ENABLE_ALESO_PRODUCTS = readBooleanFlag(
  process.env.REACT_APP_ENABLE_ALESO_PRODUCTS,
  false
);
