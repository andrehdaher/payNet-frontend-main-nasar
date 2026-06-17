import React from "react";
import { Button } from "./Custom/Button";

export default function CardProduct({
  title,
  description,
  image,
  price,
  action,
  textButton,
}) {
  return (
    <div className="flex w-full max-w-xs flex-shrink-0 flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <figure className="p-4">
        <img src={image} alt={title} className="h-48 w-full rounded-md object-cover" />
      </figure>

      <div className="flex flex-1 flex-col p-5">
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>

        <p className="mt-2 text-sm leading-6 text-slate-700">{description}</p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <span className="text-lg font-bold text-emerald-700">{price}$</span>

          <Button type="button" onClick={action} size="sm">
            {textButton}
          </Button>
        </div>
      </div>
    </div>
  );
}
