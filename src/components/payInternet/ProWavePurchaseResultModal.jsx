import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Copy, X } from "lucide-react";
import { Button } from "../Custom/Button";
import { writeClipboardText } from "../../utils/clipboard";

const DATA_PATHS = [
  ["response", "data", "message", "data"],
  ["response", "data"],
  ["data", "message", "data"],
  ["message", "data"],
  ["data", "data"],
  ["data", "message"],
  ["data"],
  ["message"],
];

const CODE_KEYS = [
  "code",
  "pin",
  "card_number",
  "cardNumber",
  "code_id",
  "codeId",
  "serial",
  "digital_code",
  "digitalCode",
  "voucher",
  "username",
  "email",
  "password",
  "replay",
  "reply",
  "message",
];

const CODE_LIST_PATHS = [
  ["digital_codes"],
  ["digitalCodes"],
  ["digital_code"],
  ["digitalCode"],
  ["codes"],
  ["cards"],
  ["items"],
  ["replay_api"],
  ["replayApi"],
  ["order", "replay_api"],
  ["order", "replayApi"],
  ["aleso_order_data", "replay_api"],
  ["aleso_order_data", "replayApi"],
  ["aleso_response", "data", "replay_api"],
  ["prowave_codes_response", "message", "data", "digital_codes"],
  ["prowave_codes_response", "data", "digital_codes"],
  ["prowave_codes_response", "digital_codes"],
  ["prowave_codes_response", "codes"],
  ["prowave_response", "message", "data", "digital_codes"],
  ["prowave_response", "data", "digital_codes"],
  ["prowave_response", "digital_codes"],
  ["prowave_response", "codes"],
  ["prowave_purchase_data", "digital_codes"],
  ["prowave_purchase_data", "codes"],
];

const HIDDEN_RESULT_KEYS = new Set([
  "price",
  "amount",
  "total_amount",
  "Total Amount",
  "totalAmount",
  "grand_total",
  "rounded_total",
  "prowave_total_amount_usd",
  "price_list_rate",
  "price_without_discount",
  "discount_percent",
  "formatted_discount_percent",
  "provider_cost_usd",
  "provider_unit_cost_usd",
  "prowave_unit_cost_usd",
  "provider_discount_usd",
  "provider_discount_percent",
  "prowave_provider_discount_usd",
  "prowave_provider_discount_percent",
]);

const LABELS = {
  code: "الكود",
  value: "القيمة",
  digital_codes: "الأكواد",
  digital_code: "الكود",
  digitalCode: "الكود",
  serial: "السيريال",
  pin: "PIN",
  card_number: "رقم البطاقة",
  cardNumber: "رقم البطاقة",
  code_id: "code id",
  codeId: "code id",
  username: "اسم المستخدم",
  password: "كلمة المرور",
  voucher: "الكود",
  expiry_date: "تاريخ الانتهاء",
  expiration_date: "تاريخ الانتهاء",
  status: "الحالة",
};

const readPath = (source, path) =>
  path.reduce(
    (value, key) => (value && value[key] !== undefined ? value[key] : undefined),
    source
  );

const isObject = (value) =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const extractPayload = (response) => {
  for (const path of DATA_PATHS) {
    const value = readPath(response, path);
    if (value !== undefined && value !== null) return value;
  }

  return response || {};
};

const hasCodeFields = (item) =>
  isObject(item) && CODE_KEYS.some((key) => item[key] !== undefined && item[key] !== null && item[key] !== "");

const normalizeCodeList = (value) => {
  if (value === undefined || value === null || value === "") return [];
  if (Array.isArray(value)) return value.filter((item) => item !== undefined && item !== null && item !== "");
  if (!isObject(value)) return [value];
  if (hasCodeFields(value)) return [value];

  return Object.values(value).filter((item) => item !== undefined && item !== null && item !== "");
};

const findList = (payload) => {
  if (Array.isArray(payload)) return payload;

  for (const path of CODE_LIST_PATHS) {
    const list = normalizeCodeList(readPath(payload, path));
    if (list.length) return list;
  }

  return hasCodeFields(payload) ? [payload] : [];
};

const sanitizeResultItem = (item) => {
  if (!item || typeof item !== "object" || Array.isArray(item)) return item;

  return Object.fromEntries(
    Object.entries(item).filter(([key]) => !HIDDEN_RESULT_KEYS.has(key))
  );
};

const formatLabel = (key) => LABELS[key] || key.replace(/_/g, " ");

const formatValue = (value) => {
  if (value === undefined || value === null || value === "") return "-";
  if (typeof value === "object") return JSON.stringify(value, null, 2);
  return String(value);
};

const getEntries = (item) => {
  if (!item || typeof item !== "object" || Array.isArray(item)) {
    return [["value", item]];
  }

  return Object.entries(item).filter(
    ([key, value]) =>
      !HIDDEN_RESULT_KEYS.has(key) &&
      value !== undefined &&
      value !== null &&
      value !== ""
  );
};

const getCodeText = (item) => {
  if (!item || typeof item !== "object") return formatValue(item);

  const codeLines = CODE_KEYS
    .map((key) => item[key])
    .filter((value) => value !== undefined && value !== null && value !== "")
    .map(formatValue);

  return codeLines.length ? codeLines.join("\n") : formatValue(item);
};

export default function ProWavePurchaseResultModal({
  open,
  onClose,
  result,
  title = "بيانات الشراء",
}) {
  const [copied, setCopied] = useState(false);
  const [copiedCodeIndex, setCopiedCodeIndex] = useState(null);
  const payload = useMemo(() => extractPayload(result?.response || result), [result]);
  const list = useMemo(
    () => findList(payload).map(sanitizeResultItem),
    [payload]
  );
  const rawText = useMemo(() => JSON.stringify(list, null, 2), [list]);

  const copyResult = async () => {
    const didCopy = await writeClipboardText(rawText);

    if (didCopy) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    }
  };

  const copyCode = async (item, index) => {
    const didCopy = await writeClipboardText(getCodeText(item));

    if (didCopy) {
      setCopiedCodeIndex(index);
      window.setTimeout(() => setCopiedCodeIndex(null), 1600);
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
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-slate-200 bg-white p-5 text-slate-900 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="prowave-result-title"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute left-4 top-4 rounded-md p-1 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
              aria-label="إغلاق نافذة بيانات الشراء"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>

            <div className="mb-5 pl-10">
              <h2 id="prowave-result-title" className="text-xl font-bold leading-7 text-slate-900">
                {title}
              </h2>
            </div>

            <div className="space-y-3">
              {list.length > 0 ? (
                list.map((item, index) => (
                  <div key={index} className="rounded-md border border-slate-200 bg-slate-50 p-3">
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-bold text-slate-800">بيانات الكود {index + 1}</p>
                      <button
                        type="button"
                        onClick={() => copyCode(item, index)}
                        className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100"
                      >
                        <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                        {copiedCodeIndex === index ? "تم النسخ" : "نسخ الكود"}
                      </button>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {getEntries(item).map(([key, value]) => (
                        <div key={key} className="rounded-md bg-white p-3 text-sm">
                          <p className="font-bold text-slate-600">{formatLabel(key)}</p>
                          <pre className="mt-1 whitespace-pre-wrap break-words font-sans font-semibold text-slate-950">
                            {formatValue(value)}
                          </pre>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-center text-sm font-bold text-amber-800">
                  لا توجد بيانات كود في رد المزوّد.
                </div>
              )}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                إغلاق
              </Button>
              <Button type="button" variant="success" onClick={copyResult}>
                <Copy className="h-4 w-4" aria-hidden="true" />
                {copied ? "تم النسخ" : "نسخ بيانات الكود"}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
