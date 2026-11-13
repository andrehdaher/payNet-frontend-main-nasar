import { PAYNET_BASE_URL } from "../api";
import { useToast } from "../context/ToastContext";
import DataFeedback from "../components/DataFeedback";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

export default function AdminPending() {
  const toast = useToast();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    // 1. إنشاء الاتصال بالسيرفر عبر سوكيت
    const newSocket = io(PAYNET_BASE_URL); // عدّل الرابط إذا لزم
    setSocket(newSocket);

    // 2. الاستماع للتحديثات من السيرفر
    newSocket.on("pendingPaymentsUpdate", (updatedPayments) => {
      setPayments(updatedPayments);
      setLoadError(false);
    });

    // 3. تنظيف الاتصال عند إغلاق المكون
    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    setLoadError(false);
    try {
      const res = await axios.get(
        `${PAYNET_BASE_URL}/api/admin/pending`
      );
      setPayments(res.data);
    } catch (error) {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  const confirmPayment = async (id, landline, amount, company) => {
    const confirmed = window.confirm(
      `هل أنت متأكد من تسديد رقم (${landline}) بمبلغ (${amount} ل.س) لشركة (${company})؟`
    );

    if (!confirmed) return;

    try {
      await axios.patch(
        `${PAYNET_BASE_URL}/api/admin/confirm/${id}`
      );
      fetchPending(); // إعادة التحديث بعد التأكيد
    } catch (error) {
      toast.error("حدث خطأ أثناء تأكيد التسديد");
    }
  };

  const startPayment = async (id) => {
    const confirmed = window.confirm('هل انت متاكد من بدء التسديد');

    if (!confirmed) return;

    try {
      await axios.patch(
        `${PAYNET_BASE_URL}/api/admin/start/${id}`
      );
      fetchPending(); // إعادة التحديث بعد التأكيد
    } catch (error) {
      toast.error("حدث خطأ أثناء تأكيد التسديد");
      console.log(error)
    }
  };

  const rejectPayment = async (payment) => {
    const reason = prompt("يرجى إدخال سبب رفض العملية:");
    if (!reason) return;

    try {
      await axios.post(
        `${PAYNET_BASE_URL}/api/admin/reject/${payment._id}`,
        {
          email: payment.email,
          amount: payment.amount,
          reason,
        }
      );
      toast.success("تم رفض العملية وإرجاع الرصيد بنجاح.");
      fetchPending();
    } catch {
      toast.error("حدث خطأ أثناء رفض العملية");
    }
  };

  return (
    <div className="rounded-lg bg-gray-50 p-3 sm:p-6">
      <h1 className="page-title">
        عمليات قيد الترحيل
      </h1>

      <DataFeedback loading={loading} error={loadError}>
        <div className="table-scroll shadow-lg rounded-lg bg-white" role="region" aria-label="العمليات المعلقة" tabIndex={0}>
          <table className="min-w-full text-sm text-center text-gray-700">
            <thead className="bg-blue-600 text-white text-sm">
              <tr>
                <th className="py-3 px-4">البريد الإلكتروني</th>
                <th className="py-3 px-4">رقم أرضي</th>
                <th className="py-3 px-4">الشركة</th>
                <th className="py-3 px-4">السرعة</th>
                <th className="py-3 px-4">المبلغ</th>
                <th className="py-3 px-4">الحالة</th>
                <th className="py-3 px-4">الاجراء</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr
                  key={p._id}
                  className="border-b hover:bg-gray-100 transition duration-200"
                >
                  <td className="py-3 px-4">{p.email || "غير متوفر"}</td>
                  <td className="py-3 px-4">{p.landline}</td>
                  <td className="py-3 px-4">{p.company}</td>
                  <td className="py-3 px-4">{p.speed}</td>
                  <td className="py-3 px-4">{p.amount.toLocaleString()} ل.س</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${p.status === "جاري التسديد"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                        }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() =>
                        confirmPayment(p._id, p.landline, p.amount, p.company)
                      }
                      className="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-1.5 rounded transition"
                    >
                      تأكيد التسديد
                    </button>
                    <button
                      onClick={() => rejectPayment(p)}
                      className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-4 mx-1 py-1.5 rounded transition"
                    >
                      رفض العملية
                    </button>
                    <button
                      onClick={() => startPayment(p._id)}
                      className="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 mx-1 py-1.5 rounded transition"
                    >
                      بدء التنفيذ
                    </button>
                  </td>
                </tr>
              ))}

              {payments.length === 0 && (
                <tr>
                  <td colSpan="7" className="py-6 text-gray-500">
                    لا توجد عمليات قيد الترحيل حاليًا.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </DataFeedback>
    </div>
  );
}
