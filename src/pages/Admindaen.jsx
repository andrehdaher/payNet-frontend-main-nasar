import React, { useState } from "react";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle } from "lucide-react";
import Navbar from "../components/NavbarAdmin";
import Footer from "../components/Footer";
import Alert from "../components/Custom/Alert";
import ConfirmDialog from "../components/Custom/ConfirmDialog";
import { Button } from "../components/Custom/Button";
import { LoadingSkeleton } from "../components/Custom/LoadingSkeleton";
import { authConfig, fetchList, getApiErrorMessage, paymentQueryKeys } from "../api/paymentQueries";

export default function PaymentStatement() {
  const queryClient = useQueryClient();
  const [message, setMessage] = useState(null);
  const [dialog, setDialog] = useState(null);

  const paymentsQuery = useQuery({
    queryKey: paymentQueryKeys.adminDaen(),
    queryFn: () => fetchList("https://paynet-1.onrender.com/api/payment/save-number/api/admin/daen"),
  });

  const payments = paymentsQuery.data || [];

  const confirmMutation = useMutation({
    mutationFn: (payment) =>
      axios.post(
        "https://paynet-1.onrender.com/api/payment/save-number/api/admin/confirm-daen",
        {
          id: payment._id,
          email: payment.name,
          amount: payment.amount,
        },
        authConfig(),
      ),
    onMutate: async (payment) => {
      await queryClient.cancelQueries({ queryKey: paymentQueryKeys.adminDaen() });
      const previous = queryClient.getQueryData(paymentQueryKeys.adminDaen());
      queryClient.setQueryData(paymentQueryKeys.adminDaen(), (current = []) =>
        current.map((item) => (item._id === payment._id ? { ...item, status: true } : item)),
      );
      return { previous };
    },
    onSuccess: () => {
      setMessage({ type: "success", text: "تم تسديد الدفعة بنجاح." });
      setDialog(null);
    },
    onError: (error, _payment, context) => {
      if (context?.previous) queryClient.setQueryData(paymentQueryKeys.adminDaen(), context.previous);
      setMessage({ type: "error", text: getApiErrorMessage(error, "حدث خطأ أثناء تأكيد الدفعة.") });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: paymentQueryKeys.adminDaen() });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (payment) => axios.delete(`https://paynet-1.onrender.com/api/payment/save-number/api/admin/delete/${payment._id}`, authConfig()),
    onSuccess: () => {
      setMessage({ type: "success", text: "تم حذف الدفعة بنجاح." });
      setDialog(null);
      queryClient.invalidateQueries({ queryKey: paymentQueryKeys.adminDaen() });
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
                        disabled={payment.status || actionLoading}
                        variant={payment.status ? "success" : "danger"}
                        size="sm"
                      >
                        {payment.status && <CheckCircle className="h-4 w-4" aria-hidden="true" />}
                        {payment.status ? "تم التسديد" : "دين"}
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
      </div>
      <ConfirmDialog
        open={dialog?.type === "confirm"}
        title="تسديد الدفعة"
        description="هل أنت متأكد من تسديد هذه الدفعة؟"
        confirmText="تسديد"
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
