import axios from "axios";

export const paymentQueryKeys = {
  adminConfirmed: (params) => ["payments", "admin-confirmed", params],
  adminPending: (params) => ["payments", "admin-pending", params],
  adminBalance: (params) => ["payments", "admin-balance", params],
  adminDaen: () => ["payments", "admin-daen"],
  userConfirmed: (params) => ["payments", "user-confirmed", params],
  userPending: () => ["payments", "user-pending"],
  userBalance: (params) => ["payments", "user-balance", params],
  pointConfirmed: (params) => ["payments", "point-confirmed", params],
  pointPayments: (params) => ["payments", "point-payments", params],
  pointStatements: (params) => ["payments", "point-statements", params],
  savedNumbers: (email) => ["payments", "saved-numbers", email],
  productOnline: (name) => ["payments", "product-online", name],
};

export function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

export function getToken() {
  return localStorage.getItem("token");
}

export function getCurrentEmail() {
  return parseJwt(getToken())?.email;
}

export function authConfig(config = {}) {
  const token = getToken();

  return {
    ...config,
    headers: {
      ...config.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
}

export function getApiErrorMessage(error, fallback = "حدث خطأ أثناء تنفيذ العملية.") {
  return error?.response?.data?.message || error?.message || fallback;
}

export function normalizePaginated(payload, fallbackPagination = { total: 0, totalPages: 1 }) {
  return {
    data: Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [],
    pagination: payload?.pagination || fallbackPagination,
  };
}

export async function fetchPaginated(url, params = {}, options = {}) {
  const response = await axios.get(
    url,
    authConfig({
      ...options,
      params,
    }),
  );

  return normalizePaginated(response.data);
}

export async function fetchList(url, options = {}) {
  const response = await axios.get(url, authConfig(options));
  return Array.isArray(response.data) ? response.data : response.data?.data || [];
}
