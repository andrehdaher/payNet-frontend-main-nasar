import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Copy, X } from "lucide-react";
import { Button } from "../Custom/Button";
import { writeClipboardText } from "../../utils/clipboard";
import { normalizePaymentStatusLabel } from "../../utils/paymentStatus";

const DATA_PATHS = [
  ["response", "data"],
  ["data", "data"],
  ["data"],
  ["message", "data"],
  ["message"],
];

const readPath = (source, path) =>
  path.reduce(
    (value, key) => (value && value[key] !== undefined ? value[key] : undefined),
    source
  );

const isObject = (value) =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const pick = (...values) =>
  values.find((value) => value !== undefined && value !== null && value !== "");

const extractPayload = (response) => {
  for (const path of DATA_PATHS) {
    const value = readPath(response, path);
    if (value !== undefined && value !== null) return value;
  }

  return response || {};
};

const extractRequest = (payload) => {
  const request = pick(
    payload?.request,
    payload?.prowave_direct_topup_request,
    payload?.provider_response?.data?.request,
    payload?.provider_response?.message?.data?.request,
    payload
  );

  return isObject(request) ? request : {};
};

const formatValue = (value) => {
  if (value === undefined || value === null || value === "") return "-";
  if (typeof value === "object") return JSON.stringify(value, null, 2);
  return String(value);
};

export default function ProWaveDirectTopUpResultModal({
  open,
  onClose,
  result,
  title = "نتيجة الشحن المباشر",
}) {
  const [copied, setCopied] = useState(false);
  const payload = useMemo(() => extractPayload(result?.response || result), [result]);
  const request = useMemo(() => extractRequest(payload), [payload]);
  const requestName = pick(request.name, request.request_name, payload.name, payload.request_name);
  const status = normalizePaymentStatusLabel(
    pick(request.recharge_status, request.status, payload.recharge_status)
  );
  const rejectionReason = pick(
    request.rejection_reason,
    request.rejectionReason,
    payload.rejection_reason
  );
  const rows = [
    ["اسم الطلب", requestName],
    ["الحالة", status],
    ["اللعبة", pick(request.game, payload.game)],
    ["ID اللاعب", pick(request.player_id, payload.player_id)],
    ["الباقة", pick(request.recharge_category, payload.recharge_category)],
    ["الفاتورة", pick(request.sales_invoice, payload.sales_invoice)],
    ["المبلغ", payload.paynet_amount_syp ? `${payload.paynet_amount_syp} ل.س` : ""],
    ["الرصيد الجديد", payload.newBalance !== undefined ? `${payload.newBalance} ل.س` : ""],
    ["سبب الرفض", rejectionReason],
  ].filter(([, value]) => value !== undefined && value !== null && value !== "");

  const copyRequestName = async () => {
    if (!requestName) return;

    const didCopy = await writeClipboardText(requestName);
    if (didCopy) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          dir="rtl"
          role="presentation"
        >
          <motion.div
            onClick={(event) => event.stopPropagation()}
            initial={{ scale: 0.96, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 20 }}
            transition={{ duration: 0.18 }}
            className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-lg border border-slate-200 bg-white p-5 text-slate-900 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="prowave-direct-topup-result-title"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute left-4 top-4 rounded-md p-1 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
              aria-label="إغلاق نافذة نتيجة الشحن"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>

            <div className="mb-5 pl-10">
              <h2
                id="prowave-direct-topup-result-title"
                className="text-xl font-bold leading-7 text-slate-900"
              >
                {title}
              </h2>
              {status && (
                <p className="mt-1 text-sm font-semibold text-slate-600">
                  احتفظ باسم الطلب لمتابعة الحالة لاحقًا.
                </p>
              )}
            </div>

            <div className="grid gap-2">
              {rows.map(([label, value]) => (
                <div
                  key={label}
                  className="grid gap-1 rounded-md border border-slate-200 bg-slate-50 p-3 text-sm sm:grid-cols-[140px,1fr]"
                >
                  <span className="font-bold text-slate-600">{label}</span>
                  <span className="break-words font-semibold text-slate-950">
                    {formatValue(value)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                إغلاق
              </Button>
              <Button
                type="button"
                variant="success"
                onClick={copyRequestName}
                disabled={!requestName}
              >
                <Copy className="h-4 w-4" aria-hidden="true" />
                {copied ? "تم النسخ" : "نسخ اسم الطلب"}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
