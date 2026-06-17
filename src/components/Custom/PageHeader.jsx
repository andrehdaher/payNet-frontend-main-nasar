import { ArrowRight } from "lucide-react";
import { Button } from "./Button";

export default function PageHeader({
  title,
  description,
  actions,
  backLabel = "رجوع",
  onBack,
  stats = [],
  className = "",
}) {
  return (
    <section
      className={`mb-6 rounded-lg border border-slate-200 bg-white/95 p-4 shadow-sm transition-shadow duration-200 sm:p-5 ${className}`}
      dir="rtl"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 space-y-2">
          {onBack && (
            <Button type="button" variant="ghost" size="sm" onClick={onBack} className="px-2">
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
              {backLabel}
            </Button>
          )}
          <div>
            <h1 className="text-2xl font-bold leading-9 text-slate-900 sm:text-3xl">{title}</h1>
            {description && (
              <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-700">{description}</p>
            )}
          </div>
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>

      {stats.length > 0 && (
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-md border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-semibold text-slate-600">{stat.label}</p>
              <p className={`mt-1 text-lg font-bold ${stat.tone === "danger" ? "text-red-700" : "text-slate-900"}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
