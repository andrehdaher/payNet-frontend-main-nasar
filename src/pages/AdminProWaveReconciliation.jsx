import React, { useEffect, useMemo, useState } from "react";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RefreshCw, Search, ShieldCheck } from "lucide-react";
import Navbar from "../components/NavbarAdmin";
import Footer from "../components/Footer";
import PageHeader from "../components/Custom/PageHeader";
import DataTable from "../components/Custom/DataTable";
import StatusBadge from "../components/Custom/StatusBadge";
import Alert from "../components/Custom/Alert";
import { Button } from "../components/Custom/Button";
import { Input } from "../components/Custom/Input";
import { useToast } from "../context/ToastContext";
import { getApiErrorMessage } from "../api/paymentQueries";
import {
  getProWaveReconciliationReport,
  proWaveReconciliationQueryKeys,
  runProWaveReconciliation,
} from "../api/prowaveReconciliationApi";

const formatSyp = (value) => `${Number(value || 0).toLocaleString("en-US")} ل.س`;
const formatUsd = (value) => `$${Number(value || 0).toLocaleString("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 4,
})}`;

const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleString("ar-SY", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const statusLabel = {
  pending: "قيد المتابعة",
  completed: "مطابقة",
  mismatch: "فرق",
  failed: "فاشلة",
  refunded: "مرجعة",
};

export default function AdminProWaveReconciliation() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [status, setStatus] = useState("");
  const [date, setDate] = useState("");
  const [search, setSearch] = useState("");

  const queryParams = useMemo(
    () => ({
      page: currentPage,
      limit: itemsPerPage,
      status: status || undefined,
      date: date || undefined,
      search: search || undefined,
    }),
    [currentPage, itemsPerPage, status, date, search]
  );

  const reportQuery = useQuery({
    queryKey: proWaveReconciliationQueryKeys.report(queryParams),
    queryFn: () => getProWaveReconciliationReport(queryParams),
    placeholderData: keepPreviousData,
  });

  const runMutation = useMutation({
    mutationFn: () => runProWaveReconciliation({ limit: 100, offset: 0 }),
    onSuccess: (data) => {
      const result = data?.result;
      toast.success(
        result
          ? `تمت المطابقة: ${result.matched} مطابقة، ${result.missing} مفقودة، ${result.mismatched} بفروقات`
          : "تم تشغيل المطابقة"
      );
      queryClient.invalidateQueries({ queryKey: ["prowave-reconciliation"] });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "تعذر تشغيل المطابقة"));
    },
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [status, date, search]);

  const report = reportQuery.data;
  const summary = useMemo(() => report?.summary || {}, [report?.summary]);
  const pagination = report?.pagination || { total: 0, totalPages: 1 };
  const transactions = report?.transactions || [];
  const providerBalance = report?.providerBalance?.amountUsd;

  const stats = useMemo(
    () => [
      { label: "رصيد المزوّد", value: providerBalance !== null && providerBalance !== undefined ? formatUsd(providerBalance) : "غير متاح" },
      { label: "المخصوم من الزبائن", value: formatSyp(summary.paynetAmountSyp) },
      { label: "خصم المزود", value: formatUsd(summary.providerDiscountUsd) },
      { label: "تكلفة المزوّد", value: formatUsd(summary.expectedProviderDebitUsd) },
      { label: "الربح", value: formatSyp(summary.profitSyp), tone: Number(summary.profitSyp || 0) < 0 ? "danger" : undefined },
      { label: "عمليات فيها فرق", value: summary.mismatches || 0, tone: summary.mismatches ? "danger" : undefined },
      { label: "عمليات فاشلة/مرجعة", value: summary.failed || 0, tone: summary.failed ? "danger" : undefined },
    ],
    [providerBalance, summary]
  );

  const columns = useMemo(
    () => [
      {
        key: "createdAt",
        label: "التاريخ",
        render: (row) => formatDate(row.createdAt),
      },
      {
        key: "status",
        label: "الحالة",
        render: (row) => <StatusBadge value={row.status}>{statusLabel[row.status] || row.status}</StatusBadge>,
      },
      {
        key: "userEmail",
        label: "الزبون",
        render: (row) => row.userEmail || row.user?.email || "-",
      },
      {
        key: "item",
        label: "المنتج",
        render: (row) => row.itemTitle || row.itemName || row.itemCode,
      },
      {
        key: "invoice",
        label: "فاتورة المزوّد",
        render: (row) => row.prowaveInvoice || "-",
      },
      {
        key: "paynetAmountSyp",
        label: "سعر البيع",
        render: (row) => formatSyp(row.paynetAmountSyp),
      },
      {
        key: "expectedProviderDebitUsd",
        label: "تكلفة المزود",
        render: (row) => formatUsd(row.expectedProviderDebitUsd),
      },
      {
        key: "providerDiscountUsd",
        label: "خصم المزود",
        render: (row) => formatUsd(row.providerDiscountUsd),
      },
      {
        key: "actualProviderDebitUsd",
        label: "فرق الرصيد",
        render: (row) =>
          row.actualProviderDebitUsd === null || row.actualProviderDebitUsd === undefined
            ? "-"
            : formatUsd(row.actualProviderDebitUsd),
      },
      {
        key: "profitSyp",
        label: "الربح",
        render: (row) => (
          <span className={Number(row.profitSyp || 0) < 0 ? "font-bold text-red-700" : "font-bold text-emerald-700"}>
            {formatSyp(row.profitSyp)}
          </span>
        ),
      },
      {
        key: "mismatchReason",
        label: "سبب الفرق",
        render: (row) => row.mismatchReason || "-",
      },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-16" dir="rtl">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <PageHeader
          title="مطابقة المزوّد"
          description="متابعة خصومات PayNet، تكلفة المزوّد، الربح، والفروقات."
          stats={stats}
          actions={
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => reportQuery.refetch()}
                loading={reportQuery.isFetching && !runMutation.isPending}
              >
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
                تحديث
              </Button>
              <Button
                type="button"
                variant="accent"
                onClick={() => runMutation.mutate()}
                loading={runMutation.isPending}
              >
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                مطابقة الآن
              </Button>
            </>
          }
        />

        {reportQuery.isError && (
          <Alert type="error" className="mb-4">
            {getApiErrorMessage(reportQuery.error, "تعذر تحميل تقرير المزوّد.")}
          </Alert>
        )}

        <div className="mb-4 grid grid-cols-1 gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-4">
          <Input
            id="prowave-reconciliation-search"
            label="بحث"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="فاتورة، زبون، منتج"
          />
          <Input
            id="prowave-reconciliation-date"
            label="التاريخ"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
          <div className="space-y-1 text-right">
            <label htmlFor="prowave-reconciliation-status" className="block text-sm font-semibold text-slate-700">
              الحالة
            </label>
            <select
              id="prowave-reconciliation-status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-slate-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500"
            >
              <option value="">كل الحالات</option>
              <option value="completed">مطابقة</option>
              <option value="mismatch">فرق</option>
              <option value="pending">قيد المتابعة</option>
              <option value="failed">فاشلة</option>
              <option value="refunded">مرجعة</option>
            </select>
          </div>
          <div className="flex items-end">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => reportQuery.refetch()}
              loading={reportQuery.isFetching}
            >
              <Search className="h-4 w-4" aria-hidden="true" />
              بحث
            </Button>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={transactions}
          currentPage={currentPage}
          totalPages={pagination.totalPages}
          onPageChange={setCurrentPage}
          pageSize={itemsPerPage}
          onPageSizeChange={(size) => {
            setItemsPerPage(size);
            setCurrentPage(1);
          }}
          loading={reportQuery.isLoading}
          updating={reportQuery.isFetching && !reportQuery.isLoading}
          emptyTitle="لا توجد عمليات المزوّد"
          emptyDescription="ستظهر عمليات الشراء هنا بعد أول عملية للمزوّد."
        />
      </main>
      <Footer />
    </div>
  );
}
