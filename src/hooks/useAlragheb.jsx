import { useEffect, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAlraghebContent, getAlraghebPricingRules, getAlraghebProduct, getAdminAlraghebProducts, getAlraghebProfile } from "../api/alraghebApi";

const options = {
  staleTime: 60000,
  retry: (count, error) => count < 1 && (!error.status || error.status >= 500),
};

export const useAlraghebContent = (categoryId, params, enabled = true) => useQuery({
  queryKey: ["alragheb", "content", categoryId, params],
  queryFn: ({ signal }) => getAlraghebContent(categoryId, params, { signal }),
  placeholderData: (previous) => String(previous?.data?.category?.id) === String(categoryId) ? previous : undefined,
  ...options,
  enabled,
});

export const useAlraghebProduct = (id, enabled = true) => useQuery({
  queryKey: ["alragheb", "product", id],
  queryFn: ({ signal }) => getAlraghebProduct(id, { signal }),
  ...options,
  enabled,
});

export const useAdminAlraghebProducts = (params) => useQuery({
  queryKey: ["alragheb", "admin-products", params],
  queryFn: ({ signal }) => getAdminAlraghebProducts(params, { signal }),
  placeholderData: keepPreviousData,
  ...options,
});

export const useAlraghebProfile = () => useQuery({
  queryKey: ["alragheb", "profile"],
  queryFn: ({ signal }) => getAlraghebProfile({ signal }),
  ...options,
});

export const useAlraghebPricingRules = () => useQuery({
  queryKey: ["alragheb", "pricing-rules"],
  queryFn: ({ signal }) => getAlraghebPricingRules({ signal }),
  ...options,
});

export const useAlraghebSearch = (value) => {
  const [search, setSearch] = useState(value);
  useEffect(() => {
    const timeout = setTimeout(() => setSearch(value), 300);
    return () => clearTimeout(timeout);
  }, [value]);
  return search;
};
