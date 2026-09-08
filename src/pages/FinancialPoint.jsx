import React, { useEffect, useMemo, useState } from "react";
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useNotification } from "../context/NotificationContext";
import ScreenWrapper from "../components/ScreenWrapper";
import DataTable from "../components/Custom/DataTable";
import { Input } from "../components/Custom/Input";
import { Card, CardContent, CardHeader } from "../components/Custom/Card";
import PageHeader from "../components/Custom/PageHeader";
import Alert from "../components/Custom/Alert";
import {
  fetchPaginated,
  getApiErrorMessage,
  getCurrentEmail,
  paymentQueryKeys,
} from "../api/paymentQueries";
import { normalizePaymentStatusLabel } from "../utils/paymentStatus";

export default function FinancialStatement() {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const location = useLocation();
  const pointData = location.state;
  const pointUsername = pointData?.username || "";
  const [searchDate, setSearchDate] = useState("");
  const [searchLandline, setSearchLandline] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const { setHasNewUnpaid } = useNotification();
  const email = getCurrentEmail();

  const queryParams = useMemo(
    () => ({
      page: currentPage,
      limit: itemsPerPage,
      search: searchLandline || undefined,
      date: searchDate || undefined,
      status: searchStatus || undefined,
      paymentType: paymentFilter || undefined,
      pointUsername: pointUsername || undefined,
    }),
    [currentPage, pointUsername, searchLandline, searchDate, searchStatus, paymentFilter],
  );
  const queryKeyParams = useMemo(
    () => ({ ...queryParams, ownerEmail: email }),
    [email, queryParams],
  );

  const confirmedQuery = useQuery({
    queryKey: paymentQueryKeys.pointConfirmed(queryKeyParams),
    queryFn: () =>
      fetchPaginated("/api/point/user/confirmed/point", {
        page: currentPage,
        limit: itemsPerPage,
        search: searchLandline || undefined,
        date: searchDate || undefined,
        status: searchStatus || undefined,
        paymentType: paymentFilter || undefined,
        pointUsername: pointUsername || undefined,
      }),
    enabled: Boolean(email),
    placeholderData: keepPreviousData,
  });

  const confirmedPayments = confirmedQuery.data?.data || [];
  const pagination = confirmedQuery.data?.pagination || { total: 0, totalPages: 1 };

  useEffect(() => {
    if (confirmedQuery.isSuccess) {
      setHasNewUnpaid(false);
    }
  }, [confirmedQuery.isSuccess, setHasNewUnpaid]);

  useEffect(() => {
    setCurrentPage(1);
  }, [pointUsername, searchLandline, searchDate, searchStatus, paymentFilter]);

  useEffect(() => {
    if (email && currentPage < (pagination.totalPages || 1)) {
      const nextParams = { ...queryParams, page: currentPage + 1 };
      queryClient.prefetchQuery({
        queryKey: paymentQueryKeys.pointConfirmed({ ...nextParams, ownerEmail: email }),
        queryFn: () =>
          fetchPaginated("/api/point/user/confirmed/point", nextParams),
      });
    }
  }, [currentPage, email, pagination.totalPages, queryClient, queryParams]);

  const columns = useMemo(
    () => [
      {
        key: "pointUsername",
        label: "النقطة",
        render: (p) => p.pointUsername || p.email || "-",
      },
      {
        key: "pointOwner",
        label: "صاحب النقطة",
        render: (p) => p.pointOwner || "-",
      },
      { key: "landline", label: "رقم أرضي" },
      { key: "company", label: "الشركة" },
      { key: "speed", label: "السرعة" },
      { key: "amount", label: "المبلغ", render: (p) => `${p.amount?.toLocaleString?.() || p.amount} ل.س` },
      {
        key: "status",
        label: "الحالة",
        render: (p) => {
          const displayStatus = normalizePaymentStatusLabel(p.status);

          return (
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
                displayStatus === "تم التسديد" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
              }`}
            >
              {displayStatus === "تم التسديد" && <CheckCircle className="h-3.5 w-3.5" aria-hidden="true" />}
              {displayStatus}
            </span>
          );
        },
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
    [],
  );

  const title = pointData?.owner
    ? `البيان المالي لـ ${pointData.owner}`
    : "البيان المالي للنقاط الفرعية";

  return (
    <ScreenWrapper>
      <PageHeader
        title={title}
        description={pointUsername ? "راجع عمليات هذه النقطة الفرعية." : "راجع عمليات كل النقاط الفرعية التابعة لحسابك."}
      />
      {confirmedQuery.isError && (
        <Alert type="error" className="mb-4">
          {getApiErrorMessage(confirmedQuery.error, "تعذر تحميل بيان النقطة المالي.")}
        </Alert>
      )}
      <Card className="m-6">
        <CardHeader>
          <h2 className="text-center text-3xl font-bold text-gray-700">
            {title}
          </h2>
        </CardHeader>
        <CardContent>
          <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            <Input
              id="point-financial-search-landline"
              label="بحث"
              type="text"
              placeholder="بحث برقم الهاتف الأرضي"
              value={searchLandline}
              onChange={(e) => setSearchLandline(e.target.value)}
            />
            <Input
              id="point-financial-search-date"
              label="تاريخ"
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
            />
            <div>
              <label htmlFor="point-financial-search-status" className="mb-1 block text-sm font-semibold text-slate-700">
                حالة التسديد
              </label>
              <select
                id="point-financial-search-status"
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
              <label htmlFor="point-financial-payment-filter" className="mb-1 block text-sm font-semibold text-slate-700">
                حالة الدفع
              </label>
              <select
                id="point-financial-payment-filter"
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
            loading={confirmedQuery.isLoading}
            updating={confirmedQuery.isFetching && !confirmedQuery.isLoading}
          />
        </CardContent>
      </Card>
    </ScreenWrapper>
  );
}
