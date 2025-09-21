import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/NavbarAdmin";

export default function AdminFinancialStatement() {
  const [confirmedPayments, setConfirmedPayments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // فلاتر البحث
  const [searchDate, setSearchDate] = useState("");
  const [searchLandline, setSearchLandline] = useState("");
  const [searchStatus, setSearchStatus] = useState("");

  useEffect(() => {
    fetchConfirmed();
  }, []);

  useEffect(() => {
    // عند تغيير البحث نعود للصفحة الأولى
    setCurrentPage(1);
  }, [searchLandline, searchDate, searchStatus]);

  const fetchConfirmed = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "https://paynet-1.onrender.com/api/admin/user/allconfirmed");

      setConfirmedPayments(res.data);
    } catch (err) {
      console.error("فشل في جلب البيانات:", err);
    }
  };

  // تصفية البيانات حسب الفلاتر
  const filteredPayments = confirmedPayments.filter((p) => {
    const landlineMatch = p.landline.includes(searchLandline);
    const statusMatch = searchStatus ? p.status === searchStatus : true;
    const dateMatch = searchDate
      ? new Date(p.updatedAt || p.createdAt)
          .toISOString()
          .split("T")[0] === searchDate
      : true;

    return landlineMatch && statusMatch && dateMatch;
  });

  // حساب الصفحات الحالية بعد التصفية
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPayments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="p-6 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-8">
          البيان المالي
        </h2>

        {/* واجهة البحث */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <input
            type="text"
            placeholder="بحث برقم الهاتف الأرضي"
            className="border p-2 rounded"
            value={searchLandline}
            onChange={(e) => setSearchLandline(e.target.value)}
          />
          <input
            type="date"
            className="border p-2 rounded"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
          />
          <select
            className="border p-2 rounded"
            value={searchStatus}
            onChange={(e) => setSearchStatus(e.target.value)}
          >
            <option value="">كل الحالات</option>
            <option value="تم التسديد">تم التسديد</option>
            <option value="غير مسددة">غير مسددة</option>
          </select>
        </div>

        <div className="overflow-x-auto shadow-md rounded-lg bg-white">
          <table className="min-w-full text-sm text-center text-gray-700">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-3 px-4">رقم أرضي</th>
                <th className="py-3 px-4">الشركة</th>
                <th className="py-3 px-4">السرعة</th>
                <th className="py-3 px-4">المبلغ</th>
                <th className="py-3 px-4">الحالة</th>
                <th className="py-3 px-4">صاحب العملية</th>
                <th className="py-3 px-4">تاريخ التسديد</th>
                <th className="py-3 px-4">ملاحظات</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((p) => (
                  <tr
                    key={p._id}
                    className="border-b hover:bg-gray-100 transition"
                  >
                    <td className="py-3 px-4">{p.landline}</td>
                    <td className="py-3 px-4">{p.company}</td>
                    <td className="py-3 px-4">{p.speed}</td>
                    <td className="py-3 px-4">
                      {p.amount.toLocaleString()} ل.س
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          p.status === "تم التسديد"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">{p.email}</td>
                    <td className="py-3 px-4">
                      {new Date(p.updatedAt || p.createdAt).toLocaleString(
                        "ar-SY",
                        {
                          dateStyle: "medium",
                          timeStyle: "short",
                        }
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {p.status === "غير مسددة" ? p.note || "—" : "—"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-6 text-gray-500">
                    لا توجد عمليات في البيان المالي حتى الآن.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* أزرار التنقل بين الصفحات */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-4 space-x-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === index + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
