import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Navbar from "../components/NavBar";
import { useNotification } from "../context/NotificationContext";
import ScreenWrapper from "../components/ScreenWrapper";
import DataTable from "../components/Custom/DataTable";
import { Input } from "../components/Custom/Input";
import { Card, CardCon, CardContent, CardHeader } from "../components/Custom/Card";



export default function FinancialStatement() {
  const [confirmedPayments, setConfirmedPayments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // فلاتر البحث
  const [searchDate, setSearchDate] = useState("");
  const [searchLandline, setSearchLandline] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const vantaRef = useRef(null);
  const {hasNewUnpaid, setHasNewUnpaid } = useNotification(); // ✅ Context
  
  useEffect(() => {
    fetchConfirmed();
  }, []);

  useEffect(() => {
    // عند تغيير البحث نعود للصفحة الأولى
    setCurrentPage(1);
  }, [searchLandline, searchDate, searchStatus, paymentFilter]);

  const fetchConfirmed = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "https://paynet-1.onrender.com/api/admin/user/confirmed",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },  
        }
      );

      setConfirmedPayments(res.data);
      setHasNewUnpaid(false);

    } catch (err) {
      console.error("فشل في جلب البيانات:", err);
    }
  };

  const handlePaymentTypeChange = async (id, newType) => {
    const confirm = window.confirm("هل انت متاكد من تعديل نوع الدفع")
    if(!confirm) return
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://paynet-1.onrender.com/api/admin/payment/${id}`,
        { paymentType: newType },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // تحديث الحالة محلياً بدون إعادة تحميل
      setConfirmedPayments((prev) =>
        prev.map((p) => (p._id === id ? { ...p, paymentType: newType } : p))
      );
    } catch (err) {
      console.error("فشل في تعديل نوع الدفع:", err);
      alert("حدث خطأ أثناء تعديل نوع الدفع");
    }
  };

  // تصفية البيانات حسب الفلاتر
  const filteredPayments = confirmedPayments.filter((p) => {
    const landlineMatch = p.landline.includes(searchLandline);
    const statusMatch = searchStatus ? p.status === searchStatus : true;
    const statusPayment = paymentFilter
      ? p.paymentType === paymentFilter
      : true;
    const dateMatch = searchDate
      ? new Date(p.updatedAt || p.createdAt).toISOString().split("T")[0] ===
        searchDate
      : true;

    return landlineMatch && statusMatch && dateMatch && statusPayment;
  });

  // حساب الصفحات الحالية بعد التصفية
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPayments.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };


  const FinColumns = [
    { key: "landline", label: "رقم أرضي" },
    { key: "company", label: "الشركة" },
    { key: "speed", label: "السرعة" },
    { key: "amount", label: "المبلغ", render: (p) => `${p.amount.toLocaleString()} ل.س` },
    {
      key: "paymentType",
      label: "نوع الدفع",
      render: (p) => (
        <select
          value={p.paymentType || ""}
          onChange={(e) => handlePaymentTypeChange(p._id, e.target.value)}
          className="border rounded p-1 bg-white text-sm"
        >
          <option value="cash">نقداً</option>
          <option value="credit">دين</option>
        </select>
      ),
    },
    {
      key: "status",
      label: "الحالة",
      render: (p) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            p.status === "تم التسديد"
              ? "bg-green-200 text-green-800"
              : "bg-red-200 text-red-800"
          }`}
        >
          {p.status}
        </span>
      ),
    },
    {
      key: "date",
      label: "تاريخ التسديد",
      render: (p) =>
        new Date(p.updatedAt || p.createdAt).toLocaleString("ar-SY", {
          dateStyle: "medium",
          timeStyle: "short",
        }),
    },
    {
      key: "note",
      label: "ملاحظات",
      render: (p) => (p.status === "غير مسددة" ? p.note || "—" : "—"),
    },
  ];

  return (
    <ScreenWrapper>
      <Card className="m-6">
        <CardHeader>
          <h2 className="text-3xl font-bold text-center text-gray-700">
            البيان المالي
          </h2>
        </CardHeader>
        <CardContent>
          {/* واجهة البحث */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 ">
            <Input
              label={'بحث'}
              type="text"
              placeholder="بحث برقم الهاتف الأرضي"
              className="p-2 border bg-[#00000045] placeholder:text-white text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-none text-base"
              value={searchLandline}
              onChange={(e) => setSearchLandline(e.target.value)}
            />
            <Input
              label={'تاريخ'}
              type="date"
              className="p-2 border bg-[#00000045] placeholder:text-white text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-none text-base"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
            />
            <div>
              <label className="block mb-1 mr-3 text-sm font-medium text-foreground">
                حالة التسديد
              </label>
              <select
                className="peer h-10 w-full text-foreground px-2 bg-foreground/10 border rounded-md border-foreground/50 outline-none"
                value={searchStatus}
                onChange={(e) => setSearchStatus(e.target.value)}
              >
                <option value="">كل الحالات</option>
                <option value="تم التسديد">تم التسديد</option>
                <option value="غير مسددة">غير مسددة</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 mr-3 text-sm font-medium text-foreground">
                حالة الدفع
              </label>
              <select
                className="peer h-10 w-full text-foreground px-2 bg-foreground/10 border rounded-md border-foreground/50 outline-none"
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
              >
                <option value="">كل الحالات</option>
                <option value="cash">نقداً</option>
                <option value="credit">دين</option>
              </select>
            </div>
          </div>
          <DataTable
            columns={FinColumns}
            data={currentItems}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </CardContent>
      </Card>
    </ScreenWrapper>
  );
}
