import axios from "axios";
import { apiUrl } from "../config/api";

const alesoApi = axios.create({
  baseURL: apiUrl("/api/aleso"),
  timeout: 30000,
});

alesoApi.interceptors.request.use((config) => {
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
  if (Array.isArray(parsed)) return parsed.map(getMessageFromValue).find(Boolean) || "";

  if (typeof parsed === "object") {
    return (
      getMessageFromValue(parsed.message) ||
      getMessageFromValue(parsed.error) ||
      getMessageFromValue(parsed.description) ||
      ""
    );
  }

  return String(parsed);
};

const getErrorMessage = (error, fallback) => {
  const data = error?.response?.data;

  return (
    getMessageFromValue(data?.message) ||
    getMessageFromValue(data?.error) ||
    getMessageFromValue(data?.details) ||
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

export const getAlesoProducts = async ({
  section = "",
  category_name = "",
  products_id = "",
  available = "",
  search = "",
} = {}) => {
  try {
    const response = await alesoApi.get("/products", {
      params: {
        section,
        category_name,
        products_id,
        available,
        search,
      },
    });

    return response.data;
  } catch (error) {
    throwApiError(error, "Failed to fetch Aleso products");
  }
};

export const getAlesoContent = async ({ categoryId = 0, section = "" } = {}) => {
  try {
    const response = await alesoApi.get(`/content/${categoryId}`, {
      params: { section },
    });

    return response.data;
  } catch (error) {
    throwApiError(error, "Failed to fetch Aleso content");
  }
};

export const createAlesoQuote = async (payload = {}) => {
  if (!payload.product_id && !payload.productId) {
    throw new Error("product_id is required");
  }

  try {
    const response = await alesoApi.post("/quote", payload);
    return response.data;
  } catch (error) {
    throwApiError(error, "Failed to create Aleso quote");
  }
};

export const purchaseAlesoProduct = async (payload = {}) => {
  if (!payload.product_id && !payload.productId) {
    throw new Error("product_id is required");
  }

  try {
    const response = await alesoApi.post("/order", payload);
    return response.data;
  } catch (error) {
    throwApiError(error, "Failed to purchase Aleso product");
  }
};

export const checkAlesoOrders = async (payload = {}) => {
  if (!payload.orders) {
    throw new Error("orders is required");
  }

  try {
    const response = await alesoApi.post("/check-orders", payload);
    return response.data;
  } catch (error) {
    throwApiError(error, "Failed to check Aleso orders");
  }
};
