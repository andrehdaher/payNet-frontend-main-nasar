import { ArrowLeft, ImageOff } from "lucide-react";

export default function ServiceCard({
  title,
  description,
  image,
  actionLabel = "عرض التفاصيل",
  onClick,
  tag,
  className = "",
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex h-full w-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white text-right shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 ${className}`}
      aria-label={`${actionLabel}: ${title}`}
    >
      <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100">
        {image ? (
          <img
            src={image}
            alt={title || ""}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center gap-2 text-sm font-medium text-slate-600">
            <ImageOff className="h-5 w-5" aria-hidden="true" />
            لا توجد صورة
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        {tag && <span className="mb-2 text-xs font-bold text-violet-700">{tag}</span>}
        <h3 className="text-lg font-bold leading-7 text-slate-900">{title}</h3>
        {description && <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-700">{description}</p>}
        <span className="mt-auto inline-flex items-center gap-2 pt-4 text-sm font-bold text-violet-700">
          {actionLabel}
          <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" aria-hidden="true" />
        </span>
      </div>
    </button>
  );
}
