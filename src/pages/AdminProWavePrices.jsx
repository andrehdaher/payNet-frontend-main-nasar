import React, { useEffect, useMemo, useState } from "react";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DollarSign, RefreshCw, Search, Tags } from "lucide-react";
import Navbar from "../components/NavbarAdmin";
import Footer from "../components/Footer";
import PageHeader from "../components/Custom/PageHeader";
import DataTable from "../components/Custom/DataTable";
import Alert from "../components/Custom/Alert";
import { Button } from "../components/Custom/Button";
import { Input } from "../components/Custom/Input";
import { useToast } from "../context/ToastContext";
import { getApiErrorMessage } from "../api/paymentQueries";
import {
  getProWavePriceReport,
  proWavePricesQueryKeys,
} from "../api/prowavePricesApi";

const formatSyp = (value) => `${Number(value || 0).toLocaleString("en-US")} ل.س`;
const formatUsd = (value) => `$${Number(value || 0).toLocaleString("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 4,
})}`;
const formatPercent = (value) => `${Number(value || 0).toLocaleString("en-US", {
  maximumFractionDigits: 2,
})}%`;

const availabilityLabels = {
  available: "متوفر",
  unavailable: "غير متوفر",
  unknown: "غير معروف",
};

const availabilityStyles = {
  available: "bg-emerald-100 text-emerald-900 ring-emerald-300",
  unavailable: "bg-red-100 text-red-900 ring-red-300",
  unknown: "bg-slate-100 text-slate-800 ring-slate-300",
};

const sortOptions = [
  { value: "provider_cost_usd", label: "تكلفة ProWave بالدولار" },
  { value: "provider_cost_syp", label: "تكلفة ProWave بالليرة" },
  { value: "sale_price_syp", label: "سعر البيع" },
  { value: "profit_syp", label: "الربح" },
  { value: "provider_discount_usd", label: "خصم ProWave" },
  { value: "item_title", label: "اسم المنتج" },
  { value: "item_group_label", label: "القسم" },
];

const renderAvailability = (status) => (
  <span
    className={`inline-flex items-center justify-center rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${
      availabilityStyles[status] || availabilityStyles.unknown
    }`}
  >
    {availabilityLabels[status] || availabilityLabels.unknown}
  </span>
);

export default function AdminProWavePrices() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [search, setSearch] = useState("");
  const [itemGroup, setItemGroup] = useState("");
  const [availability, setAvailability] = useState("");
  const [sortBy, setSortBy] = useState("provider_cost_usd");
  const [sort, setSort] = useState("asc");

  const queryParams = useMemo(
    () => ({
      page: currentPage,
      limit: itemsPerPage,
      search: search || undefined,
      item_group: itemGroup || undefined,
      availability: availability || undefined,
      sort_by: sortBy,
      sort,
    }),
    [availability, currentPage, itemGroup, itemsPerPage, search, sort, sortBy]
  );

  const pricesQuery = useQuery({
    queryKey: proWavePricesQueryKeys.report(queryParams),
    queryFn: () => getProWavePriceReport(queryParams),
    placeholderData: keepPreviousData,
  });

  const refreshMutation = useMutation({
    mutationFn: () => getProWavePriceReport({ ...queryParams, refresh: true }),
    onSuccess: (data) => {
      queryClient.setQueryData(proWavePricesQueryKeys.report(queryParams), data);
      toast.success("تم تحديث أسعار ProWave من المزوّد");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "تعذر تحديث أسعار ProWave."));
    },
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [availability, itemGroup, search, sort, sortBy]);

  const report = pricesQuery.data;
  const rows = report?.items || [];
  const summary = useMemo(() => report?.summary || {}, [report?.summary]);
  const pagination = report?.pagination || { total: 0, totalPages: 1 };
  const groups = report?.filters?.groups || [];
  const pricing = report?.pricing || {};

  const stats = useMemo(
    () => [
      { label: "عدد المنتجات", value: summary.items_count || 0 },
      { label: "تكلفة ProWave", value: formatUsd(summary.provider_cost_usd) },
      { label: "التكلفة بالليرة", value: summary.formatted_provider_cost_syp || formatSyp(summary.provider_cost_syp) },
      { label: "سعر البيع", value: summary.formatted_sale_price_syp || formatSyp(summary.sale_price_syp) },
      {
        label: "الربح المتوقع",
        value: summary.formatted_profit_syp || formatSyp(summary.profit_syp),
        tone: Number(summary.profit_syp || 0) < 0 ? "danger" : undefined,
      },
      { label: "سعر الصرف", value: pricing.exchange_rate ? formatSyp(pricing.exchange_rate) : "..." },
    ],
    [pricing.exchange_rate, summary]
  );

  const columns = useMemo(
    () => [
      {
        key: "item_code",
        label: "الكود",
        render: (row) => row.item_code || "-",
      },
      {
        key: "item_title",
        label: "المنتج",
        render: (row) => (
          <div className="max-w-xs whitespace-normal text-right">
            <p className="font-bold text-slate-900">{row.item_title || row.item_name || "-"}</p>
            <p className="mt-1 text-xs text-slate-500">{row.item_name || row.item_code}</p>
          </div>
        ),
      },
      {
        key: "item_group_label",
        label: "القسم",
        render: (row) => row.item_group_label || row.item_group || "-",
      },
      {
        key: "provider_cost_usd",
        label: "واقف عليك $",
        render: (row) => <span className="font-bold text-slate-900">{formatUsd(row.provider_cost_usd)}</span>,
      },
      {
        key: "provider_cost_syp",
        label: "واقف عليك ل.س",
        render: (row) => row.formatted_provider_cost_syp || formatSyp(row.provider_cost_syp),
      },
      {
        key: "prowave_sale_price_usd",
        label: "سعر ProWave قبل الخصم",
        render: (row) => formatUsd(row.prowave_sale_price_usd),
      },
      {
        key: "sale_price_syp",
        label: "سعر البيع",
        render: (row) => row.formatted_sale_price_syp || formatSyp(row.sale_price_syp),
      },
      {
        key: "profit_syp",
        label: "الربح",
        render: (row) => (
          <span className={Number(row.profit_syp || 0) < 0 ? "font-bold text-red-700" : "font-bold text-emerald-700"}>
            {row.formatted_profit_syp || formatSyp(row.profit_syp)}
          </span>
        ),
      },
      {
        key: "provider_discount_percent",
        label: "خصم ProWave",
        render: (row) =>
          row.provider_discount_usd
            ? `${formatUsd(row.provider_discount_usd)} (${formatPercent(row.provider_discount_percent)})`
            : "-",
      },
      {
        key: "availability_status",
        label: "الحالة",
        render: (row) => renderAvailability(row.availability_status),
      },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-16" dir="rtl">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <PageHeader
          title="أسعار ProWave الأصلية"
          description="عرض سعر المنتج كما هو واقف عليك من ProWave، مع سعر البيع والربح المتوقع حسب سعر الصرف الحالي."
          stats={stats}
          actions={
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => pricesQuery.refetch()}
                loading={pricesQuery.isFetching && !refreshMutation.isPending}
              >
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
                تحديث
              </Button>
              <Button
                type="button"
                variant="accent"
                onClick={() => refreshMutation.mutate()}
                loading={refreshMutation.isPending}
              >
                <DollarSign className="h-4 w-4" aria-hidden="true" />
                تحديث من ProWave
              </Button>
            </div>
          }
        />

        {pricesQuery.isError && (
          <Alert type="error" className="mb-4">
            {getApiErrorMessage(pricesQuery.error, "تعذر تحميل أسعار ProWave.")}
          </Alert>
        )}

        <section className="mb-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-800">
            <Tags className="h-4 w-4 text-violet-700" aria-hidden="true" />
            فلاتر الأسعار
          </div>

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_220px_170px_220px_150px]">
            <Input
              id="prowave-price-search"
              label="بحث"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="اسم المنتج أو الكود"
            />
            <div className="space-y-1 text-right">
              <label htmlFor="prowave-price-group" className="block text-sm font-semibold text-slate-700">
                القسم
              </label>
              <select
                id="prowave-price-group"
                value={itemGroup}
                onChange={(event) => setItemGroup(event.target.value)}
                className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-slate-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500"
              >
                <option value="">كل الأقسام</option>
                {groups.map((group) => (
                  <option key={group.value} value={group.value}>
                    {group.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1 text-right">
              <label htmlFor="prowave-price-availability" className="block text-sm font-semibold text-slate-700">
                التوفر
              </label>
              <select
                id="prowave-price-availability"
                value={availability}
                onChange={(event) => setAvailability(event.target.value)}
                className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-slate-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500"
              >
                <option value="">كل الحالات</option>
                <option value="available">متوفر</option>
                <option value="unavailable">غير متوفر</option>
                <option value="unknown">غير معروف</option>
              </select>
            </div>
            <div className="space-y-1 text-right">
              <label htmlFor="prowave-price-sort-by" className="block text-sm font-semibold text-slate-700">
                الترتيب حسب
              </label>
              <select
                id="prowave-price-sort-by"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-slate-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1 text-right">
              <label htmlFor="prowave-price-sort" className="block text-sm font-semibold text-slate-700">
                الاتجاه
              </label>
              <select
                id="prowave-price-sort"
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-slate-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500"
              >
                <option value="asc">تصاعدي</option>
                <option value="desc">تنازلي</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-md bg-slate-50 px-3 py-2">
            <p className="text-sm font-semibold text-slate-700">
              الهامش الحالي {formatPercent(pricing.margin_percent)}، التقريب {formatSyp(pricing.rounding_step || 1)}
            </p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearch("");
                setItemGroup("");
                setAvailability("");
                setSortBy("provider_cost_usd");
                setSort("asc");
              }}
            >
              <Search className="h-4 w-4" aria-hidden="true" />
              مسح الفلاتر
            </Button>
          </div>
        </section>

        <DataTable
          columns={columns}
          data={rows}
          currentPage={currentPage}
          totalPages={pagination.totalPages}
          onPageChange={setCurrentPage}
          pageSize={itemsPerPage}
          onPageSizeChange={(size) => {
            setItemsPerPage(size);
            setCurrentPage(1);
          }}
          loading={pricesQuery.isLoading}
          updating={pricesQuery.isFetching && !pricesQuery.isLoading}
          emptyTitle="لا توجد أسعار ProWave"
          emptyDescription="غيّر الفلاتر أو حدّث البيانات من ProWave."
        />
      </main>
      <Footer />
    </div>
  );
}
