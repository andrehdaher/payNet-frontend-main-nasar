import { ArrowLeft, ImageOff, Layers } from "lucide-react";

export default function ServiceCard({
  title,
  description,
  image,
  imageFit = "cover",
  actionLabel = "عرض التفاصيل",
  onClick,
  tag,
  meta,
  priority = false,
  className = "",
}) {
  const isContainedImage = imageFit === "contain";
  const imageContainerClassName = isContainedImage
    ? "relative aspect-[4/3] w-full overflow-hidden bg-white"
    : "relative aspect-[4/3] w-full overflow-hidden bg-slate-100";
  const imageClassName = isContainedImage
    ? "h-full w-full object-contain p-5 transition-transform duration-300 group-hover:scale-[1.03]"
    : "h-full w-full object-cover transition-transform duration-300 group-hover:scale-105";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex h-full w-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white text-right shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 ${className}`}
      aria-label={`${actionLabel}: ${title}`}
    >
      <div className={imageContainerClassName}>
        {image ? (
          <img
            src={image}
            alt={title || ""}
            className={imageClassName}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={priority ? "high" : "auto"}
            referrerPolicy={image.startsWith?.("http") ? "no-referrer" : undefined}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-sm font-medium text-slate-600">
            <ImageOff className="h-5 w-5" aria-hidden="true" />
            لا توجد صورة
          </div>
        )}
        {tag && (
          <span className="absolute right-3 top-3 max-w-[70%] truncate rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-violet-800 shadow-sm ring-1 ring-violet-100">
            {tag}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="min-h-[7.75rem]">
          {meta && (
            <span className="mb-2 inline-flex max-w-full items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-600 ring-1 ring-slate-100">
              <Layers className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="truncate">{meta}</span>
            </span>
          )}
          <h3 className="line-clamp-2 text-lg font-bold leading-7 text-slate-900">{title}</h3>
          {description && <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-700">{description}</p>}
        </div>
        <span className="mt-auto inline-flex h-10 items-center justify-between gap-2 rounded-md bg-violet-50 px-3 text-sm font-bold text-violet-800 transition-colors duration-200 group-hover:bg-violet-100">
          <span>{actionLabel}</span>
          <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" aria-hidden="true" />
        </span>
      </div>
    </button>
  );
}
