import axios from "axios";
import { apiUrl } from "../config/api";

const PROWAVE_PURCHASE_PATH =
  process.env.REACT_APP_PROWAVE_PURCHASE_PATH || "/purchase-digital-card";

const normalizePath = (path) => (path.startsWith("/") ? path : `/${path}`);

const prowaveApi = axios.create({
  baseURL: apiUrl("/api/prowave"),
  timeout: 30000,
});

// إذا كان عندك JWT في المشروع
prowaveApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const parseMaybeJson = (value) => {
  if (typeof value !== "string") return value;

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

const getMessageFromValue = (value) => {
  const parsed = parseMaybeJson(value);

  if (!parsed) return "";
  if (typeof parsed === "string") return parsed;
  if (Array.isArray(parsed)) {
    return parsed.map(getMessageFromValue).find(Boolean) || "";
  }

  if (typeof parsed === "object") {
    return (
      getMessageFromValue(parsed.message) ||
      getMessageFromValue(parsed.error) ||
      getMessageFromValue(parsed.description) ||
      getMessageFromValue(parsed.exception) ||
      getMessageFromValue(parsed._server_messages) ||
      getMessageFromValue(parsed.exc_type) ||
      ""
    );
  }

  return String(parsed);
};

const getErrorMessage = (error, fallback) => {
  const data = error?.response?.data;

  return (
    getMessageFromValue(data?.error) ||
    getMessageFromValue(data?.details) ||
    getMessageFromValue(data?.message) ||
    getMessageFromValue(error?.message) ||
    fallback
  );
};

const throwApiError = (error, fallback) => {
  const enhancedError = new Error(getErrorMessage(error, fallback));
  enhancedError.response = error?.response;
  enhancedError.originalError = error;
  throw enhancedError;
};

export const getProWaveBalance = async () => {
  try {
    const response = await prowaveApi.get("/balance");
    console.log('Provider Balance Response:', response.data.data.message?.data);
    return response.data;
  } catch (error) {
    throwApiError(error, "Failed to fetch provider balance");
  }
};

export const getProWaveCategories = async (lang = "ar") => {
  try {
    const response = await prowaveApi.get("/categories", {
      params: { lang },
    });

    return response.data;
  } catch (error) {
    throwApiError(error, "Failed to fetch provider categories");
  }
};

export const getProWaveItems = async ({
  item_group = "",
  page_index = 1,
  currency = "USD",
  ordered_by = "price",
  sort = "ASC",
} = {}) => {
  try {
    const response = await prowaveApi.get("/items", {
      params: {
        item_group,
        page_index,
        currency,
        ordered_by,
        sort,
      },
    });

    return response.data;
  } catch (error) {
    throwApiError(error, "Failed to fetch provider items");
  }
};

export const getProWaveDirectTopUpCatalog = async ({
  game = "",
  currency = "USD",
} = {}) => {
  try {
    const response = await prowaveApi.get("/direct-topup/catalog", {
      params: {
        game,
        currency,
      },
    });

    return response.data;
  } catch (error) {
    throwApiError(error, "Failed to fetch provider direct top-up catalog");
  }
};

export const checkProWaveAvailability = async (item_code) => {
  if (!item_code) {
    throw new Error("item_code is required");
  }

  try {
    const response = await prowaveApi.get("/check-availability", {
      params: { item_code },
    });

    return response.data;
  } catch (error) {
    throwApiError(error, "Failed to check item availability");
  }
};

export const createProWaveQuote = async (payload = {}) => {
  if (!payload.item_code) {
    throw new Error("item_code is required");
  }

  try {
    const response = await prowaveApi.post("/quote", payload);

    return response.data;
  } catch (error) {
    throwApiError(error, "Failed to create provider price quote");
  }
};

export const getProWaveCodes = async ({ invoice_name, item_code }) => {
  if (!invoice_name || !item_code) {
    throw new Error("invoice_name and item_code are required");
  }

  try {
    const response = await prowaveApi.get("/codes", {
      params: {
        invoice_name,
        item_code,
      },
    });

    return response.data;
  } catch (error) {
    throwApiError(error, "Failed to fetch provider codes");
  }
};

export const purchaseProWaveDigitalCard = async (payload = {}) => {
  if (!payload.item_code) {
    throw new Error("item_code is required");
  }

  try {
    const response = await prowaveApi.post(
      normalizePath(PROWAVE_PURCHASE_PATH),
      payload
    );

    return response.data;
  } catch (error) {
    throwApiError(error, "Failed to purchase provider digital card");
  }
};

export const createProWaveDirectTopUpRequest = async (payload = {}) => {
  if (!payload.game || !payload.player_id || !payload.item_code) {
    throw new Error("game, player_id and item_code are required");
  }

  try {
    const requestPayload = { ...payload };

    delete requestPayload.recharge_category;
    delete requestPayload.rechargeCategory;

    const response = await prowaveApi.post("/direct-topup/request", requestPayload);

    return response.data;
  } catch (error) {
    throwApiError(error, "Failed to create provider direct top-up request");
  }
};

export const getProWaveDirectTopUpRequestResult = async ({ name }) => {
  if (!name) {
    throw new Error("name is required");
  }

  try {
    const response = await prowaveApi.post("/direct-topup/request-result", {
      name,
    });

    return response.data;
  } catch (error) {
    throwApiError(error, "Failed to fetch provider direct top-up request result");
  }
};

export const getProWaveInvoices = async ({ limit = 10, offset = 0 } = {}) => {
  try {
    const response = await prowaveApi.get("/invoices", {
      params: {
        limit,
        offset,
      },
    });

    return response.data;
  } catch (error) {
    throwApiError(error, "Failed to fetch provider invoices");
  }
};
