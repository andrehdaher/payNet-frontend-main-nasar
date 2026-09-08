import { useMutation, useQuery } from '@tanstack/react-query';
import {
  getProWaveBalance,
  getProWaveCategories,
  getProWaveItems,
  getProWaveDirectTopUpCatalog,
  checkProWaveAvailability,
  getProWaveCodes,
  getProWaveInvoices,
  purchaseProWaveDigitalCard,
  createProWaveDirectTopUpRequest,
  getProWaveDirectTopUpRequestResult,
} from '../api/prowaveApi';

const extractMessageData = (response) => {
  const payload = response?.source === 'prowave' ? response.data : response;

  if (payload?.message && typeof payload.message === 'object') {
    return payload.message.data || payload.message;
  }

  return payload?.data || payload || [];
};

export const useProWaveBalance = (options = {}) => {
  return useQuery({
    queryKey: ['prowave', 'balance'],
    queryFn: getProWaveBalance,
    staleTime: 30 * 1000,
    ...options,
  });

};

export const useProWaveCategories = (lang = 'ar', options = {}) => {
  return useQuery({
    queryKey: ['prowave', 'categories', lang],
    queryFn: async () => {
      const response = await getProWaveCategories(lang);
      return extractMessageData(response);

    },
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

export const useProWaveItems = (
  {
    item_group = '',
    page_index = 1,
    currency = 'USD',
    ordered_by = 'price',
    sort = 'ASC',
  } = {},
  options = {}
) => {
  return useQuery({
    queryKey: [
      'prowave',
      'items',
      item_group,
      page_index,
      currency,
      ordered_by,
      sort,
    ],
    queryFn: async () => {
      const response = await getProWaveItems({
        item_group,
        page_index,
        currency,
        ordered_by,
        sort,
      });
      return extractMessageData(response);
    },
    staleTime: 2 * 60 * 1000,
    ...options,
  });
};

export const useProWaveAvailability = (item_code, options = {}) => {
  return useQuery({
    queryKey: ['prowave', 'availability', item_code],
    queryFn: () => checkProWaveAvailability(item_code),
    enabled: Boolean(item_code) && (options.enabled ?? true),
    staleTime: 30 * 1000,
    ...options,
  });
};

export const useProWaveDirectTopUpCatalog = (
  { game = '', currency = 'USD' } = {},
  options = {}
) => {
  return useQuery({
    queryKey: ['prowave', 'direct-topup-catalog', game, currency],
    queryFn: async () => {
      const response = await getProWaveDirectTopUpCatalog({
        game,
        currency,
      });
      return extractMessageData(response);
    },
    staleTime: 2 * 60 * 1000,
    ...options,
  });
};

export const useProWaveCodes = (
  { invoice_name, item_code } = {},
  options = {}
) => {
  return useQuery({
    queryKey: ['prowave', 'codes', invoice_name, item_code],
    queryFn: () =>
      getProWaveCodes({
        invoice_name,
        item_code,
      }),
    enabled: Boolean(invoice_name && item_code) && (options.enabled ?? true),
    staleTime: 30 * 1000,
    ...options,
  });
};

export const useProWavePurchase = (options = {}) => {
  return useMutation({
    mutationFn: purchaseProWaveDigitalCard,
    ...options,
  });
};

export const useProWaveDirectTopUpRequest = (options = {}) => {
  return useMutation({
    mutationFn: createProWaveDirectTopUpRequest,
    ...options,
  });
};

export const useProWaveDirectTopUpRequestResult = (options = {}) => {
  return useMutation({
    mutationFn: getProWaveDirectTopUpRequestResult,
    ...options,
  });
};

export const useProWaveInvoices = (
  { limit = 10, offset = 0 } = {},
  options = {}
) => {
  return useQuery({
    queryKey: ['prowave', 'invoices', limit, offset],
    queryFn: () =>
      getProWaveInvoices({
        limit,
        offset,
      }),
    staleTime: 30 * 1000,
    ...options,
  });
};
