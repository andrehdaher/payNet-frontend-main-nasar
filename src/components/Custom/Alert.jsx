export default function Alert({ type = "info", children, className = "", title }) {
  const styles = {
    info: "border-blue-300 bg-blue-50 text-blue-900",
    success: "border-emerald-300 bg-emerald-50 text-emerald-900",
    error: "border-red-300 bg-red-50 text-red-900",
    warning: "border-amber-300 bg-amber-50 text-amber-900",
  };

  return (
    <div
      role={type === "error" || type === "warning" ? "alert" : "status"}
      className={`rounded-md border px-4 py-3 text-sm font-semibold leading-6 shadow-sm ${styles[type] || styles.info} ${className}`}
    >
      {title && <p className="mb-1 font-bold">{title}</p>}
      {children}
    </div>
  );
}
