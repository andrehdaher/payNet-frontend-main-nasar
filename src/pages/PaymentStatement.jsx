import React, { useEffect, useMemo, useState } from "react";
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNotification } from "../context/NotificationContext";
import ScreenWrapper from "../components/ScreenWrapper";
import DataTable from "../components/Custom/DataTable";
import { Input } from "../components/Custom/Input";
import { Card, CardContent, CardHeader } from "../components/Custom/Card";
import Alert from "../components/Custom/Alert";
import { fetchPaginated, getApiErrorMessage, paymentQueryKeys } from "../api/paymentQueries";

export default function FinancialStatement() {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchDate, setSearchDate] = useState("");
  const [searchLandline, setSearchLandline] = useState("");
  const { setHasNewUnpaid } = useNotification();

  const queryParams = useMemo(
    () => ({
      page: currentPage,
      limit: itemsPerPage,
      search: searchLandline || undefined,
      date: searchDate || undefined,
    }),
    [currentPage, searchLandline, searchDate],
  );

  const paymentsQuery = useQuery({
    queryKey: paymentQueryKeys.userBalance(queryParams),
    queryFn: () => fetchPaginated("/api/saveBalance/all", queryParams),
    placeholderData: keepPreviousData,
  });

  const confirmedPayments = paymentsQuery.data?.data || [];
  const pagination = paymentsQuery.data?.pagination || { totalPages: 1 };

  useEffect(() => {
    if (paymentsQuery.isSuccess) {
      setHasNewUnpaid(false);
    }
  }, [paymentsQuery.isSuccess, setHasNewUnpaid]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchLandline, searchDate]);

  useEffect(() => {
    if (currentPage < (pagination.totalPages || 1)) {
      const nextParams = { ...queryParams, page: currentPage + 1 };
      queryClient.prefetchQuery({
        queryKey: paymentQueryKeys.userBalance(nextParams),
        queryFn: () => fetchPaginated("/api/saveBalance/all", nextParams),
      });
    }
  }, [currentPage, pagination.totalPages, queryClient, queryParams]);

  const columns = useMemo(
    () => [
      { key: "name", label: "الاسم" },
      { key: "destination", label: "المستلم" },
      { key: "number", label: "الرقم" },
      { key: "operator", label: "نوع العملية" },
      { key: "noticeNumber", label: "رقم الاشعار" },
      { key: "amount", label: "المبلغ", render: (p) => `${p.amount?.toLocaleString?.() || p.amount} ل.س` },
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

  return (
    <ScreenWrapper>
      {paymentsQuery.isError && (
        <Alert type="error" className="mb-4">
          {getApiErrorMessage(paymentsQuery.error, "تعذر تحميل البيان المالي للدفعات.")}
        </Alert>
      )}
      <Card className="m-6">
        <CardHeader>
          <h2 className="text-center text-3xl font-bold text-gray-700">
            البيان المالي للدفعات
          </h2>
        </CardHeader>
        <CardContent>
          <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            <Input
              label="بحث"
              type="text"
              placeholder="بحث برقم الهاتف الأرضي"
              onChange={(e) => setSearchLandline(e.target.value)}
            />
            <Input
              label="تاريخ"
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
            />
          </div>
          <DataTable
            columns={columns}
            data={confirmedPayments}
            currentPage={currentPage}
            totalPages={pagination.totalPages}
            onPageChange={setCurrentPage}
            pageSize={itemsPerPage}
            loading={paymentsQuery.isLoading}
            updating={paymentsQuery.isFetching && !paymentsQuery.isLoading}
          />
        </CardContent>
      </Card>
    </ScreenWrapper>
  );
}
