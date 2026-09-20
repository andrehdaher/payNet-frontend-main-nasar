import { ChevronDown, Eye, RefreshCw } from "lucide-react";
import { Button } from "../Custom/Button";
import Alert from "../Custom/Alert";
import { displayValue } from "./inquiryUtils";

function HistoryDetails({ row }) {
  if (!row.extraRows?.length) return null;

  return (
    <details className="group mt-2">
      <summary className="inline-flex cursor-pointer items-center gap-1 text-xs font-semibold text-violet-700">
        تفاصيل إضافية
        <ChevronDown className="h-3 w-3 transition-transform group-open:rotate-180" aria-hidden="true" />
      </summary>
      <div className="mt-2 space-y-1 rounded-lg bg-slate-50 p-2 text-xs leading-5 text-slate-600">
        {row.extraRows.map(([key, value]) => (
          <div key={key}>
            <span className="font-semibold">{key}: </span>
            <span dir="auto">{displayValue(value)}</span>
          </div>
        ))}
      </div>
    </details>
  );
}

function StatusPill({ status }) {
  return (
    <span className={`inline-flex rounded border px-2 py-0.5 text-[11px] font-semibold ${status?.className || "border-slate-200 bg-slate-50 text-slate-700"}`}>
      {status?.label || "غير محدد"}
    </span>
  );
}

function MobileHistory({ rows, onPay }) {
  return (
    <div className="divide-y divide-slate-100 md:hidden">
      {rows.map((row) => (
        <div key={row.id} className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="truncate text-sm font-bold text-slate-950">
                  {displayValue(row.subscriberName, "مشترك غير معروف")}
                </span>
                <span className="font-mono text-xs font-semibold text-violet-700" dir="ltr">
                  {displayValue(row.landline)}
                </span>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                <span>{displayValue(row.company)}</span>
                <span>•</span>
                <span dir="ltr">{displayValue(row.time)}</span>
              </div>
            </div>
            <div className="shrink-0 text-left">
              <div className="font-mono text-sm font-bold text-slate-950" dir="ltr">
                {displayValue(row.monthlyCost || row.packagePrice)}
              </div>
              <StatusPill status={row.status} />
            </div>
          </div>
          <HistoryDetails row={row} />
          {row.landline && row.company && (
            <button
              type="button"
              onClick={() => onPay(row.landline, row.company)}
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-violet-700 hover:text-violet-900"
            >
              <Eye className="h-3.5 w-3.5" aria-hidden="true" />
              إرسال للدفع
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

function DesktopHistory({ rows, onPay }) {
  return (
    <div className="hidden overflow-x-auto md:block">
      <table className="w-full border-collapse text-right text-xs">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 font-semibold text-slate-600">
            <th className="px-4 py-3">الشركة</th>
            <th className="px-4 py-3 font-mono">رقم المشترك</th>
            <th className="px-4 py-3">اسم المشترك</th>
            <th className="px-4 py-3">الكلفة الشهرية</th>
            <th className="px-4 py-3">الرصيد</th>
            <th className="px-4 py-3">الحالة</th>
            <th className="px-4 py-3">التاريخ والوقت</th>
            <th className="px-4 py-3 text-center">الإجراءات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-700">
          {rows.map((row) => (
            <tr key={row.id} className="align-top transition-colors hover:bg-violet-50/30">
              <td className="px-4 py-3.5 font-bold text-slate-950">
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-violet-700" aria-hidden="true" />
                  <span>{displayValue(row.company)}</span>
                </span>
              </td>
              <td className="px-4 py-3.5 font-mono font-bold text-violet-700" dir="ltr">
                {displayValue(row.landline)}
              </td>
              <td className="px-4 py-3.5 font-semibold text-slate-950">
                {displayValue(row.subscriberName, "مشترك غير معروف")}
                <HistoryDetails row={row} />
              </td>
              <td className="px-4 py-3.5 font-mono font-bold text-slate-950" dir="ltr">
                {displayValue(row.monthlyCost || row.packagePrice)}
              </td>
              <td className="px-4 py-3.5 font-mono text-slate-700" dir="ltr">
                {displayValue(row.balance)}
              </td>
              <td className="px-4 py-3.5">
                <StatusPill status={row.status} />
              </td>
              <td className="px-4 py-3.5 font-mono text-[11px] text-slate-500" dir="ltr">
                {[row.date, row.time].filter(Boolean).join(" ") || "-"}
              </td>
              <td className="px-4 py-3.5 text-center">
                {row.landline && row.company ? (
                  <button
                    type="button"
                    onClick={() => onPay(row.landline, row.company)}
                    className="inline-flex items-center gap-1 rounded px-2 py-1 font-medium text-violet-700 transition-colors hover:bg-violet-50 hover:text-violet-900"
                  >
                    <Eye className="h-4 w-4" aria-hidden="true" />
                    عرض
                  </button>
                ) : (
                  "-"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function InquiryHistory({
  rows,
  date,
  loading,
  error,
  onDateChange,
  onRefresh,
  onPay,
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 p-5 md:flex-row md:items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-950">سجل الاستعلامات</h2>
          <p className="mt-0.5 text-xs leading-5 text-slate-500">
            سجل العمليات والفواتير المستعلم عنها حسب التاريخ المحدد.
          </p>
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex items-center gap-2">
            <label htmlFor="history-date" className="text-xs font-medium text-slate-600">
              التاريخ:
            </label>
            <input
              id="history-date"
              type="date"
              value={date}
              onChange={(event) => onDateChange(event.target.value)}
              className="h-9 rounded-lg border border-slate-300 bg-slate-50 px-3 text-xs font-mono text-slate-800 outline-none transition-colors focus:border-violet-700 focus:bg-white focus:ring-2 focus:ring-violet-700/20"
            />
          </div>
          <Button type="button" variant="outline" size="sm" loading={loading} onClick={onRefresh}>
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            تحديث السجل
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4">
          <Alert type="error">{error}</Alert>
        </div>
      )}

      {loading ? (
        <p className="m-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
          جاري تحميل سجل الاستعلامات...
        </p>
      ) : rows.length === 0 ? (
        <p className="m-4 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-sm font-semibold text-slate-600">
          لا توجد ردود استعلام محفوظة لهذا التاريخ.
        </p>
      ) : (
        <>
          <MobileHistory rows={rows} onPay={onPay} />
          <DesktopHistory rows={rows} onPay={onPay} />
        </>
      )}
    </section>
  );
}
