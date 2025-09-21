import React, { useEffect, useState , useRef} from "react";
import Navbar from "../components/NavBar";
import axios from "axios";

export default function PaymentStatement() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
        const vantaRef = useRef(null);
      const [vantaEffect, setVantaEffect] = useState(null);
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
        if (!vantaEffect && window.VANTA) {
          setVantaEffect(
            window.VANTA.NET({
              el: vantaRef.current,
          color: 0x0f172a,
          backgroundColor: 0xeaeaea,
          points: 8.0,
          maxDistance: 20.0,
          spacing: 15.0,
            })
          );
        }
        return () => {
          if (vantaEffect) vantaEffect.destroy();
        };
      }, [vantaEffect]);


  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log(email)
        const res = await axios.get(`https://paynet-1.onrender.com/api/point/all?email=${email}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPayments(res.data);
      } catch (error) {
        console.error("فشل في جلب الدفعات:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  return (
    <div >
      <Navbar />
      <div ref={vantaRef} className="p-6 bg-gray-100 min-h-screen relative" dir="rtl">
        <div className="relative z-10">
          
          <h2 className="text-3xl font-bold mb-6 text-black text-center">البيان المالي للدفعات</h2>
          
          {loading ? (
            <p className="text-center text-gray-500">جاري تحميل البيانات...</p>
          ) : payments.length === 0 ? (
            <p className="text-center text-gray-500">لا توجد دفعات محفوظة.</p>
          ) : (
            <div className="overflow-x-auto">
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
                    <tr key={index} className="text-center border-b bg-[#00000050] hover:bg-gray-300">
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
          
        </div>      </div>
    </div>
  );
}
