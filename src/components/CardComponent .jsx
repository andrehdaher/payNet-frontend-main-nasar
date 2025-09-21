import React from 'react';

const CardComponent = ({ title, description, buttonText, onClick , image}) => {
  return (
    <div className="max-w-xs transform transition-transform duration-300 hover:translate-y-2 hover:scale-105 hover:shadow-xl  p-6 rounded-md shadow-md  bg-[#00000050]  text-[#ffffffd3] border-none m-2">
      	<img src={image} 
        alt="" 
        className="w-32 h-32 mx-auto rounded-full dark:bg-gray-500 aspect-square" />

      <div className="mb-4">
        <h2 className="text-2xl text-center font-semibold tracking-wide font-arabic">{title}</h2>
      </div>
      <p className="text-[#ffffffed] text-center mb-6">{description}</p>
      <button
        className="w-full bg-violet-700 text-white py-3 rounded-lg hover:bg-purple-800 transition duration-300 text-lg"
        onClick={onClick}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default CardComponent;
