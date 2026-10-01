import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, RefreshCw, Search, X } from "lucide-react";
import { ALRAGHEB_FALLBACK_IMAGE, getAlraghebImage } from "../../config/alraghebImages";

export const iconButtonClass = "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-zinc-300 bg-white text-zinc-700 transition hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 disabled:cursor-not-allowed disabled:opacity-40";
export const selectClass = "h-11 w-full min-w-0 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-800 focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600";

export function AlraghebImage({ item, className = "", priority = false }) {
  const source = getAlraghebImage(item);
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [source]);
  return <img src={failed ? ALRAGHEB_FALLBACK_IMAGE : source} alt="" className={className}
    onError={() => setFailed(true)} loading={priority ? "eager" : "lazy"} decoding="async" referrerPolicy="no-referrer" />;
}

export function Availability({ available }) {
  return <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${available ? "text-emerald-700" : "text-zinc-500"}`}>
    <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${available ? "bg-emerald-600" : "bg-zinc-400"}`} aria-hidden="true" />
    {available ? "متوفر لدى المزوّد" : "غير متوفر"}
  </span>;
}

export function CatalogSearch({ value, onChange, id = "chat-search" }) {
  return <div className="relative min-w-0">
    <label htmlFor={id} className="sr-only">البحث بالاسم أو رقم المنتج</label>
    <Search className="pointer-events-none absolute right-3 top-3 h-5 w-5 text-zinc-400" aria-hidden="true" />
    <input id={id} type="search" value={value} maxLength={120} onChange={(event) => onChange(event.target.value)}
      placeholder="اسم التطبيق أو رقم المنتج" className={`${selectClass} pl-11 pr-10`} />
    {value && <button type="button" onClick={() => onChange("")} aria-label="مسح البحث" title="مسح البحث"
      className="absolute left-1 top-1 flex h-9 w-9 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100">
      <X className="h-4 w-4" aria-hidden="true" />
    </button>}
  </div>;
}

export function CatalogPagination({ meta, onPage, busy }) {
  if (!meta?.total) return null;
  return <nav className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200 pt-4" aria-label="صفحات المنتجات">
    <p className="text-sm tabular-nums text-zinc-600">{(meta.page - 1) * meta.limit + 1} - {Math.min(meta.page * meta.limit, meta.total)} من {meta.total}</p>
    <div className="flex items-center gap-3">
      <button className={iconButtonClass} onClick={() => onPage(meta.page - 1)} disabled={meta.page <= 1 || busy} aria-label="الصفحة السابقة" title="الصفحة السابقة"><ChevronRight className="h-4 w-4" /></button>
      <span dir="ltr" className="min-w-16 text-center text-sm tabular-nums">{meta.page} / {meta.total_pages}</span>
      <button className={iconButtonClass} onClick={() => onPage(meta.page + 1)} disabled={meta.page >= meta.total_pages || busy} aria-label="الصفحة التالية" title="الصفحة التالية"><ChevronLeft className="h-4 w-4" /></button>
    </div>
  </nav>;
}

export function CatalogError({ error, onRetry }) {
  return <div role="alert" className="my-5 flex flex-wrap items-center justify-between gap-3 border-r-4 border-red-500 bg-red-50 px-4 py-3 text-sm text-red-800">
    <p className="min-w-0 flex-1">{error?.message || "تعذر تحميل المنتجات"}</p>
    <button className={iconButtonClass} onClick={onRetry} aria-label="إعادة المحاولة" title="إعادة المحاولة"><RefreshCw className="h-4 w-4" /></button>
  </div>;
}

export function CatalogSkeleton() {
  return <div role="status" aria-label="جاري تحميل التطبيقات" className="grid grid-cols-1 gap-3 min-[360px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {Array.from({ length: 12 }, (_, index) => <div key={index} className="h-48 animate-pulse rounded-lg border border-zinc-200 bg-white p-4">
      <div className="mb-4 h-16 w-16 rounded-md bg-zinc-100" /><div className="h-4 w-3/4 rounded bg-zinc-100" /><div className="mt-3 h-3 w-1/2 rounded bg-zinc-100" />
    </div>)}
  </div>;
}

export function CatalogFreshness({ meta }) {
  if (!meta?.synced_at) return null;
  return <p className={`text-xs leading-5 ${meta.stale ? "text-amber-800" : "text-zinc-500"}`} role={meta.stale ? "status" : undefined}>
    {meta.stale ? "تعذر التحديث، آخر بيانات متاحة: " : "آخر تحديث: "}
    <time dateTime={meta.synced_at}>{new Date(meta.synced_at).toLocaleString("ar-SY")}</time>
  </p>;
}
