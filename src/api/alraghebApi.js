import axios from "axios";
import { apiUrl } from "../config/api";

const alraghebApi = axios.create({
  baseURL: apiUrl("/api"),
  timeout: 90000,
});

alraghebApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const request = async (path, { signal, params, data, method = "get" } = {}) => {
  try {
    const response = await alraghebApi.request({ url: path, method, params, data, signal });
    if (response.data?.success !== true || response.data?.source !== "alragheb") {
      throw new Error("استجابة كتالوج التطبيقات غير صالحة");
    }
    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) throw error;
    const message = error.response?.data?.message;
    const safeError = new Error(typeof message === "string" ? message : "تعذر تحميل تطبيقات الدردشة");
    safeError.status = error.response?.status;
    safeError.code = error.response?.data?.code;
    throw safeError;
  }
};

export const getAlraghebProfile = (options) => request("/alragheb/profile", options);
export const getAlraghebProducts = (params = {}, options = {}) => request("/alragheb/products", { ...options, params });
export const getAlraghebContent = (categoryId = 1, params = {}, options = {}) =>
  request(`/alragheb/content/${encodeURIComponent(categoryId)}`, { ...options, params });
export const getAlraghebProduct = (id, options) => request(`/alragheb/products/${encodeURIComponent(id)}`, options);
export const getAdminAlraghebProducts = (params = {}, options = {}) => request("/admin/alragheb/products", { ...options, params });
export const refreshAlraghebCatalog = () => request("/admin/alragheb/catalog/refresh", { method: "post" });
export const quoteAlragheb = (data) => request("/alragheb/quote", { method: "post", data });
export const orderAlragheb = (data) => request("/alragheb/order", { method: "post", data });
export const getAlraghebOrders = (params, admin = false) => request(admin ? "/admin/alragheb/transactions" : "/alragheb/orders", { params });
export const getAlraghebOrder = (id) => request(`/alragheb/orders/${encodeURIComponent(id)}`);
export const checkAlraghebOrder = (id) => request(`/admin/alragheb/transactions/${encodeURIComponent(id)}/check`, { method: "post" });
export const saveAlraghebConfig = ({ id, ...data }) => request(`/admin/alragheb/products/${encodeURIComponent(id)}`, { method: "patch", data });
export const getAlraghebConfigHistory = (id) => request(`/admin/alragheb/products/${encodeURIComponent(id)}/history`);
export const getAlraghebSummary = () => request('/admin/alragheb/summary');
export const getAlraghebPricingRules = (options) => request('/admin/alragheb/pricing/rules', options);
export const saveAlraghebPricingRule = ({ categoryId, ...data }) => request(`/admin/alragheb/pricing/rules/${encodeURIComponent(categoryId)}`, { method: 'put', data });
export const previewAlraghebMarkup = (data) => request('/admin/alragheb/pricing/preview', { method: 'post', data });
export const applyAlraghebMarkup = (data) => request('/admin/alragheb/pricing/apply', { method: 'post', data });

export default alraghebApi;
