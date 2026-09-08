import { useQuery } from "@tanstack/react-query";
import { getAlesoContent, getAlesoProducts } from "../api/alesoApi";

const unwrapAlesoData = (response) =>
  response?.source === "aleso" ? response.data : response?.data || response;

export const useAlesoProducts = (
  { section = "", category_name = "", products_id = "", available = "", search = "" } = {},
  options = {},
) =>
  useQuery({
    queryKey: ["aleso", "products", { section, category_name, products_id, available, search }],
    queryFn: async () => unwrapAlesoData(
      await getAlesoProducts({ section, category_name, products_id, available, search }),
    ),
    staleTime: 60 * 1000,
    ...options,
  });

export const useAlesoContent = (
  { categoryId = 0, section = "" } = {},
  options = {},
) =>
  useQuery({
    queryKey: ["aleso", "content", { categoryId, section }],
    queryFn: async () => unwrapAlesoData(await getAlesoContent({ categoryId, section })),
    staleTime: 60 * 1000,
    ...options,
  });
