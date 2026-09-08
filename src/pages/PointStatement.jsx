import React, { useEffect, useMemo, useState } from "react";
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle } from "lucide-react";
import ScreenWrapper from "../components/ScreenWrapper";
import DataTable from "../components/Custom/DataTable";
import { Input } from "../components/Custom/Input";
import { Card, CardContent } from "../components/Custom/Card";
import PageHeader from "../components/Custom/PageHeader";
import Alert from "../components/Custom/Alert";
import {
  fetchPaginated,
  getApiErrorMessage,
  getCurrentEmail,
  paymentQueryKeys,
} from "../api/paymentQueries";

export default function PointStatement() {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const itemsPerPage = 20;
  const email = getCurrentEmail();

  const queryParams = useMemo(
    () => ({
      page: currentPage,
      limit: itemsPerPage,
      search: search || undefined,
      date: searchDate || undefined,
    }),
    [currentPage, search, searchDate],
  );

  const transfersQuery = useQuery({
    queryKey: paymentQueryKeys.pointStatements({ ...queryParams, ownerEmail: email }),
    queryFn: () => fetchPaginated("/api/point/all", queryParams),
    enabled: Boolean(email),
    placeholderData: keepPreviousData,
  });

  const transfers = transfersQuery.data?.data || [];
  const pagination = transfersQuery.data?.pagination || { total: 0, totalPages: 1 };

  useEffect(() => {
    setCurrentPage(1);
  }, [search, searchDate]);

  useEffect(() => {
    if (email && currentPage < (pagination.totalPages || 1)) {
      const nextParams = { ...queryParams, page: currentPage + 1 };
      queryClient.prefetchQuery({
        queryKey: paymentQueryKeys.pointStatements({ ...nextParams, ownerEmail: email }),
        queryFn: () => fetchPaginated("/api/point/all", nextParams),
      });
    }
  }, [currentPage, email, pagination.totalPages, queryClient, queryParams]);

  const columns = useMemo(
    () => [
      {
        key: "pointUsername",
        label: "النقطة الفرعية",
        render: (row) => row.pointUsername || row.name || "-",
      },
      {
        key: "pointOwner",
        label: "صاحب النقطة",
        render: (row) => row.pointOwner || row.operator || "-",
      },
      {
        key: "fromAccount",
        label: "الحساب الرئيسي",
        render: (row) => row.fromAccount || row.destination || "-",
      },
      {
        key: "amount",
        label: "المبلغ المحول",
        render: (row) => `${Number(row.amount || 0).toLocaleString("ar-SY")} ل.س`,
      },
      {
        key: "date",
        label: "تاريخ التحويل",
        render: (row) =>
          new Date(row.date || row.createdAt).toLocaleString("ar-SY", {
            dateStyle: "medium",
            timeStyle: "short",
          }),
      },
      {
        key: "isConfirmed",
        label: "الحالة",
        render: (row) => (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
              row.isConfirmed ? "bg-green-200 text-green-800" : "bg-amber-100 text-amber-800"
            }`}
          >
            {row.isConfirmed && <CheckCircle className="h-3.5 w-3.5" aria-hidden="true" />}
            {row.isConfirmed ? "تم التحويل" : "غير مؤكد"}
          </span>
        ),
      },
    ],
    [],
  );

  return (
    <ScreenWrapper>
      <PageHeader
        title="تحويلات رصيد النقاط"
        description="راجع الرصيد الذي حولته من حسابك الرئيسي إلى كل نقطة فرعية."
      />

      {transfersQuery.isError && (
        <Alert type="error" className="mb-4">
          {getApiErrorMessage(transfersQuery.error, "تعذر تحميل تحويلات رصيد النقاط.")}
        </Alert>
      )}

      <Card className="m-6">
        <CardContent>
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              id="point-transfer-search"
              label="بحث"
              type="text"
              placeholder="ابحث باسم النقطة أو صاحب النقطة"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Input
              id="point-transfer-date"
              label="تاريخ"
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
            />
          </div>

          <DataTable
            columns={columns}
            data={transfers}
            currentPage={currentPage}
            totalPages={pagination.totalPages}
            onPageChange={setCurrentPage}
            pageSize={itemsPerPage}
            loading={transfersQuery.isLoading}
            updating={transfersQuery.isFetching && !transfersQuery.isLoading}
            emptyTitle="لا توجد تحويلات"
            emptyDescription="لم يتم العثور على تحويلات رصيد للنقاط الفرعية."
          />
        </CardContent>
      </Card>
    </ScreenWrapper>
  );
}
