import React, { useState } from "react";
import { Button } from "./Button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function DataTable({
  columns = [],
  data = [],
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => { },
  onRowClick = () => { },
  pageSize = 10,
  onPageSizeChange = () => { },
}) {
  const pageSizeOptions = [5, 10, 20, 50, 100];

  return (
    <div className="bg-white shadow-md rounded-xl overflow-hidden">
      {/* جعل الجدول قابل للتمرير على الشاشات الصغيرة */}
      <div className="overflow-x-auto">

        <table className="w-full text-sm text-gray-700">
          <thead className="bg-gray-100 text-xs uppercase text-gray-600">
            <tr>
              {columns.map((col) =>
                col.hidden ? null : (
                  <th
                    key={col.key}
                    className="px-4 py-3 text-center whitespace-nowrap"
                  >
                    {col.label}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((row, idx) => (
                <tr
                  key={idx}
                  onClick={() => onRowClick(row)} // ✅ استدعاء الدالة عند الضغط
                  className={`border-b hover:bg-gray-50 transition text-center cursor-pointer
                    ${row.source === "batch" ? "bg-blue-200 hover:bg-blue-300" : "hover:bg-gray-50"}
                    `}


                >
                  {columns.map((col) =>
                    col.hidden ? null : (
                      <td
                        key={col.key}
                        className="px-4 py-3 whitespace-nowrap"
                      >
                        {col.key === "createdAt" ? (
                          new Date(row[col.key]).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })
                        ) : typeof col.render === "function" ? (
                          col.render(row)
                        ) : (
                          row[col.key]
                        )}
                      </td>
                    )
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-6 text-gray-500 text-center"
                >
                  لا توجد بيانات
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div dir="rtl" className="flex flex-wrap justify-center items-center gap-2 py-3">

        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">عدد الاسطر :</span>
            <select
              className="border rounded px-2 py-1 text-sm"
              value={pageSize}
              onChange={(e) => {
                const newSize = Number(e.target.value);
                onPageSizeChange(newSize);
                onPageChange(1); // رجوع للصفحة الأولى
              }}
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >

              <ChevronRight className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
