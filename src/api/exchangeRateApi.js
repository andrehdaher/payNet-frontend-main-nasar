import axios from "axios";
import { apiUrl } from "../config/api";
import { authConfig } from "./paymentQueries";

const normalizeProvider = (provider = "prowave") =>
  String(provider || "prowave").trim().toLowerCase();

export const exchangeRateQueryKeys = {
  provider: (provider = "prowave") => ["exchange-rate", normalizeProvider(provider)],
  providerHistory: (provider = "prowave", params = {}) => [
    "exchange-rate",
    normalizeProvider(provider),
    "history",
    params,
  ],
  proWave: () => ["exchange-rate", "prowave"],
  proWaveHistory: (params = {}) => ["exchange-rate", "prowave", "history", params],
  aleso: () => ["exchange-rate", "aleso"],
  alesoHistory: (params = {}) => ["exchange-rate", "aleso", "history", params],
};

export const getProviderExchangeRate = async (provider = "prowave") => {
  const response = await axios.get(
    apiUrl(`/api/admin/exchange-rate/${normalizeProvider(provider)}`),
    authConfig(),
  );

  return response.data?.data;
};

export const updateProviderExchangeRate = async ({ provider = "prowave", ...payload }) => {
  const response = await axios.put(
    apiUrl(`/api/admin/exchange-rate/${normalizeProvider(provider)}`),
    payload,
    authConfig(),
  );

  return response.data?.data;
};

export const getProviderExchangeRateHistory = async (
  provider = "prowave",
  { limit = 20 } = {},
) => {
  const response = await axios.get(
    apiUrl(`/api/admin/exchange-rate/${normalizeProvider(provider)}/history`),
    authConfig({ params: { limit } }),
  );

  return response.data?.data || [];
};

export const getProWaveExchangeRate = () => getProviderExchangeRate("prowave");

export const updateProWaveExchangeRate = (payload) =>
  updateProviderExchangeRate({ provider: "prowave", ...payload });

export const getProWaveExchangeRateHistory = ({ limit = 20 } = {}) =>
  getProviderExchangeRateHistory("prowave", { limit });

export const getAlesoExchangeRate = () => getProviderExchangeRate("aleso");

export const updateAlesoExchangeRate = (payload) =>
  updateProviderExchangeRate({ provider: "aleso", ...payload });

export const getAlesoExchangeRateHistory = ({ limit = 20 } = {}) =>
  getProviderExchangeRateHistory("aleso", { limit });
