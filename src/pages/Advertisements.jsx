import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import ScreenWrapper from "../components/ScreenWrapper";
import CardProduct from "../components/CardProduct";
import PageHeader from "../components/Custom/PageHeader";
import EmptyState from "../components/Custom/EmptyState";
import Alert from "../components/Custom/Alert";
import { Input } from "../components/Custom/Input";
import { Button } from "../components/Custom/Button";
import { authConfig, getApiErrorMessage } from "../api/paymentQueries";
import { apiUrl } from "../config/api";

const PAGE_SIZE_OPTIONS = [8, 12, 16, 24, 32];
const DEFAULT_PAGINATION = { page: 1, limit: 12, total: 0, totalPages: 1 };

function useDebouncedValue(value, delay = 350) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedValue(value), delay);
    return () => window.clearTimeout(timeout);
  }, [value, delay]);

  return debouncedValue;
}

function productQueryKey(params) {
  return ["products", "advertisements", params];
}

function normalizeProductResponse(payload, page, limit) {
  if (Array.isArray(payload)) {
    const total = payload.length;
    const totalPages = Math.max(Math.ceil(total / limit), 1);
    const start = (page - 1) * limit;

    return {
      data: payload.slice(start, start + limit),
      pagination: { page, limit, total, totalPages },
    };
  }

  const data = Array.isArray(payload?.data)
    ? payload.data
    : Array.isArray(payload?.products)
      ? payload.products
      : [];
  const total = Number(payload?.pagination?.total ?? data.length);
  const totalPages = Number(payload?.pagination?.totalPages ?? Math.max(Math.ceil(total / limit), 1));

  return {
    data,
    pagination: {
      page: Number(payload?.pagination?.page ?? page),
      limit: Number(payload?.pagination?.limit ?? limit),
      total,
      totalPages: Math.max(totalPages, 1),
    },
  };
}

async function fetchProducts(params) {
  const search = params.search?.trim();
  const endpoint = search ? "/api/product/search-product" : "/api/product/get-product";
  const response = await axios.get(
    apiUrl(endpoint),
    authConfig({
      params: {
        page: params.page,
        limit: params.limit,
        ...(search ? { name: search } : {}),
      },
    }),
  );

  return normalizeProductResponse(response.data, params.page, params.limit);
}

function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" role="status" aria-label="جاري تحميل المنتجات">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="aspect-[4/3] animate-pulse bg-slate-200" />
          <div className="space-y-3 p-5">
            <div className="h-5 w-3/4 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
            <div className="h-4 w-4/5 animate-pulse rounded bg-slate-100" />
            <div className="flex items-center justify-between pt-3">
              <div className="h-6 w-20 animate-pulse rounded bg-slate-200" />
              <div className="h-9 w-24 animate-pulse rounded bg-slate-200" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function getVisiblePages(currentPage, totalPages) {
  const boundedCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);
  const visiblePages = [1, boundedCurrentPage - 1, boundedCurrentPage, boundedCurrentPage + 1, totalPages]
    .filter((page) => page >= 1 && page <= totalPages)
    .filter((page, index, pages) => pages.indexOf(page) === index)
    .sort((first, second) => first - second);

  return visiblePages.reduce((pages, page) => {
    const previousPage = pages[pages.length - 1];

    if (typeof previousPage === "number" && page - previousPage > 1) {
      pages.push("...");
    }

    pages.push(page);
    return pages;
  }, []);
}

function ProductPagination({ currentPage, totalPages, total, pageSize, loading, onPageChange }) {
  if (totalPages <= 1 && total <= pageSize) {
    return null;
  }

  const pages = getVisiblePages(currentPage, totalPages);
  const firstItem = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const lastItem = Math.min(currentPage * pageSize, total);

  return (
    <div className="mt-6 flex flex-col gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <p className="text-center text-sm font-medium text-slate-700 sm:text-right" aria-live="polite">
        عرض {firstItem} - {lastItem} من {total} منتج
      </p>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={currentPage === 1 || loading}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="الصفحة السابقة"
        >
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">السابق</span>
        </Button>

        {pages.map((page, index) =>
          page === "..." ? (
            <span key={`ellipsis-${index}`} className="px-1 text-sm font-semibold text-slate-400" aria-hidden="true">
              ...
            </span>
          ) : (
            <Button
              key={page}
              type="button"
              variant={page === currentPage ? "default" : "outline"}
              size="sm"
              disabled={loading || page === currentPage}
              onClick={() => onPageChange(page)}
              className="min-w-9 px-3"
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page}
            </Button>
          ),
        )}

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages || loading}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="الصفحة التالية"
        >
          <span className="hidden sm:inline">التالي</span>
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}

export default function Advertisements() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const debouncedSearch = useDebouncedValue(searchTerm).trim();

  const queryParams = useMemo(
    () => ({
      page: currentPage,
      limit: itemsPerPage,
      search: debouncedSearch,
    }),
    [currentPage, itemsPerPage, debouncedSearch],
  );

  const productsQuery = useQuery({
    queryKey: productQueryKey(queryParams),
    queryFn: () => fetchProducts(queryParams),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });

  const products = productsQuery.data?.data || [];
  const pagination = productsQuery.data?.pagination || {
    ...DEFAULT_PAGINATION,
    page: currentPage,
    limit: itemsPerPage,
  };
  const totalPages = pagination.totalPages || 1;
  const isInitialLoading = productsQuery.isLoading;
  const isUpdating = productsQuery.isFetching && !productsQuery.isLoading;

  useEffect(() => {
    if (!productsQuery.isError && currentPage < totalPages) {
      const nextParams = { ...queryParams, page: currentPage + 1 };

      queryClient.prefetchQuery({
        queryKey: productQueryKey(nextParams),
        queryFn: () => fetchProducts(nextParams),
        staleTime: 30_000,
      });
    }
  }, [currentPage, productsQuery.isError, queryClient, queryParams, totalPages]);

  useEffect(() => {
    if (!productsQuery.isLoading && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, productsQuery.isLoading, totalPages]);

  const handleWhatsappOrder = (productName) => {
    const phoneNumber = "963993822320";
    const message = `مرحباً، أرغب في طلب المنتج: ${productName}`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <ScreenWrapper>
      <PageHeader
        title="البضائع"
        description="ابحث عن المنتجات المتاحة واطلبها مباشرة عبر واتساب."
        stats={[
          { label: "إجمالي المنتجات", value: pagination.total },
          { label: "في هذه الصفحة", value: products.length },
        ]}
      />

      {productsQuery.isError && (
        <Alert type="error" className="mb-4">
          {getApiErrorMessage(productsQuery.error, "تعذر تحميل المنتجات. حاول مرة أخرى بعد قليل.")}
        </Alert>
      )}

      <div className="mb-5 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_220px]">
          <div className="relative">
            <Input
              id="product-search"
              type="text"
              label="البحث"
              placeholder="ابحث باسم المنتج أو الوصف أو الفئة..."
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setCurrentPage(1);
              }}
              className="pl-12 pr-10"
            />
            <Search className="pointer-events-none absolute bottom-3 right-3 h-5 w-5 text-slate-400" aria-hidden="true" />
            {searchTerm && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute bottom-1 left-1 h-9 w-9"
                onClick={() => {
                  setSearchTerm("");
                  setCurrentPage(1);
                }}
                aria-label="مسح البحث"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </Button>
            )}
          </div>

          <div className="space-y-1 text-right">
            <label htmlFor="products-page-size" className="block text-sm font-semibold text-slate-700">
              عدد المنتجات
            </label>
            <select
              id="products-page-size"
              className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-slate-900 outline-none transition-colors focus:border-violet-500 focus:ring-2 focus:ring-violet-500"
              value={itemsPerPage}
              disabled={isUpdating}
              onChange={(event) => {
                setItemsPerPage(Number(event.target.value));
                setCurrentPage(1);
              }}
            >
              {PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size} في الصفحة
                </option>
              ))}
            </select>
          </div>
        </div>

        {isUpdating && (
          <div className="mt-4 h-1 overflow-hidden rounded-full bg-violet-100" role="status" aria-label="جاري تحديث المنتجات">
            <div className="h-full w-1/3 animate-pulse rounded-full bg-violet-600" />
          </div>
        )}
      </div>

      {isInitialLoading ? (
        <ProductGridSkeleton count={Math.min(itemsPerPage, 12)} />
      ) : products.length === 0 ? (
        <EmptyState title="لا توجد منتجات" description="غيّر البحث أو تحقق لاحقاً عند إضافة منتجات جديدة." />
      ) : (
        <>
          <div
            className={`grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${isUpdating ? "opacity-75" : ""
              }`}
            aria-busy={isUpdating}
          >
            {products.map((product, index) => (
              <CardProduct
                key={product._id || product.id || `${product.name}-${currentPage}-${index}`}
                title={product.name}
                description={product.description}
                image={product.imageUrl}
                price={product.price}
                priority={index < 4}
                action={() => handleWhatsappOrder(product.name)}
                textButton="اطلب الآن"
              />
            ))}
          </div>

          <ProductPagination
            currentPage={currentPage}
            totalPages={totalPages}
            total={pagination.total}
            pageSize={itemsPerPage}
            loading={isUpdating}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </ScreenWrapper>
  );
}
