import axios from "axios";
import { apiUrl } from "../config/api";
import { authConfig } from "./paymentQueries";

export const proWaveReconciliationQueryKeys = {
  report: (params = {}) => ["prowave-reconciliation", "report", params],
};

export const getProWaveReconciliationReport = async (params = {}) => {
  const response = await axios.get(
    apiUrl("/api/admin/prowave/reconciliation"),
    authConfig({ params })
  );

  return response.data?.data;
};

export const runProWaveReconciliation = async (payload = {}) => {
  const response = await axios.post(
    apiUrl("/api/admin/prowave/reconciliation/run"),
    payload,
    authConfig()
  );

  return response.data?.data;
};
