import React, { useEffect, useMemo, useState } from "react";
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import Navbar from "../components/NavbarAdmin";
import PageHeader from "../components/Custom/PageHeader";
import DataTable from "../components/Custom/DataTable";
import StatusBadge from "../components/Custom/StatusBadge";
import { Input } from "../components/Custom/Input";
import Alert from "../components/Custom/Alert";
import Footer from "../components/Footer";
import { fetchPaginated, getApiErrorMessage, paymentQueryKeys } from "../api/paymentQueries";

export default function AdminFinancialStatement() {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [searchDate, setSearchDate] = useState("");
  const [searchLandline, setSearchLandline] = useState("");
  const [searchStatus, setSearchStatus] = useState("");

  const queryParams = useMemo(
    () => ({
      page: currentPage,
      limit: itemsPerPage,
      search: searchLandline || undefined,
      date: searchDate || undefined,
      status: searchStatus || undefined,
    }),
    [currentPage, itemsPerPage, searchLandline, searchDate, searchStatus],
  );

  const confirmedQuery = useQuery({
    queryKey: paymentQueryKeys.adminConfirmed(queryParams),
    queryFn: () => fetchPaginated("https://paynet-1.onrender.com/api/payment/save-number/api/admin/user/allconfirmed", queryParams),
    placeholderData: keepPreviousData,
  });

  const confirmedPayments = confirmedQuery.data?.data || [];
  const pagination = confirmedQuery.data?.pagination || { total: 0, totalPages: 1 };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchLandline, searchDate, searchStatus]);

  useEffect(() => {
    if (currentPage < (pagination.totalPages || 1)) {
      const nextParams = { ...queryParams, page: currentPage + 1 };
      queryClient.prefetchQuery({
        queryKey: paymentQueryKeys.adminConfirmed(nextParams),
        queryFn: () => fetchPaginated("https://paynet-1.onrender.com/api/payment/save-number/api/admin/user/allconfirmed", nextParams),
      });
    }
  }, [currentPage, pagination.totalPages, queryClient, queryParams]);

  const columns = useMemo(
    () => [
      { key: "landline", label: "رقم أرضي" },
      { key: "company", label: "الشركة" },
      { key: "speed", label: "السرعة" },
      { key: "amount", label: "المبلغ", render: (p) => `${p.amount?.toLocaleString?.() || p.amount} ل.س` },
      { key: "status", label: "الحالة", render: (p) => <StatusBadge value={p.status} /> },
      { key: "email", label: "صاحب العملية" },
      {
        key: "date",
        label: "تاريخ التسديد",
        render: (p) => new Date(p.updatedAt || p.createdAt).toLocaleString("ar-SY", { dateStyle: "medium", timeStyle: "short" }),
      },
      { key: "note", label: "ملاحظات", render: (p) => (p.status === "غير مسددة" ? p.note || "-" : "-") },
    ],
    [],
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-16" dir="rtl">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <PageHeader
          title="البيان المالي"
          description="ابحث وراجع عمليات التسديد حسب الرقم، التاريخ، أو الحالة."
          stats={[
            { label: "إجمالي النتائج", value: pagination.total },
            { label: "في هذه الصفحة", value: confirmedPayments.length },
          ]}
        />

        {confirmedQuery.isError && (
          <Alert type="error" className="mb-4">
            {getApiErrorMessage(confirmedQuery.error, "تعذر تحميل البيان المالي.")}
          </Alert>
        )}

        <div className="mb-4 grid grid-cols-1 gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-3">
          <Input
            id="searchLandline"
            label="بحث برقم الهاتف الأرضي"
            value={searchLandline}
            onChange={(e) => setSearchLandline(e.target.value)}
          />
          <Input
            id="searchDate"
            label="التاريخ"
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
          />
          <div className="space-y-1 text-right">
            <label htmlFor="admin-financial-status" className="block text-sm font-semibold text-slate-700">حالة التسديد</label>
            <select
              id="admin-financial-status"
              className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-slate-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500"
              value={searchStatus}
              onChange={(e) => setSearchStatus(e.target.value)}
            >
              <option value="">كل الحالات</option>
              <option value="تم التسديد">تم التسديد</option>
              <option value="غير مسددة">غير مسددة</option>
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
          emptyTitle="لا توجد عمليات"
          emptyDescription="غير الفلاتر أو تحقق لاحقا عند وصول عمليات جديدة."
        />
      </main>
      <Footer />
    </div>
  );
}
