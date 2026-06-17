import React, { useEffect, useMemo, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import ScreenWrapper from "../components/ScreenWrapper";
import { Input } from "../components/Custom/Input";
import { Card, CardContent, CardHeader } from "../components/Custom/Card";
import DataTable from "../components/Custom/DataTable";
import Alert from "../components/Custom/Alert";
import { fetchList, getApiErrorMessage, paymentQueryKeys } from "../api/paymentQueries";

export default function PendingPayments() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchDate, setSearchDate] = useState("");
  const [searchLandline, setSearchLandline] = useState("");

  const pendingQuery = useQuery({
    queryKey: paymentQueryKeys.userPending(),
    queryFn: () => fetchList("https://paynet-1.onrender.com/api/payment/save-number/api/admin/user/pending"),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchLandline, searchDate]);

  const filteredPayments = useMemo(() => {
    const pendingPayments = (pendingQuery.data || []).filter((p) => p.status === "جاري التسديد");

    return pendingPayments.filter((p) => {
      const landlineMatch = String(p.landline || "").includes(searchLandline);
      const dateMatch = searchDate
        ? new Date(p.updatedAt || p.createdAt).toISOString().split("T")[0] === searchDate
        : true;

      return landlineMatch && dateMatch;
    });
  }, [pendingQuery.data, searchDate, searchLandline]);

  const currentItems = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredPayments.slice(indexOfFirstItem, indexOfLastItem);
  }, [currentPage, filteredPayments]);

  const totalPages = Math.max(1, Math.ceil(filteredPayments.length / itemsPerPage));

  const columns = useMemo(
    () => [
      { key: "landline", label: "رقم أرضي" },
      { key: "company", label: "الشركة" },
      { key: "speed", label: "السرعة" },
      { key: "amount", label: "المبلغ", render: (p) => `${p.amount?.toLocaleString?.() || p.amount} ل.س` },
      {
        key: "date",
        label: "تاريخ الطلب",
        render: (p) =>
          new Date(p.updatedAt || p.createdAt).toLocaleString("ar-SY", {
            dateStyle: "medium",
            timeStyle: "short",
          }),
      },
    ],
    [],
  );

  return (
    <ScreenWrapper>
      {pendingQuery.isError && (
        <Alert type="error" className="mb-4">
          {getApiErrorMessage(pendingQuery.error, "تعذر تحميل العمليات قيد التسديد.")}
        </Alert>
      )}
      <Card className="m-6">
        <CardHeader>
          <h2 className="text-center text-3xl font-bold text-gray-700">
            عمليات قيد التسديد
          </h2>
        </CardHeader>
        <CardContent>
          <div className="mb-6 grid grid-cols-2 gap-4">
            <Input
              label="بحث"
              type="text"
              placeholder="بحث برقم الهاتف الأرضي"
              value={searchLandline}
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
            data={currentItems}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            pageSize={itemsPerPage}
            loading={pendingQuery.isLoading}
            updating={pendingQuery.isFetching && !pendingQuery.isLoading}
          />
        </CardContent>
      </Card>
    </ScreenWrapper>
  );
}
