import React, { useEffect, useRef, useState } from "react";
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import Navbar from "../components/NavBar";
import { Button } from "../components/Custom/Button";
import { LoadingSkeleton } from "../components/Custom/LoadingSkeleton";
import Alert from "../components/Custom/Alert";
import {
  fetchPaginated,
  getApiErrorMessage,
  getCurrentEmail,
  paymentQueryKeys,
} from "../api/paymentQueries";

export default function PaymentStatement() {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);
  const email = getCurrentEmail();

  useEffect(() => {
    if (!vantaEffect && window.VANTA) {
      setVantaEffect(
        window.VANTA.NET({
          el: vantaRef.current,
          color: 0x0f172a,
          backgroundColor: 0xeaeaea,
          points: 8.0,
          maxDistance: 20.0,
          spacing: 15.0,
        }),
      );
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  const queryParams = { email, page: currentPage, limit: 20 };
  const paymentsQuery = useQuery({
    queryKey: paymentQueryKeys.pointPayments(queryParams),
    queryFn: () =>
      fetchPaginated(`https://paynet-1.onrender.com/api/payment/save-number/api/point/all-point?email=${email}`, {
        page: currentPage,
        limit: 20,
      }),
    enabled: Boolean(email),
    placeholderData: keepPreviousData,
  });

  const payments = paymentsQuery.data?.data || [];
  const pagination = paymentsQuery.data?.pagination || { totalPages: 1 };

  useEffect(() => {
    if (email && currentPage < (pagination.totalPages || 1)) {
      const nextParams = { email, page: currentPage + 1, limit: 20 };
      queryClient.prefetchQuery({
        queryKey: paymentQueryKeys.pointPayments(nextParams),
        queryFn: () =>
          fetchPaginated(`https://paynet-1.onrender.com/api/payment/save-number/api/point/all-point?email=${email}`, {
            page: currentPage + 1,
            limit: 20,
          }),
      });
    }
  }, [currentPage, email, pagination.totalPages, queryClient]);

  return (
    <div>
      <Navbar />
      <div ref={vantaRef} className="relative min-h-screen bg-gray-100 p-6" dir="rtl">
        <div className="relative z-10">
          <h2 className="mb-6 text-center text-3xl font-bold text-black">البيان المالي للدفعات</h2>

          {paymentsQuery.isError && (
            <Alert type="error" className="mb-4">
              {getApiErrorMessage(paymentsQuery.error, "تعذر تحميل الدفعات.")}
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
                <thead className="bg-violet-600 text-white">
                  <tr>
                    <th className="p-3">الاسم</th>
                    <th className="p-3">الجهة</th>
                    <th className="p-3">الرقم</th>
                    <th className="p-3">صاحب العملية</th>
                    <th className="p-3">رقم الإشعار</th>
                    <th className="p-3">المبلغ</th>
                    <th className="p-3">التاريخ</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment, index) => (
                    <tr key={payment._id || index} className="border-b bg-[#00000050] text-center hover:bg-gray-300">
                      <td className="p-3">{payment.name}</td>
                      <td className="p-3">{payment.destination}</td>
                      <td className="p-3">{payment.number}</td>
                      <td className="p-3">{payment.operator}</td>
                      <td className="p-3">{payment.noticeNumber}</td>
                      <td className="p-3">{payment.amount}</td>
                      <td className="p-3">{payment.date?.substring(0, 10)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-4 flex items-center justify-center gap-3">
            <Button disabled={currentPage <= 1 || paymentsQuery.isFetching} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} variant="outline" size="sm">
              السابق
            </Button>
            <span>صفحة {currentPage} من {pagination.totalPages || 1}</span>
            <Button disabled={currentPage >= (pagination.totalPages || 1) || paymentsQuery.isFetching} onClick={() => setCurrentPage((p) => p + 1)} variant="outline" size="sm">
              التالي
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
