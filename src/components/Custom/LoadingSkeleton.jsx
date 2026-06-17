export function LoadingSkeleton({ rows = 5, className = "" }) {
  return (
    <div className={`space-y-3 ${className}`} aria-label="جاري التحميل" role="status">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="h-12 animate-pulse rounded-md bg-slate-200/80" />
      ))}
    </div>
  );
}

export function CardSkeleton({ count = 6 }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="جاري تحميل البطاقات" role="status">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="h-36 animate-pulse rounded-md bg-slate-200" />
          <div className="mt-4 h-5 w-2/3 animate-pulse rounded bg-slate-200" />
          <div className="mt-2 h-4 w-full animate-pulse rounded bg-slate-100" />
          <div className="mt-2 h-4 w-4/5 animate-pulse rounded bg-slate-100" />
        </div>
      ))}
    </div>
  );
}
