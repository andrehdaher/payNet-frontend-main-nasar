import {
  ChevronDown,
  ClipboardCopy,
  CloudOff,
  Info,
  Printer,
  RefreshCw,
  SearchX,
  Send,
  UserRound,
  Verified,
} from "lucide-react";
import { Button } from "../Custom/Button";
import {
  displayValue,
  formatInquiryDetails,
  getInquiryStatus,
  normalizeInquiryResult,
  stringifyValue,
} from "./inquiryUtils";

function DetailTile({ label, value, ltr = false, tone = "default" }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
      <span className="mb-1 block text-[11px] leading-4 text-slate-500">{label}</span>
      <span
        className={`block break-words text-sm font-bold ${
          tone === "success" ? "text-emerald-700" : "text-slate-950"
        } ${ltr ? "font-mono" : ""}`}
        dir={ltr ? "ltr" : "rtl"}
      >
        {displayValue(value)}
      </span>
    </div>
  );
}

function EmptyResult() {
  return (
    <section className="flex min-h-[340px] items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
      <div>
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
          <UserRound className="h-7 w-7" aria-hidden="true" />
        </div>
        <h2 className="text-lg font-bold text-slate-950">جاهز للاستعلام</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
          اختر مزود الخدمة وأدخل رقم المشترك لعرض تفاصيل الاشتراك والتكلفة المستحقة هنا.
        </p>
      </div>
    </section>
  );
}

function LoadingResult() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm" aria-live="polite">
      <div className="animate-pulse space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-slate-200" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/3 rounded bg-slate-200" />
            <div className="h-3 w-1/4 rounded bg-slate-200" />
          </div>
        </div>
        <div className="h-24 rounded-xl bg-slate-100" />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <div className="h-16 rounded-lg bg-slate-100" />
          <div className="h-16 rounded-lg bg-slate-100" />
          <div className="h-16 rounded-lg bg-slate-100" />
          <div className="h-16 rounded-lg bg-slate-100" />
        </div>
      </div>
      <p className="mt-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900">
        جاري الاستعلام من المزود...
      </p>
    </section>
  );
}

function StateResult({ type, onNewInquiry }) {
  const isError = type === "error";
  const Icon = isError ? CloudOff : SearchX;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
      <div
        className={`mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full ${
          isError ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"
        }`}
      >
        <Icon className="h-7 w-7" aria-hidden="true" />
      </div>
      <h2 className="mb-1 text-base font-bold text-slate-800">
        {isError ? "تعذر الاتصال بخادم المزود" : "لم يتم العثور على اشتراك"}
      </h2>
      <p className="mx-auto mb-4 max-w-sm text-xs leading-6 text-slate-500">
        {isError
          ? "مزود الخدمة لم يستجب بالشكل المتوقع. يرجى إعادة المحاولة بعد لحظات."
          : "تأكد من اختيار مزود الخدمة المطابق ورقم الهاتف الأرضي أو كود المشترك وإعادة المحاولة."}
      </p>
      <Button type="button" onClick={onNewInquiry} className="bg-violet-700 hover:bg-violet-800">
        إعادة الاستعلام
      </Button>
    </section>
  );
}

export default function InquiryResult({
  data,
  isWaiting,
  selectedCompany,
  landline,
  onCopy,
  onNewInquiry,
  onPay,
}) {
  if (isWaiting) return <LoadingResult />;
  if (!data) return <EmptyResult />;

  const normalized = normalizeInquiryResult(data, {
    selectedCompany,
    landline,
  });
  const { summary, extraRows } = normalized;
  const status = getInquiryStatus(summary, data);

  if (status.key === "not-found") return <StateResult type="not-found" onNewInquiry={onNewInquiry} />;
  if (status.key === "error") return <StateResult type="error" onNewInquiry={onNewInquiry} />;

  const initials = stringifyValue(summary.subscriberName)
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("") || "؟";
  const copyText = formatInquiryDetails(data);

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col justify-between gap-4 border-b border-slate-100 bg-slate-50/50 p-5 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 shrink-0 select-none items-center justify-center rounded-xl bg-violet-100 text-base font-bold text-violet-700 shadow-sm">
            {initials}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-bold text-slate-950">
                {displayValue(summary.subscriberName, "مشترك غير معروف")}
              </h2>
              <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${status.className}`}>
                {status.label}
              </span>
              {summary.provider && (
                <span className="rounded-md border border-violet-200 bg-violet-50 px-2 py-0.5 text-xs font-medium text-violet-700">
                  {summary.provider}
                </span>
              )}
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-2.5 text-xs text-slate-500">
              <span>
                رقم المشترك:{" "}
                <strong className="font-mono font-bold text-slate-800" dir="ltr">
                  {displayValue(summary.subscriberNumber || landline)}
                </strong>
              </span>
              {summary.serviceType && (
                <>
                  <span className="text-slate-300">•</span>
                  <span>{summary.serviceType}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
          <Button type="button" variant="outline" size="sm" onClick={onNewInquiry}>
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            استعلام جديد
          </Button>
        </div>
      </div>

      <div className="border-b border-slate-100 bg-white p-5">
        <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <div className="mb-1 text-xs font-medium text-slate-500">الكلفة الشهرية المستحقة</div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-3xl font-black tracking-normal text-violet-700" dir="ltr">
                {displayValue(summary.monthlyCost)}
              </span>
              <span className="text-sm font-bold text-slate-700">ل.س</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 border-t border-slate-100 pt-2 sm:border-r sm:border-t-0 sm:pr-4 sm:pt-0">
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="text-slate-500">حالة الاشتراك:</span>
              <span className={`rounded border px-2 py-0.5 text-[11px] font-bold ${status.className}`}>
                {status.label}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="text-slate-500">الرصيد الحالي:</span>
              <span className="font-mono font-bold text-slate-800" dir="ltr">
                {displayValue(summary.outstandingBalance)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 bg-slate-50/50 p-5 sm:grid-cols-2 md:grid-cols-4">
        <DetailTile label="رقم الهاتف المرتبط" value={summary.telephoneNumber || summary.subscriberNumber || landline} ltr />
        <DetailTile label="نوع الخدمة" value={summary.serviceType} />
        <DetailTile label="المرحلة" value={summary.status || status.label} tone="success" />
        <DetailTile label="مجموعة الخدمات" value={summary.packageName} ltr />
      </div>

      <details className="group border-t border-slate-100 text-sm">
        <summary className="flex cursor-pointer select-none items-center justify-between p-4 transition-colors hover:bg-slate-50">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
            <Info className="h-4 w-4 text-violet-700" aria-hidden="true" />
            <span>تفاصيل إضافية عن الاشتراك والمزود</span>
          </div>
          <ChevronDown className="h-4 w-4 text-slate-400 transition-transform group-open:rotate-180" aria-hidden="true" />
        </summary>
        <div className="grid grid-cols-1 gap-3 border-t border-slate-100 bg-slate-50/60 p-4 text-xs text-slate-600 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["الحالة المالية", summary.financialStatus],
            ["تاريخ الانتهاء", summary.expirationDate],
            ["تاريخ الفاتورة القادمة", summary.nextInvoiceDate],
            ["سرعة الإنترنت", summary.internetSpeed],
            ["استهلاك البيانات", summary.dataUsage],
            ["الحصة المتبقية", summary.remainingQuota],
            ...extraRows,
          ].map(([key, value]) => (
            <div key={key} className="rounded-lg border border-slate-200/80 bg-white p-2.5">
              <span className="mb-0.5 block text-slate-400">{key}:</span>
              <strong className="break-words text-xs font-semibold text-slate-800" dir="auto">
                {displayValue(value)}
              </strong>
            </div>
          ))}
          {extraRows.length === 0 &&
            !summary.financialStatus &&
            !summary.expirationDate &&
            !summary.nextInvoiceDate &&
            !summary.internetSpeed &&
            !summary.dataUsage &&
            !summary.remainingQuota && (
              <div className="rounded-lg border border-dashed border-slate-300 bg-white p-3 text-slate-500">
                لا توجد تفاصيل إضافية مرسلة من المزود.
              </div>
            )}
        </div>
      </details>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 p-3.5 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <Verified className="h-4 w-4 text-emerald-700" aria-hidden="true" />
          <span>بيانات موثوقة ومحدثة من خادم المزود المركزي</span>
        </div>
        <Button type="button" variant="success" size="sm" onClick={onPay}>
          <Send className="h-4 w-4" aria-hidden="true" />
          إرسال الرقم إلى تسديد الإنترنت
        </Button>
      </div>
    </section>
  );
}
