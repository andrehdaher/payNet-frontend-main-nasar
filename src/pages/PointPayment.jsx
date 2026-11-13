import { PAYNET_BASE_URL } from "../api";
import DataFeedback from "../components/DataFeedback";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function PaymentStatement() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  function parseJwt(token) {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      return null;
    }
  }

  const token = localStorage.getItem("token");
  const decoded = parseJwt(token);
  const email = decoded?.email;





  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${PAYNET_BASE_URL}/api/point/all-point?email=${encodeURIComponent(email)}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPayments(res.data);
      } catch {
        setLoadError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  return (
    <div >
      <div className="paynet-point-surface" dir="rtl">
        <div className="relative z-10">

          <h1 className="page-title">البيان المالي للدفعات</h1>

          <DataFeedback loading={loading} error={loadError} empty={!payments.length}>
            <div className="table-scroll" role="region" aria-label="دفعات نقطة البيع" tabIndex={0}>
              <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden text-sm">
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
                    <tr key={index} className="text-center border-b bg-white hover:bg-gray-300">
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
          </DataFeedback>

        </div>
      </div>
    </div>
  );
}
