import { AlertTriangle, CheckCircle, X } from "lucide-react";
import { Button } from "./Button";

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmText = "تأكيد",
  cancelText = "إلغاء",
  tone = "default",
  loading = false,
  onConfirm,
  onClose,
  children,
}) {
  if (!open) return null;

  const confirmVariant = tone === "danger" ? "danger" : tone === "success" ? "success" : "default";
  const ToneIcon = tone === "success" ? CheckCircle : AlertTriangle;
  const iconClassName =
    tone === "danger"
      ? "bg-red-100 text-red-700"
      : tone === "success"
        ? "bg-emerald-100 text-emerald-700"
        : "bg-violet-100 text-violet-700";

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      dir="rtl"
      role="presentation"
    >
      <div
        className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-5 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby={description ? "confirm-dialog-description" : undefined}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-3">
            <div
              className={`mt-1 rounded-full p-2 ${iconClassName}`}
            >
              <ToneIcon className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h2 id="confirm-dialog-title" className="text-lg font-bold text-slate-900">
                {title}
              </h2>
              {description && (
                <p id="confirm-dialog-description" className="mt-1 text-sm leading-6 text-slate-700">
                  {description}
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
            aria-label="إغلاق النافذة"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {children && <div className="mt-4">{children}</div>}

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row">
          <Button type="button" variant="outline" className="flex-1" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button type="button" variant={confirmVariant} className="flex-1" onClick={onConfirm} loading={loading}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
