import axios from "axios";
import { apiUrl } from "../config/api";
import { authConfig } from "./paymentQueries";

export const proWavePricesQueryKeys = {
  report: (params = {}) => ["prowave-prices", "report", params],
};

export const getProWavePriceReport = async (params = {}) => {
  const response = await axios.get(
    apiUrl("/api/admin/prowave/prices"),
    authConfig({ params })
  );

  return response.data?.data;
};
