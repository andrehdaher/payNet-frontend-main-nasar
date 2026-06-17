import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "../Custom/Button";
import { Input } from "../Custom/Input";

export default function PurchaseModal({
  open,
  onClose,
  onConfirm,
  title,
  price,
  name,
  placeholder = "أدخل القيمة",
  confirmText = "شراء",
  cancelText = "إلغاء",
  loading: externalLoading = false,
}) {
  const [mainValue, setMainValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [internalLoading, setInternalLoading] = useState(false);
  const needsPassword = name && name.includes("oldAccount");
  const loading = externalLoading || internalLoading;

  const handleConfirm = async () => {
    if ((needsPassword && (!mainValue || !passwordValue)) || (!needsPassword && !mainValue) || loading) return;

    try {
      setInternalLoading(true);
      const dataToSend = needsPassword ? { value: mainValue, password: passwordValue } : { value: mainValue };
      await onConfirm(dataToSend);
      setMainValue("");
      setPasswordValue("");
    } finally {
      setInternalLoading(false);
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
          onClick={loading ? undefined : onClose}
          dir="rtl"
          role="presentation"
        >
          <motion.div
            onClick={(event) => event.stopPropagation()}
            initial={{ scale: 0.96, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 20 }}
            transition={{ duration: 0.18 }}
            className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg border border-slate-200 bg-white p-5 text-slate-900 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="purchase-modal-title"
            aria-busy={loading}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="absolute left-4 top-4 rounded-md p-1 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 disabled:opacity-60"
              aria-label="إغلاق نافذة الشراء"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>

            <div className="mb-5">
              <span className="inline-flex rounded-full bg-violet-100 px-3 py-1 text-sm font-bold text-violet-900">
                {price} ل.س
              </span>
              <h2 id="purchase-modal-title" className="mt-3 text-xl font-bold leading-7 text-slate-900">
                {title}
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-700">
                أدخل البيانات المطلوبة لإتمام الطلب.
              </p>
            </div>

            <div className="space-y-4">
              <Input
                id="purchase-value"
                label={placeholder}
                value={mainValue}
                onChange={(event) => setMainValue(event.target.value)}
                required
              />
              {needsPassword && (
                <Input
                  id="purchase-password"
                  label="باسورد حساب الشات"
                  value={passwordValue}
                  onChange={(event) => setPasswordValue(event.target.value)}
                  required
                />
              )}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-2">
              <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                {cancelText}
              </Button>
              <Button type="button" variant="success" onClick={handleConfirm} loading={loading}>
                {loading ? "جاري التنفيذ..." : confirmText}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
