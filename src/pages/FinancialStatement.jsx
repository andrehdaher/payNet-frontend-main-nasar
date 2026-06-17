import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle } from "lucide-react";
import { useNotification } from "../context/NotificationContext";
import ScreenWrapper from "../components/ScreenWrapper";
import DataTable from "../components/Custom/DataTable";
import { Input } from "../components/Custom/Input";
import { Card, CardContent, CardHeader } from "../components/Custom/Card";
import PageHeader from "../components/Custom/PageHeader";
import Alert from "../components/Custom/Alert";
import ConfirmDialog from "../components/Custom/ConfirmDialog";
import {
  authConfig,
  fetchPaginated,
  getApiErrorMessage,
  getCurrentEmail,
  paymentQueryKeys,
} from "../api/paymentQueries";

function getTodayDate() {
  return new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Damascus",
  });
}

function getRefusedSeenKey(userEmail, date = getTodayDate()) {
  return `paynet:refused-seen:${userEmail || "anonymous"}:${date}`;
}

export default function FinancialStatement() {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchDate, setSearchDate] = useState("");
  const [searchLandline, setSearchLandline] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [message, setMessage] = useState(null);
  const [pendingPaymentType, setPendingPaymentType] = useState(null);
  const {
    setHasNewUnpaid,
    setHasUnseenRefusedToday,
    setRefusedTodaySeenAt,
  } = useNotification();

  const queryParams = useMemo(
    () => ({
      page: currentPage,
      limit: itemsPerPage,
      search: searchLandline || undefined,
      date: searchDate || undefined,
      status: searchStatus || undefined,
      paymentType: paymentFilter || undefined,
    }),
    [currentPage, itemsPerPage, searchLandline, searchDate, searchStatus, paymentFilter],
  );

  const queryKey = paymentQueryKeys.userConfirmed(queryParams);

  const confirmedQuery = useQuery({
    queryKey,
    queryFn: () => fetchPaginated("https://paynet-1.onrender.com/api/payment/save-number/api/admin/user/confirmed", queryParams),
    placeholderData: keepPreviousData,
  });

  const confirmedPayments = confirmedQuery.data?.data || [];
  const pagination = confirmedQuery.data?.pagination || { total: 0, totalPages: 1 };

  useEffect(() => {
    if (confirmedQuery.isSuccess) {
      setHasNewUnpaid(false);
      const now = Date.now();
      const email = getCurrentEmail();
      localStorage.setItem(getRefusedSeenKey(email), String(now));
      setRefusedTodaySeenAt(now);
      setHasUnseenRefusedToday(false);
    }
  }, [confirmedQuery.isSuccess, setHasNewUnpaid, setHasUnseenRefusedToday, setRefusedTodaySeenAt]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchLandline, searchDate, searchStatus, paymentFilter]);

  useEffect(() => {
    if (currentPage < (pagination.totalPages || 1)) {
      const nextParams = { ...queryParams, page: currentPage + 1 };
      queryClient.prefetchQuery({
        queryKey: paymentQueryKeys.userConfirmed(nextParams),
        queryFn: () => fetchPaginated("https://paynet-1.onrender.com/api/payment/save-number/api/admin/user/confirmed", nextParams),
      });
    }
  }, [currentPage, pagination.totalPages, queryClient, queryParams]);

  const paymentTypeMutation = useMutation({
    mutationFn: ({ id, newType }) =>
      axios.put(
        `https://paynet-1.onrender.com/api/payment/save-number/api/admin/payment/${id}`,
        { paymentType: newType },
        authConfig(),
      ),
    onMutate: async ({ id, newType }) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (current) => {
        if (!current?.data) return current;
        return {
          ...current,
          data: current.data.map((payment) =>
            payment._id === id ? { ...payment, paymentType: newType } : payment,
          ),
        };
      });

      return { previous };
    },
    onError: (error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
      setMessage({
        type: "error",
        text: getApiErrorMessage(error, "حدث خطأ أثناء تعديل نوع الدفع."),
      });
    },
    onSuccess: () => {
      setMessage({ type: "success", text: "تم تعديل نوع الدفع." });
      setPendingPaymentType(null);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["payments", "user-confirmed"] });
    },
  });

  const columns = useMemo(
    () => [
      { key: "landline", label: "رقم أرضي" },
      { key: "company", label: "الشركة" },
      { key: "speed", label: "السرعة" },
      { key: "amount", label: "المبلغ", render: (p) => `${p.amount?.toLocaleString?.() || p.amount} ل.س` },
      {
        key: "paymentType",
        label: "نوع الدفع",
        render: (p) => (
          <select
            value={p.paymentType || ""}
            onChange={(e) => setPendingPaymentType({ id: p._id, newType: e.target.value })}
            disabled={paymentTypeMutation.isPending}
            className="rounded border border-slate-300 bg-white p-1 text-sm text-slate-900 disabled:opacity-60"
          >
            <option value="cash">نقدا</option>
            <option value="credit">دين</option>
          </select>
        ),
      },
      {
        key: "status",
        label: "الحالة",
        render: (p) => (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
              p.status === "تم التسديد"
                ? "bg-green-200 text-green-800"
                : p.status === "غير مسددة"
                  ? "bg-red-200 text-red-800"
                  : p.status === "جاري التسديد"
                    ? "bg-yellow-200 text-yellow-800"
                    : p.status === "بدء التسديد"
                      ? "bg-blue-200 text-blue-800"
                      : "bg-gray-200 text-gray-800"
            }`}
          >
            {p.status === "تم التسديد" && <CheckCircle className="h-3.5 w-3.5" aria-hidden="true" />}
            {p.status}
          </span>
        ),
      },
      {
        key: "date",
        label: "تاريخ التسديد",
        render: (p) =>
          new Date(p.updatedAt || p.createdAt).toLocaleString("ar-SY", {
            dateStyle: "medium",
            timeStyle: "short",
          }),
      },
      {
        key: "note",
        label: "ملاحظات",
        render: (p) => (p.status === "غير مسددة" ? p.note || "-" : "-"),
      },
    ],
    [paymentTypeMutation.isPending],
  );

  return (
    <ScreenWrapper>
      <PageHeader
        title="البيان المالي"
        description="راجع عملياتك المالية وابحث حسب الرقم، التاريخ، حالة التسديد أو طريقة الدفع."
      />
      {(message || confirmedQuery.isError) && (
        <Alert type={message?.type || "error"} className="mb-4">
          {message?.text || getApiErrorMessage(confirmedQuery.error, "تعذر تحميل البيان المالي.")}
        </Alert>
      )}
      <Card className="m-6">
        <CardHeader>
          <h2 className="text-center text-3xl font-bold text-gray-700">البيان المالي</h2>
        </CardHeader>
        <CardContent>
          <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            <Input
              id="financial-search-landline"
              label="بحث"
              type="text"
              placeholder="بحث برقم الهاتف الأرضي"
              value={searchLandline}
              onChange={(e) => setSearchLandline(e.target.value)}
            />
            <Input
              id="financial-search-date"
              label="تاريخ"
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
            />
            <div>
              <label htmlFor="financial-search-status" className="mb-1 block text-sm font-semibold text-slate-700">
                حالة التسديد
              </label>
              <select
                id="financial-search-status"
                className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-slate-900 outline-none transition-colors focus:border-violet-500 focus:ring-2 focus:ring-violet-500"
                value={searchStatus}
                onChange={(e) => setSearchStatus(e.target.value)}
              >
                <option value="">كل الحالات</option>
                <option value="تم التسديد">تم التسديد</option>
                <option value="غير مسددة">غير مسددة</option>
              </select>
            </div>
            <div>
              <label htmlFor="financial-payment-filter" className="mb-1 block text-sm font-semibold text-slate-700">
                حالة الدفع
              </label>
              <select
                id="financial-payment-filter"
                className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-slate-900 outline-none transition-colors focus:border-violet-500 focus:ring-2 focus:ring-violet-500"
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
              >
                <option value="">كل الحالات</option>
                <option value="cash">نقدا</option>
                <option value="credit">دين</option>
              </select>
            </div>
          </div>
          <DataTable
            columns={columns}
            data={confirmedPayments}
            currentPage={currentPage}
            totalPages={pagination.totalPages}
            onPageChange={setCurrentPage}
            pageSize={itemsPerPage}
            onPageSizeChange={(size) => {
              setItemsPerPage(size);
              setCurrentPage(1);
            }}
            loading={confirmedQuery.isLoading}
            updating={confirmedQuery.isFetching && !confirmedQuery.isLoading}
          />
        </CardContent>
      </Card>
      <ConfirmDialog
        open={Boolean(pendingPaymentType)}
        title="تعديل نوع الدفع"
        description="هل أنت متأكد من تعديل نوع الدفع لهذه العملية؟"
        confirmText="تعديل"
        loading={paymentTypeMutation.isPending}
        onClose={() => {
          if (!paymentTypeMutation.isPending) setPendingPaymentType(null);
        }}
        onConfirm={() => {
          if (pendingPaymentType) paymentTypeMutation.mutate(pendingPaymentType);
        }}
      />
    </ScreenWrapper>
  );
}
