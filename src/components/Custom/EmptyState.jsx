import { Inbox } from "lucide-react";

export default function EmptyState({
  title = "لا توجد بيانات",
  description = "ستظهر البيانات هنا عند توفرها.",
  action,
  icon: Icon = Inbox,
  className = "",
}) {
  return (
    <div className={`flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50/80 px-4 py-10 text-center ${className}`}>
      <div className="mb-3 rounded-full bg-white p-3 text-slate-600 shadow-sm">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>
      <h3 className="text-base font-bold text-slate-900">{title}</h3>
      {description && <p className="mt-1 max-w-md text-sm leading-6 text-slate-700">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
