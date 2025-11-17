import React from "react";

export default function CardProduct({ title, description, image, price, action, textButton }) {
  return (
    <div className="card bg-white w-80 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 rounded-2xl flex-shrink-0">
      <figure className="p-4">
        <img src={image} alt={title} className="rounded-xl h-48 w-full object-cover" />
      </figure>
      <div className="card-body p-5">
        <h2 className="card-title text-lg font-semibold text-gray-800">{title}</h2>
        <p className="text-gray-500 text-sm">{description}</p>

        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-bold text-green-600">{price}$</span>
          <button
            onClick={action}
            className="btn btn-primary btn-sm px-4 rounded-full hover:scale-105 transition-transform"
          >
            {textButton}
          </button>
        </div>
      </div>
    </div>
  );
}
