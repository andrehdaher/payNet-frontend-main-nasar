import { PAYNET_BASE_URL } from "../api";
import { useToast } from "../context/ToastContext";
import DataFeedback from "../components/DataFeedback";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function PaymentStatement() {
  const toast = useToast();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [confirmedPayments, setConfirmedPayments] = useState({});

  const fetchPayments = async () => {
    try {
      const res = await axios.get(
        `${PAYNET_BASE_URL}/api/saveBalance/all-admin`
      );
      setPayments(res.data);
    } catch (error) {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchPayments();
  }, []);


  const confirmPaymentInBackend = async (payment) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${PAYNET_BASE_URL}/api/admin/confirm-payment`,
        {
          id: payment._id,
          email: payment.name, // أو يمكن تغيير الحقل حسب اسم الحقل الحقيقي للبريد
          amount: payment.amount,
        }
      );

      return res.data;
    } catch (error) {
      console.error("فشل تأكيد الدفعة:", error);
      toast.error("حدث خطأ أثناء تأكيد الدفعة.");
    }
  };

  const handleConfirm = async (payment, index) => {
    const confirmed = window.confirm("هل أنت متأكد من تعبئة الدفعة؟");
    if (!confirmed) return;

    const result = await confirmPaymentInBackend(payment);
    if (result?.success) {
      setPayments((prev) =>
        prev.map((p, i) => (i === index ? { ...p, isConfirmed: true } : p))
      );
    }
  };

  const deleterecharge = async (id) => {
    const confirmed = window.confirm("هل أنت متأكد أنك تريد حذف هذه الدفعة؟ لا يمكن التراجع بعد ذلك.");
    if (!confirmed) return;

    try {
      await axios.delete(`${PAYNET_BASE_URL}/api/admin/delete/${id}`)
      toast.success("تم حذف الدفعة بنجاح")
      fetchPayments();


    } catch (err) {
      console.log(err)
    }

  };

  return (
    <div>
      <div className="p-3 sm:p-6 bg-gray-100 rounded-lg" dir="rtl">
        <h1 className="page-title">
          البيان المالي للدفعات
        </h1>

        <DataFeedback loading={loading} error={loadError} empty={!payments.length}>
          <div className="table-scroll" role="region" aria-label="البيان المالي للدفعات" tabIndex={0}>
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden text-sm">
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
                  <tr
                    key={index}
                    className="text-center border-b hover:bg-gray-100"
                  >
                    <td className="p-3">{payment.name}</td>
                    <td className="p-3">{payment.destination}</td>
                    <td className="p-3">{payment.number}</td>
                    <td className="p-3">{payment.operator}</td>
                    <td className="p-3">{payment.noticeNumber}</td>
                    <td className="p-3">{payment.amount}</td>
                    <td className="p-3">{payment.date?.substring(0, 10)}</td>
                    <td className="p-3">
                      <button
                        onClick={() => handleConfirm(payment, index)}
                        disabled={payment.isConfirmed}
                        className={`px-3 py-1 rounded text-white font-medium ${payment.isConfirmed ? "bg-green-600" : "bg-red-600"
                          }`}
                      >
                        {payment.isConfirmed ? "تم التأكيد" : "تأكيد"}
                      </button>
                      <button
                        onClick={() => { deleterecharge(payment._id) }}
                        className="bg-red-700 text-white px-2 py-1 rounded mx-2"
                      >
                        حذف الدفعة
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DataFeedback>
      </div>
    </div>
  );
}
