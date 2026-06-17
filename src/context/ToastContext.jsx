import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { CheckCircle, Info, AlertTriangle, XCircle, X } from "lucide-react";

const ToastContext = createContext(null);

const toastConfig = {
  success: {
    icon: CheckCircle,
    className: "border-emerald-300 bg-emerald-50 text-emerald-950",
    iconClassName: "text-emerald-700",
  },
  error: {
    icon: XCircle,
    className: "border-red-300 bg-red-50 text-red-950",
    iconClassName: "text-red-700",
  },
  warning: {
    icon: AlertTriangle,
    className: "border-amber-300 bg-amber-50 text-amber-950",
    iconClassName: "text-amber-700",
  },
  info: {
    icon: Info,
    className: "border-blue-300 bg-blue-50 text-blue-950",
    iconClassName: "text-blue-700",
  },
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }
  return context;
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const show = useCallback(
    ({ type = "info", title, message, duration = 4000 }) => {
      const id = `${Date.now()}-${Math.random()}`;
      const toast = { id, type, title, message };

      setToasts((current) => [toast, ...current].slice(0, 4));

      if (duration > 0) {
        window.setTimeout(() => dismiss(id), duration);
      }

      return id;
    },
    [dismiss],
  );

  const value = useMemo(
    () => ({
      show,
      dismiss,
      success: (message, options = {}) => show({ ...options, type: "success", message }),
      error: (message, options = {}) => show({ ...options, type: "error", message }),
      warning: (message, options = {}) => show({ ...options, type: "warning", message }),
      info: (message, options = {}) => show({ ...options, type: "info", message }),
    }),
    [dismiss, show],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed left-4 top-20 z-[11000] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3" dir="rtl">
        {toasts.map((toast) => {
          const config = toastConfig[toast.type] || toastConfig.info;
          const Icon = config.icon;
          const urgent = toast.type === "error" || toast.type === "warning";

          return (
            <div
              key={toast.id}
              className={`flex items-start gap-3 rounded-lg border p-3 shadow-lg backdrop-blur ${config.className}`}
              role={urgent ? "alert" : "status"}
              aria-live={urgent ? "assertive" : "polite"}
            >
              <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${config.iconClassName}`} aria-hidden="true" />
              <div className="min-w-0 flex-1">
                {toast.title && <p className="text-sm font-bold">{toast.title}</p>}
                <p className="text-sm leading-6">{toast.message}</p>
              </div>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                className="rounded-md p-1 opacity-75 transition-colors hover:bg-white/80 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                aria-label="إغلاق التنبيه"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
