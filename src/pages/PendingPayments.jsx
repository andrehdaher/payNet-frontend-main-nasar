import React, { useEffect, useState , useRef} from "react";
import axios from "axios";
import Navbar from "../components/NavBar";
import ScreenWrapper from "../components/ScreenWrapper";
import { Input } from "../components/Custom/Input";
import { Card, CardContent, CardHeader } from "../components/Custom/Card";
import DataTable from "../components/Custom/DataTable";

export default function PendingPayments() {
  const [pendingPayments, setPendingPayments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // فلاتر البحث
  const [searchDate, setSearchDate] = useState("");
  const [searchLandline, setSearchLandline] = useState("");


  useEffect(() => {
    fetchPending();
  }, []);

  useEffect(() => {
    setCurrentPage(1); // عند تغيير الفلاتر نبدأ من الصفحة الأولى
  }, [searchLandline, searchDate]);

  const fetchPending = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "https://paynet-1.onrender.com/api/admin/user/pending", // نفس API البيان المالي
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // تصفية البيانات داخل الـ useEffect
      const filtered = res.data.filter((p) => p.status === "جاري التسديد");
      setPendingPayments(filtered);
    } catch (err) {
      console.error("فشل في جلب البيانات:", err);
    }
  };

  // تصفية حسب البحث
  const filteredPayments = pendingPayments.filter((p) => {
    const landlineMatch = p.landline.includes(searchLandline);
    const dateMatch = searchDate
      ? new Date(p.updatedAt || p.createdAt)
          .toISOString()
          .split("T")[0] === searchDate
      : true;

    return landlineMatch && dateMatch;
  });

  // حساب بيانات الصفحة الحالية
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPayments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  const PinColumns = [
    { key: "landline", label: "رقم أرضي" },
    { key: "company", label: "الشركة" },
    { key: "speed", label: "السرعة" },
    { key: "amount", label: "المبلغ", render: (p) => `${p.amount.toLocaleString()} ل.س` },

    {
      key: "date",
      label: "تاريخ الطلب",
      render: (p) =>
        new Date(p.updatedAt || p.createdAt).toLocaleString("ar-SY", {
          dateStyle: "medium",
          timeStyle: "short",
        }),
    },
  ];

  return (
    <ScreenWrapper>
      <Card className="m-6">
        <CardHeader>
          <h2 className="text-3xl font-bold text-center text-gray-700">
            عمليات قيد التسديد
          </h2>
        </CardHeader>
        <CardContent>     
          {/* واجهة البحث */}
          <div className="grid grid-cols-2 gap-4 mb-6">
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
          </div>
          <DataTable 
            columns={PinColumns}
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
