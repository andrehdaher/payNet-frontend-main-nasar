import React from "react";

export default function CardProduct({
  title,
  description,
  image,
  price,
  action,
  textButton,
}) {
  return (
    <div
      className="
        card bg-white w-80 mx-3
        shadow-md
        transition-all duration-300
        border border-gray-100
        hover:-translate-y-2 hover:shadow-xl
        rounded-2xl
        flex flex-col
        flex-shrink-0
      "
    >
      {/* الصورة */}
      <figure className="p-4">
        <img
          src={image}
          alt={title}
          className="rounded-xl h-48 w-full"
        />
      </figure>

      {/* المحتوى */}
      <div className="card-body p-5 flex flex-col flex-1">
        <h2 className="card-title text-lg font-semibold text-gray-800">
          {title}
        </h2>

        <p className="text-gray-500 text-sm ">
          {description}
        </p>

        {/* السعر + الزر (مثبت بالأسفل) */}
        <div className="flex items-center justify-between mt-auto pt-4">
          <span className="text-lg font-bold text-green-600">
            {price}$
          </span>

          <button
            onClick={action}
            className="
              
              btn btn-primary btn-sm
              px-4 py-2
              rounded-full
              bg-violet-600 text-white
              hover:scale-105
              transition-transform
            "
          >
            {textButton}
          </button>
        </div>
      </div>
    </div>
  );
}
