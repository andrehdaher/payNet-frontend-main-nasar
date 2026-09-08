import React from "react";
import { BadgeCheck, Box, ImageOff, Tag } from "lucide-react";
import { Button } from "../Custom/Button";

const getNumericPrice = (price) => {
  if (typeof price === "number") return Number.isFinite(price) ? price : null;

  const numericPrice = Number(String(price || "").replace(/[^0-9.-]/g, ""));
  return Number.isFinite(numericPrice) ? numericPrice : null;
};

const formatPriceAmount = (price) => {
  const numericPrice = getNumericPrice(price);

  if (numericPrice === null) return price || "";

  return numericPrice.toLocaleString("en-US", {
    maximumFractionDigits: 2,
  });
};

const getProviderLabel = (data) => {
  if (data.providerName) return data.providerName;
  if (data.isAleso) return "Aleso";
  if (data.isProWave || data.isProWaveDirectTopUp) return "منتج رقمي";

  return "";
};

const AppCard = ({ data, onClick }) => {
  const isProviderProduct = Boolean(data.isProWave || data.isProWaveDirectTopUp || data.isAleso);
  const priceLabel =
    data.formattedPrice ||
    (data.price !== undefined && data.price !== null
      ? `${formatPriceAmount(data.price)} ل.س`
      : "غير محدد");
  const oldPriceLabel =
    !isProviderProduct && data.formattedOldPrice && data.formattedOldPrice !== priceLabel
      ? data.formattedOldPrice
      : "";
  const isCheckingAvailability = Boolean(data.isCheckingAvailability);
  const availabilityBadge = (() => {
    if (!isProviderProduct) return null;
    if (isCheckingAvailability) {
      return { text: "جاري التحقق", className: "bg-amber-50 text-amber-800 ring-amber-200" };
    }
    if (data.availabilityStatus === "available") {
      return { text: "متوفر", className: "bg-emerald-50 text-emerald-800 ring-emerald-200" };
    }
    if (data.availabilityStatus === "unavailable") {
      return { text: "غير متوفر", className: "bg-red-50 text-red-800 ring-red-200" };
    }

    return { text: "يتحقق عند الشراء", className: "bg-slate-100 text-slate-700 ring-slate-200" };
  })();

  const buttonText = (() => {
    if (!isProviderProduct) return data.btntext || "عرض التفاصيل";
    if (isCheckingAvailability) return "جاري التحقق...";
    if (data.availabilityStatus === "unavailable") return data.btntext || "غير متوفر";
    if (data.availabilityStatus === "available") return data.btntext || "شراء";

    return "تحقق وشراء";
  })();

  const imageClassName = isProviderProduct
    ? "h-full w-full bg-white object-contain object-center p-5"
    : "h-full w-full object-cover object-center";
  const buttonVariant =
    data.availabilityStatus === "unavailable"
      ? "outline"
      : data.availabilityStatus === "available" || data.isProWaveDirectTopUp
        ? "success"
        : "default";
  const shortCode = data.name && data.name !== data.title ? data.name : "";
  const hasDescription = Boolean(data.des || data.description);
  const providerLabel = getProviderLabel(data);

  return (
    <article className="group flex h-full w-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white text-right shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-md">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        {data.image ? (
          <img
            src={data.image}
            alt={data.title}
            className={imageClassName}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-slate-500">
            <ImageOff className="h-8 w-8" aria-hidden="true" />
            <span className="text-sm font-semibold">لا توجد صورة</span>
          </div>
        )}

        <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          {shortCode ? (
            <span className={`max-w-[62%] truncate rounded-full px-3 py-1 text-xs font-bold text-white shadow-sm ${data.spanbg || "bg-slate-900/80"}`}>
              {shortCode}
            </span>
          ) : (
            <span aria-hidden="true" />
          )}

          {availabilityBadge && (
            <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold shadow-sm ring-1 ${availabilityBadge.className}`}>
              {availabilityBadge.text}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4 text-slate-900">
        <div className="min-h-[6.5rem]">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            {providerLabel && (
              <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2.5 py-1 text-xs font-bold text-violet-800 ring-1 ring-violet-100">
                <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
                {providerLabel}
              </span>
            )}
            {!isProviderProduct && data.discountLabel && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-800 ring-1 ring-amber-100">
                <Tag className="h-3.5 w-3.5" aria-hidden="true" />
                {data.discountLabel}
              </span>
            )}
          </div>

          <h3 className="line-clamp-2 text-lg font-bold leading-7 text-slate-900">
            {data.title}
          </h3>

          <p className="mt-2 line-clamp-2 min-h-12 text-sm leading-6 text-slate-600">
            {hasDescription ? data.des || data.description : "تفاصيل المنتج والسعر متاحة قبل إتمام الطلب."}
          </p>
        </div>

        <div className="mt-4 rounded-md border border-slate-100 bg-slate-50 px-3 py-2">
          <div className="flex items-start justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500">
              <Box className="h-3.5 w-3.5" aria-hidden="true" />
              السعر
            </span>
            <div className="flex flex-col items-end gap-1">
              {oldPriceLabel && (
                <span className="text-xs font-semibold text-slate-400 line-through">
                  {oldPriceLabel}
                </span>
              )}
              <span className="text-xl font-black leading-6 text-emerald-700">{priceLabel}</span>
              {data.priceUsd > 0 && isProviderProduct && (
                <span className="text-xs font-semibold text-slate-500">
                  {Number(data.priceUsd).toLocaleString("en-US", { maximumFractionDigits: 4 })} USD
                </span>
              )}
            </div>
          </div>
        </div>

        <Button
          type="button"
          onClick={() => onClick && onClick(data)}
          variant={buttonVariant}
          className="mt-4 w-full"
          loading={isCheckingAvailability}
        >
          {buttonText}
        </Button>
      </div>
    </article>
  );
};

export default AppCard;
