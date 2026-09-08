import { normalizePaymentStatusLabel } from "../../utils/paymentStatus";

const statusMap = [
  { keys: ["تم التسديد", "completed", "confirmed", "تم التأكيد", "مطابقة"], className: "bg-emerald-100 text-emerald-900 ring-emerald-300" },
  { keys: ["جاري التسديد", "pending", "processing", "بدء التسديد", "قيد التنفيذ"], className: "bg-amber-100 text-amber-900 ring-amber-300" },
  { keys: ["غير مسددة", "rejected", "failed", "دين", "فرق", "mismatch"], className: "bg-red-100 text-red-900 ring-red-300" },
  { keys: ["refunded", "مرجعة"], className: "bg-blue-100 text-blue-900 ring-blue-300" },
  { keys: ["cash", "نقدا", "نقداً"], className: "bg-blue-100 text-blue-900 ring-blue-300" },
  { keys: ["credit"], className: "bg-violet-100 text-violet-900 ring-violet-300" },
];

export default function StatusBadge({ value, children, className = "" }) {
  const rawText = children || value || "غير محدد";
  const text = typeof rawText === "string" ? normalizePaymentStatusLabel(rawText) : rawText;
  const normalized = String(text).trim();
  const match = statusMap.find((item) => item.keys.some((key) => normalized.includes(key)));

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${match?.className || "bg-slate-100 text-slate-800 ring-slate-300"} ${className}`}
    >
      {text}
    </span>
  );
}
