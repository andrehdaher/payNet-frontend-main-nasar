import React, { useEffect, useState } from "react";
import axios from "axios";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle } from "lucide-react";
import Navbar from "../components/NavbarAdmin";
import Footer from "../components/Footer";
import Alert from "../components/Custom/Alert";
import ConfirmDialog from "../components/Custom/ConfirmDialog";
import { Button } from "../components/Custom/Button";
import { LoadingSkeleton } from "../components/Custom/LoadingSkeleton";
import {
  authConfig,
  fetchPaginated,
  getApiErrorMessage,
  paymentQueryKeys,
} from "../api/paymentQueries";

export default function PaymentStatement() {
  const queryClient = useQueryClient();
  const [message, setMessage] = useState(null);
  const [dialog, setDialog] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const paymentsQuery = useQuery({
    queryKey: paymentQueryKeys.adminBalance({ page: currentPage, limit: itemsPerPage }),
    queryFn: () =>
      fetchPaginated("https://paynet-1.onrender.com/api/payment/save-number/api/saveBalance/all-admin", {
        page: currentPage,
        limit: itemsPerPage,
      }),
    placeholderData: keepPreviousData,
  });

  const payments = paymentsQuery.data?.data || [];
  const pagination = paymentsQuery.data?.pagination || { totalPages: 1 };

  useEffect(() => {
    if (currentPage < (pagination.totalPages || 1)) {
      const nextParams = { page: currentPage + 1, limit: itemsPerPage };
      queryClient.prefetchQuery({
        queryKey: paymentQueryKeys.adminBalance(nextParams),
        queryFn: () => fetchPaginated("https://paynet-1.onrender.com/api/payment/save-number/api/saveBalance/all-admin", nextParams),
      });
    }
  }, [currentPage, pagination.totalPages, queryClient]);

  const confirmMutation = useMutation({
    mutationFn: (payment) =>
      axios.post(
        "https://paynet-1.onrender.com/api/payment/save-number/api/admin/confirm-payment",
        {
          id: payment._id,
          email: payment.name,
          amount: payment.amount,
        },
        authConfig(),
      ),
    onMutate: async (payment) => {
      const key = paymentQueryKeys.adminBalance({ page: currentPage, limit: itemsPerPage });
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData(key);
      queryClient.setQueryData(key, (current) => {
        if (!current?.data) return current;
        return {
          ...current,
          data: current.data.map((item) =>
            item._id === payment._id ? { ...item, isConfirmed: true } : item,
          ),
        };
      });
      return { previous, key };
    },
    onSuccess: () => {
      setMessage({ type: "success", text: "تم تأكيد الدفعة بنجاح." });
      setDialog(null);
    },
    onError: (error, _payment, context) => {
      if (context?.previous) queryClient.setQueryData(context.key, context.previous);
      setMessage({ type: "error", text: getApiErrorMessage(error, "حدث خطأ أثناء تأكيد الدفعة.") });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["payments", "admin-balance"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (payment) => axios.delete(`https://paynet-1.onrender.com/api/payment/save-number/api/admin/delete/${payment._id}`, authConfig()),
    onSuccess: () => {
      setMessage({ type: "success", text: "تم حذف الدفعة بنجاح." });
      setDialog(null);
      queryClient.invalidateQueries({ queryKey: ["payments", "admin-balance"] });
    },
    onError: (error) => {
      setMessage({ type: "error", text: getApiErrorMessage(error, "تعذر حذف الدفعة.") });
    },
  });

  const actionLoading = confirmMutation.isPending || deleteMutation.isPending;

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-16">
      <Navbar />
      <div className="p-6" dir="rtl">
        <h2 className="mb-6 text-center text-2xl font-bold text-blue-700">
          البيان المالي للدفعات
        </h2>
        {(message || paymentsQuery.isError) && (
          <Alert type={message?.type || "error"} className="mb-4">
            {message?.text || getApiErrorMessage(paymentsQuery.error, "تعذر تحميل الدفعات.")}
          </Alert>
        )}

        {paymentsQuery.isLoading ? (
          <LoadingSkeleton rows={6} />
        ) : payments.length === 0 ? (
          <p className="text-center text-gray-500">لا توجد دفعات محفوظة.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg bg-white shadow-md">
            {paymentsQuery.isFetching && <div className="h-1 animate-pulse bg-violet-600" />}
            <table className="min-w-full overflow-hidden text-sm">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="p-3">الاسم</th>
                  <th className="p-3">الجهة</th>
                  <th className="p-3">الرقم</th>
                  <th className="p-3">صاحب العملية</th>
                  <th className="p-3">رقم الإشعار</th>
                  <th className="p-3">المبلغ</th>
                  <th className="p-3">التاريخ</th>
                  <th className="p-3">الإجراء</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment, index) => (
                  <tr key={payment._id || index} className="border-b text-center hover:bg-gray-100">
                    <td className="p-3">{payment.name}</td>
                    <td className="p-3">{payment.destination}</td>
                    <td className="p-3">{payment.number}</td>
                    <td className="p-3">{payment.operator}</td>
                    <td className="p-3">{payment.noticeNumber}</td>
                    <td className="p-3">{payment.amount}</td>
                    <td className="p-3">{payment.date?.substring(0, 10)}</td>
                    <td className="p-3">
                      <Button
                        type="button"
                        onClick={() => setDialog({ type: "confirm", payment })}
                        disabled={payment.isConfirmed || actionLoading}
                        variant={payment.isConfirmed ? "success" : "danger"}
                        size="sm"
                      >
                        {payment.isConfirmed && <CheckCircle className="h-4 w-4" aria-hidden="true" />}
                        {payment.isConfirmed ? "تم التأكيد" : "تأكيد"}
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setDialog({ type: "delete", payment })}
                        variant="danger"
                        size="sm"
                        className="mx-2"
                        disabled={actionLoading}
                      >
                        حذف الدفعة
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="mt-4 flex items-center justify-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={currentPage <= 1 || paymentsQuery.isFetching}
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
          >
            السابق
          </Button>
          <span className="text-sm text-slate-700">
            صفحة {currentPage} من {pagination.totalPages || 1}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={currentPage >= (pagination.totalPages || 1) || paymentsQuery.isFetching}
            onClick={() => setCurrentPage((page) => page + 1)}
          >
            التالي
          </Button>
        </div>
      </div>
      <ConfirmDialog
        open={dialog?.type === "confirm"}
        title="تأكيد الدفعة"
        description="هل أنت متأكد من تعبئة هذه الدفعة؟"
        confirmText="تأكيد"
        tone="success"
        loading={confirmMutation.isPending}
        onClose={() => {
          if (!actionLoading) setDialog(null);
        }}
        onConfirm={() => dialog?.payment && confirmMutation.mutate(dialog.payment)}
      />
      <ConfirmDialog
        open={dialog?.type === "delete"}
        title="حذف الدفعة"
        description="هل أنت متأكد أنك تريد حذف هذه الدفعة؟ لا يمكن التراجع بعد ذلك."
        confirmText="حذف"
        tone="danger"
        loading={deleteMutation.isPending}
        onClose={() => {
          if (!actionLoading) setDialog(null);
        }}
        onConfirm={() => dialog?.payment && deleteMutation.mutate(dialog.payment)}
      />
      <Footer />
    </div>
  );
}
