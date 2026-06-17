import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { io } from "socket.io-client";
import Navbar from "../components/NavbarAdmin";
import PageHeader from "../components/Custom/PageHeader";
import DataTable from "../components/Custom/DataTable";
import StatusBadge from "../components/Custom/StatusBadge";
import { Button } from "../components/Custom/Button";
import ConfirmDialog from "../components/Custom/ConfirmDialog";
import PromptDialog from "../components/Custom/PromptDialog";
import Alert from "../components/Custom/Alert";
import Footer from "../components/Footer";
import {
  authConfig,
  fetchPaginated,
  getApiErrorMessage,
  paymentQueryKeys,
} from "../api/paymentQueries";

export default function AdminPending() {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [message, setMessage] = useState(null);
  const [dialog, setDialog] = useState(null);

  const queryParams = useMemo(
    () => ({ page: currentPage, limit: itemsPerPage }),
    [currentPage, itemsPerPage],
  );

  const pendingQuery = useQuery({
    queryKey: paymentQueryKeys.adminPending(queryParams),
    queryFn: () => fetchPaginated("https://paynet-1.onrender.com/api/payment/save-number/api/admin/pending", queryParams),
    placeholderData: keepPreviousData,
  });

  const payments = pendingQuery.data?.data || [];
  const pagination = useMemo(
    () => pendingQuery.data?.pagination || { total: 0, totalPages: 1 },
    [pendingQuery.data?.pagination],
  );

  useEffect(() => {
    const newSocket = io("https://paynet-1.onrender.com/api/payment/save-number");
    newSocket.on("pendingPaymentsUpdate", (updatedPayments) => {
      queryClient.setQueryData(paymentQueryKeys.adminPending(queryParams), (current) => ({
        data: Array.isArray(updatedPayments) ? updatedPayments : current?.data || [],
        pagination: {
          ...(current?.pagination || pagination),
          total: Array.isArray(updatedPayments) ? updatedPayments.length : current?.pagination?.total || 0,
        },
      }));
    });
    return () => newSocket.disconnect();
  }, [pagination, queryClient, queryParams]);

  useEffect(() => {
    if (currentPage < (pagination.totalPages || 1)) {
      const nextParams = { ...queryParams, page: currentPage + 1 };
      queryClient.prefetchQuery({
        queryKey: paymentQueryKeys.adminPending(nextParams),
        queryFn: () => fetchPaginated("https://paynet-1.onrender.com/api/payment/save-number/api/admin/pending", nextParams),
      });
    }
  }, [currentPage, pagination.totalPages, queryClient, queryParams]);

  const actionMutation = useMutation({
    mutationFn: async ({ type, payment, reason }) => {
      if (type === "confirm") {
        return axios.patch(`https://paynet-1.onrender.com/api/payment/save-number/api/admin/confirm/${payment._id}`, null, authConfig());
      }
      if (type === "start") {
        return axios.patch(`https://paynet-1.onrender.com/api/payment/save-number/api/admin/start/${payment._id}`, null, authConfig());
      }
      return axios.post(
        `https://paynet-1.onrender.com/api/payment/save-number/api/admin/reject/${payment._id}`,
        {
          email: payment.email,
          amount: payment.amount,
          reason,
        },
        authConfig(),
      );
    },
    onSuccess: (_data, variables) => {
      const successText =
        variables.type === "confirm"
          ? "تم تأكيد التسديد."
          : variables.type === "start"
            ? "تم بدء تنفيذ العملية."
            : "تم رفض العملية وإرجاع الرصيد.";
      setMessage({ type: "success", text: successText });
      setDialog(null);
      queryClient.invalidateQueries({ queryKey: ["payments", "admin-pending"] });
    },
    onError: (error) => {
      setMessage({
        type: "error",
        text: getApiErrorMessage(error, "حدث خطأ أثناء تنفيذ العملية."),
      });
    },
  });

  const columns = useMemo(
    () => [
      { key: "email", label: "البريد الإلكتروني", render: (p) => p.email || "غير متوفر" },
      { key: "landline", label: "رقم / معرف" },
      { key: "company", label: "الشركة" },
      { key: "speed", label: "السرعة" },
      { key: "amount", label: "المبلغ", render: (p) => `${p.amount?.toLocaleString?.() || p.amount} ل.س` },
      { key: "status", label: "الحالة", render: (p) => <StatusBadge value={p.status} /> },
      {
        key: "actions",
        label: "الإجراء",
        render: (p) => (
          <div className="flex flex-wrap justify-center gap-2">
            <Button size="sm" variant="warning" disabled={actionMutation.isPending} onClick={(e) => { e.stopPropagation(); setDialog({ type: "start", payment: p }); }}>
              بدء التنفيذ
            </Button>
            <Button size="sm" variant="success" disabled={actionMutation.isPending} onClick={(e) => { e.stopPropagation(); setDialog({ type: "confirm", payment: p }); }}>
              تأكيد التسديد
            </Button>
            <Button size="sm" variant="danger" disabled={actionMutation.isPending} onClick={(e) => { e.stopPropagation(); setDialog({ type: "reject", payment: p }); }}>
              رفض
            </Button>
          </div>
        ),
      },
    ],
    [actionMutation.isPending],
  );

  const selected = dialog?.payment;

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-16" dir="rtl">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <PageHeader
          title="عمليات قيد الترحيل"
          description="راجع العمليات الواردة، ابدأ التنفيذ، ثم أكد التسديد أو ارفض العملية مع سبب واضح."
          stats={[
            { label: "إجمالي العمليات", value: payments.length },
            { label: "قيد المتابعة", value: payments.filter((p) => p.status !== "تم التسديد").length },
          ]}
        />

        {(message || pendingQuery.isError) && (
          <Alert type={message?.type || "error"} className="mb-4">
            {message?.text || getApiErrorMessage(pendingQuery.error, "تعذر تحميل العمليات المعلقة.")}
          </Alert>
        )}

        <DataTable
          columns={columns}
          data={payments}
          currentPage={currentPage}
          totalPages={pagination.totalPages}
          onPageChange={setCurrentPage}
          pageSize={itemsPerPage}
          onPageSizeChange={(size) => {
            setItemsPerPage(size);
            setCurrentPage(1);
          }}
          loading={pendingQuery.isLoading}
          updating={pendingQuery.isFetching && !pendingQuery.isLoading}
          emptyTitle="لا توجد عمليات معلقة"
          emptyDescription="ستظهر العمليات الجديدة هنا عند وصولها."
        />
      </main>

      <ConfirmDialog
        open={dialog?.type === "confirm"}
        title="تأكيد التسديد"
        description={selected ? `هل تريد تأكيد تسديد الرقم ${selected.landline} بمبلغ ${selected.amount} ل.س؟` : ""}
        confirmText="تأكيد التسديد"
        tone="success"
        loading={actionMutation.isPending}
        onClose={() => {
          if (!actionMutation.isPending) setDialog(null);
        }}
        onConfirm={() => selected && actionMutation.mutate({ type: "confirm", payment: selected })}
      />

      <ConfirmDialog
        open={dialog?.type === "start"}
        title="بدء التنفيذ"
        description={selected ? `سيتم وضع العملية ${selected.landline} قيد التنفيذ.` : ""}
        confirmText="بدء التنفيذ"
        loading={actionMutation.isPending}
        onClose={() => {
          if (!actionMutation.isPending) setDialog(null);
        }}
        onConfirm={() => selected && actionMutation.mutate({ type: "start", payment: selected })}
      />

      <PromptDialog
        open={dialog?.type === "reject"}
        title="رفض العملية"
        description="أدخل سبب الرفض ليظهر بشكل واضح في السجلات."
        label="سبب الرفض"
        placeholder="مثال: بيانات غير صحيحة"
        confirmText="رفض العملية"
        tone="danger"
        loading={actionMutation.isPending}
        onClose={() => {
          if (!actionMutation.isPending) setDialog(null);
        }}
        onConfirm={(reason) => {
          if (!reason || !selected) return;
          actionMutation.mutate({ type: "reject", payment: selected, reason });
        }}
      />
      <Footer />
    </div>
  );
}
