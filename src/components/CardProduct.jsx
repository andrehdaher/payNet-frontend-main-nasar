import React, { memo, useState } from "react";
import { ImageOff, MessageCircle } from "lucide-react";
import { Button } from "./Custom/Button";

function formatPrice(price) {
  const numericPrice = Number(price);

  if (!Number.isFinite(numericPrice)) {
    return price || "-";
  }

  return numericPrice.toLocaleString("en-US", {
    maximumFractionDigits: 2,
  });
}

function CardProduct({
  title,
  description,
  image,
  price,
  action,
  textButton,
  priority = false,
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const productTitle = title || "منتج";

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <figure className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        {!imageLoaded && !imageFailed && (
          <div className="absolute inset-0 animate-pulse bg-slate-200" aria-hidden="true" />
        )}

        {imageFailed || !image ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-slate-500">
            <ImageOff className="h-8 w-8" aria-hidden="true" />
            <span className="text-sm font-semibold">الصورة غير متاحة</span>
          </div>
        ) : (
          <img
            src={image}
            alt={productTitle}
            className={`h-full w-full object-contain p-3 transition-opacity duration-300 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={priority ? "high" : "auto"}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageFailed(true)}
          />
        )}
      </figure>

      <div className="flex flex-1 flex-col p-5">
        <h2 className="line-clamp-2 min-h-[3.5rem] text-lg font-bold leading-7 text-slate-900">{productTitle}</h2>

        <p className="mt-2 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-slate-700">
          {description || "لا يوجد وصف متاح لهذا المنتج."}
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <span className="text-lg font-bold text-emerald-700">{formatPrice(price)}$</span>

          <Button type="button" onClick={action} size="sm" variant="accent" className="shrink-0">
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            {textButton}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default memo(CardProduct);
