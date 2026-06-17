import React from "react";
import { Button } from "../Custom/Button";

const AppCard = ({ data, onClick }) => {
  return (
    <div className="w-full max-w-sm overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative flex h-44 w-full items-center justify-center overflow-hidden bg-slate-100 sm:h-56 md:h-48">
        {data.image ? (
          <img src={data.image} alt={data.title} className="h-full w-full object-cover object-center" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm font-medium text-slate-600">
            لا توجد صورة
          </div>
        )}

        {data.name && (
          <span className={`absolute right-3 top-3 ${data.spanbg || "bg-black/70"} rounded-full px-3 py-1 text-xs font-bold text-white`}>
            {data.name}
          </span>
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      <div className="space-y-3 p-4 text-slate-900">
        <h3 className="truncate text-lg font-bold">{data.title}</h3>

        <p className="max-h-20 overflow-hidden whitespace-pre-wrap text-sm leading-6 text-slate-700">
          {data.des}
        </p>

        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-slate-700">السعر:</span>
          <span className="font-bold text-emerald-700">{data.price} ل.س</span>
        </div>

        <Button type="button" onClick={() => onClick && onClick(data)} className="mt-4 w-full">
          {data.btntext || "عرض التفاصيل"}
        </Button>
      </div>
    </div>
  );
};

export default AppCard;
