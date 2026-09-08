import React, { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RefreshCw, Save } from "lucide-react";
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
  exchangeRateQueryKeys,
  getProviderExchangeRate,
  getProviderExchangeRateHistory,
  updateProviderExchangeRate,
} from "../api/exchangeRateApi";
import { ENABLE_ALESO_PRODUCTS } from "../config/features";

const PROVIDER_OPTIONS = [
  { value: "prowave", label: "ProWave", productsQueryKey: ["prowave", "items"] },
  ...(ENABLE_ALESO_PRODUCTS
    ? [{ value: "aleso", label: "Aleso", productsQueryKey: ["aleso", "products"] }]
    : []),
];

const formatSyp = (value) => `${Number(value || 0).toLocaleString("en-US")} ل.س`;

const roundUpToStep = (amount, step = 1) => {
  const normalizedStep = Number.isInteger(Number(step)) && Number(step) > 0 ? Number(step) : 1;
  return Math.ceil(Number(amount || 0) / normalizedStep) * normalizedStep;
};

const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleString("ar-SY", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

export default function AdminExchangeRate() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [provider, setProvider] = useState("prowave");
  const [rate, setRate] = useState("");
  const [marginPercent, setMarginPercent] = useState("0");
  const [roundingStep, setRoundingStep] = useState("1");
  const [note, setNote] = useState("");
  const [formError, setFormError] = useState("");
  const providerOption =
    PROVIDER_OPTIONS.find((option) => option.value === provider) || PROVIDER_OPTIONS[0];

  const exchangeRateQuery = useQuery({
    queryKey: exchangeRateQueryKeys.provider(provider),
    queryFn: () => getProviderExchangeRate(provider),
  });

  const historyQuery = useQuery({
    queryKey: exchangeRateQueryKeys.providerHistory(provider, { limit: 20 }),
    queryFn: () => getProviderExchangeRateHistory(provider, { limit: 20 }),
  });

  useEffect(() => {
    const data = exchangeRateQuery.data;
    if (!data) return;

    setRate(String(data.rate ?? ""));
    setMarginPercent(String(data.marginPercent ?? 0));
    setRoundingStep(String(data.roundingStep ?? 1));
  }, [exchangeRateQuery.data]);

  const updateMutation = useMutation({
    mutationFn: (payload) => updateProviderExchangeRate({ provider, ...payload }),
    onSuccess: () => {
      toast.success(`تم تحديث سعر صرف ${providerOption.label}`);
      setNote("");
      queryClient.invalidateQueries({ queryKey: exchangeRateQueryKeys.provider(provider) });
      queryClient.invalidateQueries({
        queryKey: exchangeRateQueryKeys.providerHistory(provider, { limit: 20 }),
      });
      queryClient.invalidateQueries({ queryKey: providerOption.productsQueryKey });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "تعذر تحديث سعر الصرف"));
    },
  });

  const stats = useMemo(() => {
    const data = exchangeRateQuery.data;
    return [
      { label: "المزوّد", value: providerOption.label },
      { label: "سعر الدولار", value: data ? formatSyp(data.rate) : "..." },
      { label: "الهامش", value: data ? `${data.marginPercent || 0}%` : "..." },
      { label: "التقريب", value: data ? formatSyp(data.roundingStep || 1) : "..." },
      { label: "آخر تعديل", value: data ? formatDate(data.updatedAt) : "..." },
    ];
  }, [exchangeRateQuery.data, providerOption.label]);

  const historyColumns = useMemo(
    () => [
      {
        key: "createdAt",
        label: "التاريخ",
        render: (row) => formatDate(row.createdAt),
      },
      {
        key: "previousRate",
        label: "السعر السابق",
        render: (row) => formatSyp(row.previousRate),
      },
      {
        key: "newRate",
        label: "السعر الجديد",
        render: (row) => formatSyp(row.newRate),
      },
      {
        key: "margin",
        label: "الهامش",
        render: (row) => `${row.previousMarginPercent || 0}% -> ${row.newMarginPercent || 0}%`,
      },
      {
        key: "rounding",
        label: "التقريب",
        render: (row) => `${formatSyp(row.previousRoundingStep || 1)} -> ${formatSyp(row.newRoundingStep || 1)}`,
      },
      {
        key: "changedBy",
        label: "الأدمن",
        render: (row) => row.changedBy?.email || row.changedBy?.name || "-",
      },
      { key: "note", label: "ملاحظة", render: (row) => row.note || "-" },
    ],
    [],
  );

  const previewPrice = roundUpToStep(
    Number(rate || 0) * (1 + Number(marginPercent || 0) / 100),
    roundingStep,
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    setFormError("");

    const numericRate = Number(rate);
    const numericMarginPercent = Number(marginPercent || 0);
    const numericRoundingStep = Number(roundingStep || 1);

    if (!Number.isFinite(numericRate) || numericRate <= 0) {
      setFormError("سعر الصرف يجب أن يكون رقما أكبر من صفر.");
      return;
    }

    if (!Number.isFinite(numericMarginPercent) || numericMarginPercent < 0) {
      setFormError("الهامش يجب ألا يكون رقما سالبا.");
      return;
    }

    if (!Number.isInteger(numericRoundingStep) || numericRoundingStep <= 0) {
      setFormError("قيمة التقريب يجب أن تكون رقما صحيحا أكبر من صفر.");
      return;
    }

    updateMutation.mutate({
      rate: numericRate,
      marginPercent: numericMarginPercent,
      roundingStep: numericRoundingStep,
      note,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-16" dir="rtl">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <PageHeader
          title={`سعر صرف ${providerOption.label}`}
          description="إدارة تسعير منتجات المزود بالدولار مقابل الليرة السورية."
          stats={stats}
          actions={
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={provider}
                onChange={(event) => {
                  setProvider(event.target.value);
                  setFormError("");
                  setNote("");
                }}
                className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-900 outline-none transition-colors focus:border-violet-500 focus:ring-2 focus:ring-violet-500"
                aria-label="اختيار المزود"
              >
                {PROVIDER_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  exchangeRateQuery.refetch();
                  historyQuery.refetch();
                }}
                loading={exchangeRateQuery.isFetching || historyQuery.isFetching}
              >
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
                تحديث
              </Button>
            </div>
          }
        />

        {(formError || exchangeRateQuery.isError) && (
          <Alert type="error" className="mb-4">
            {formError ||
              getApiErrorMessage(exchangeRateQuery.error, "تعذر تحميل سعر الصرف.")}
          </Alert>
        )}

        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
        >
          <div className="grid gap-4 md:grid-cols-3">
            <Input
              id={`${provider}-exchange-rate`}
              label="سعر الدولار بالليرة"
              type="number"
              min="1"
              step="0.01"
              value={rate}
              onChange={(event) => setRate(event.target.value)}
              required
            />
            <Input
              id={`${provider}-margin-percent`}
              label="هامش الربح (%)"
              type="number"
              min="0"
              step="0.01"
              value={marginPercent}
              onChange={(event) => setMarginPercent(event.target.value)}
            />
            <Input
              id={`${provider}-rounding-step`}
              label="تقريب السعر لأعلى"
              type="number"
              min="1"
              step="1"
              value={roundingStep}
              onChange={(event) => setRoundingStep(event.target.value)}
            />
          </div>

          <div className="mt-4 space-y-1 text-right">
            <label htmlFor={`${provider}-rate-note`} className="block text-sm font-semibold text-slate-700">
              ملاحظة
            </label>
            <textarea
              id={`${provider}-rate-note`}
              rows={3}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-right text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500"
              placeholder="مثال: تحديث سعر السوق الصباحي"
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-semibold text-slate-700">
              السعر المتوقع لكل 1$: {formatSyp(previewPrice)}
            </p>
            <Button type="submit" loading={updateMutation.isPending}>
              <Save className="h-4 w-4" aria-hidden="true" />
              حفظ السعر
            </Button>
          </div>
        </form>

        {historyQuery.isError && (
          <Alert type="error" className="my-4">
            {getApiErrorMessage(historyQuery.error, "تعذر تحميل سجل التعديلات.")}
          </Alert>
        )}

        <section className="mt-6">
          <h2 className="mb-3 text-lg font-bold text-slate-900">
            سجل تعديلات {providerOption.label}
          </h2>
          <DataTable
            columns={historyColumns}
            data={historyQuery.data || []}
            loading={historyQuery.isLoading}
            updating={historyQuery.isFetching && !historyQuery.isLoading}
            emptyTitle="لا توجد تعديلات بعد"
            emptyDescription="سيظهر أول تعديل لسعر الصرف هنا."
            currentPage={1}
            totalPages={1}
            pageSize={20}
          />
        </section>
      </main>
      <Footer />
    </div>
  );
}
