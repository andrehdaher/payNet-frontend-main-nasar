import React, { useState } from "react";
import ScreenWrapper from "../components/ScreenWrapper";
import { Button } from "../components/Custom/Button";
import DataTable from "../components/Custom/DataTable";
import AddSaveNum from "../components/AddSaveNum";

export default function Notebooks() {
  const [selectedRows, setSelectedRows] = useState([]);
    const [showForm, setShowForm] = useState(false); // ✅ حالة لعرض النموذج


  // بيانات تجريبية (بدّلها لاحقاً ببيانات API)
  const sampleData = [
    {
      id: 1,
      number: "0111234567",
      company: "Syriatel",
      createdAt: "2025-09-01T08:30:00Z",
      updatedAt: "2025-09-05T12:45:00Z",
      amount: 25000,
      speed: "20 Mbps",
    },
    {
      id: 2,
      number: "0117654321",
      company: "MTN",
      createdAt: "2025-09-02T09:00:00Z",
      updatedAt: "2025-09-06T14:20:00Z",
      amount: 40000,
      speed: "50 Mbps",
    },
  ];

  // تعريف الأعمدة
  const notebookColumns = [
    {
      key: "select",
      label: "✔",
      render: (row) => (
        <input
          type="checkbox"
          checked={selectedRows.includes(row.id)}
          onChange={() => {
            if (selectedRows.includes(row.id)) {
              setSelectedRows(selectedRows.filter((id) => id !== row.id));
            } else {
              setSelectedRows([...selectedRows, row.id]);
            }
          }}
        />
      ),
    },
    { key: "number", label: "الرقم" },
    { key: "company", label: "الشركة" },
    {
      key: "createdAt",
      label: "تاريخ الإنشاء",
      render: (row) =>
        new Date(row.createdAt).toLocaleDateString("ar-SY", {
          dateStyle: "medium",
        }),
    },
    {
      key: "updatedAt",
      label: "تاريخ التسديد",
      render: (row) =>
        new Date(row.updatedAt).toLocaleDateString("ar-SY", {
          dateStyle: "medium",
        }),
    },
    {
      key: "amount",
      label: "المبلغ",
      render: (row) => `${row.amount.toLocaleString()} ل.س`,
    },
    { key: "speed", label: "السرعة" },
  ];

  return (
    <div>
      <ScreenWrapper>
        <div className="flex flex-col items-center justify-center space-y-4">
          <h1 className="text-xl font-bold text-center">
            اضافة الارقام التي يتم تسديدها بشكل دائم
          </h1>
          <div className="w-full flex justify-end px-4">
            <Button
             className="bg-violet-400 text-white" 
             variant="outline"
             onClick={()=>{setShowForm(true)}}
             >
              اضافة رقم
            </Button>
          </div>

          {showForm && (
            
            <AddSaveNum  onClose={()=>{setShowForm(false)}}/>
          )}
          {/* ✅ الجدول أسفل الزر */}
          <div className="w-full px-4">
            <DataTable
              columns={notebookColumns}
              data={sampleData}
              currentPage={1}
              totalPages={1}
              onPageChange={() => {}}
            />
          </div>
        </div>
      </ScreenWrapper>
    </div>
  );
}
