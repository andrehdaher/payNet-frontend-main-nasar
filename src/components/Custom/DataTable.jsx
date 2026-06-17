import { Button } from "./Button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import EmptyState from "./EmptyState";
import { LoadingSkeleton } from "./LoadingSkeleton";

export default function DataTable({
  columns = [],
  data = [],
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => {},
  onRowClick,
  pageSize = 10,
  onPageSizeChange = () => {},
  loading = false,
  updating = false,
  emptyTitle = "لا توجد بيانات",
  emptyDescription = "لم يتم العثور على عناصر لعرضها.",
}) {
  const pageSizeOptions = [5, 10, 20, 50, 100];
  const visibleColumns = columns.filter((col) => !col.hidden);
  const hasRowClick = typeof onRowClick === "function";

  return (
    <div
      className="relative overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
      aria-busy={loading || updating}
    >
      {!loading && updating && (
        <div className="absolute inset-x-0 top-0 z-10 h-1 overflow-hidden bg-violet-100" role="status" aria-label="جاري تحديث الجدول">
          <div className="h-full w-1/3 animate-pulse rounded-full bg-violet-600" />
        </div>
      )}
      {loading ? (
        <div className="p-4">
          <LoadingSkeleton rows={6} />
        </div>
      ) : data.length === 0 ? (
        <div className="p-4">
          <EmptyState title={emptyTitle} description={emptyDescription} />
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm text-slate-700">
              <thead className="bg-slate-100 text-xs font-bold text-slate-700">
                <tr>
                  {visibleColumns.map((col) => (
                    <th
                      key={col.key}
                      scope="col"
                      className="whitespace-nowrap px-4 py-3 text-center"
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.map((row, idx) => (
                  <tr
                    key={row._id || row.id || idx}
                    onClick={hasRowClick ? () => onRowClick(row) : undefined}
                    className={`text-center transition-colors duration-150 ${
                      hasRowClick ? "cursor-pointer hover:bg-violet-50/80" : ""
                    } ${row.source === "batch" ? "bg-blue-50" : ""}`}
                  >
                    {visibleColumns.map((col) => (
                      <td
                        key={col.key}
                        className="whitespace-nowrap px-4 py-3 align-middle text-slate-800"
                      >
                        {col.key === "createdAt" ? (
                          new Date(row[col.key]).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })
                        ) : typeof col.render === "function" ? (
                          col.render(row, idx)
                        ) : (
                          row[col.key]
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div dir="rtl" className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-4 py-3">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              عدد الأسطر:
              <select
                className="h-9 rounded-md border border-slate-300 bg-white px-2 text-sm text-slate-900 outline-none transition-colors focus:border-violet-500 focus:ring-2 focus:ring-violet-500"
                value={pageSize}
                disabled={updating}
                onChange={(e) => {
                  const newSize = Number(e.target.value);
                  onPageSizeChange(newSize);
                  onPageChange(1);
                }}
                aria-label="عدد الأسطر في الصفحة"
              >
                {pageSizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </label>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1 || updating}
                aria-label="الصفحة السابقة"
              >
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Button>
              <span className="min-w-24 text-center text-sm font-medium text-slate-700" aria-live="polite">
                صفحة {currentPage} من {totalPages || 1}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0 || updating}
                aria-label="الصفحة التالية"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
