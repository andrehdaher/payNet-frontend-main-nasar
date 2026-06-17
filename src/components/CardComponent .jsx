import React from "react";
import { Button } from "./Custom/Button";

const CardComponent = ({ title, description, buttonText, onClick, image }) => {
  return (
    <div className="m-2 flex max-w-xs flex-col rounded-lg border border-slate-200 bg-white p-6 text-slate-900 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <img src={image} alt={title || ""} className="mx-auto h-32 w-32 rounded-full object-cover" />

      <div className="mb-4 mt-4">
        <h2 className="text-center text-2xl font-bold tracking-wide font-arabic">{title}</h2>
      </div>
      <p className="mb-6 text-center text-sm leading-6 text-slate-700">{description}</p>
      <Button type="button" className="mt-auto w-full" onClick={onClick}>
        {buttonText}
      </Button>
    </div>
  );
};

export default CardComponent;
