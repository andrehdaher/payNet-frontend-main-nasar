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

      const res = await axios.get("https://paynet-1.onrender.com/api/saveBalance/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setConfirmedPayments(res.data);
      setHasNewUnpaid(false);

    } catch (err) {
      console.error("فشل في جلب البيانات:", err);
    }
  };

  // تصفية البيانات حسب الفلاتر
  const filteredPayments = confirmedPayments.filter((p) => {
    const landlineMatch = p.name.includes(searchLandline);
    const statusPayment = paymentFilter
      ? p.paymentType === paymentFilter
      : true;
    const dateMatch = searchDate
      ? new Date(p.updatedAt || p.createdAt).toISOString().split("T")[0] ===
        searchDate
      : true;

    return landlineMatch && dateMatch && statusPayment;
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
    { key: "name", label: "الاسم" },
    { key: "destination", label: "المستلم" },
    { key: "number", label: "الرقم" },
    { key: "operator", label: "نوع العملية" },
    { key: "noticeNumber", label: "رقم الاشعار" },
    { key: "amount", label: "المبلغ", render: (p) => `${p.amount.toLocaleString()} ل.س` },
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
           البيان المالي للدفعات
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
              onChange={(e) => setSearchLandline(e.target.value)}
            />
            <Input
              label={'تاريخ'}
              type="date"
              className="p-2 border bg-[#00000045] placeholder:text-white text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-none text-base"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
            />
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
