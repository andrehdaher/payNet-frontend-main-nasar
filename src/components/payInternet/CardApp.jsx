import React from "react";

const AppCard = ({ data, onClick  }) => {
    return (
        <div
            className={`w-full max-w-sm ${data.bgdown}  rounded-2xl shadow-lg overflow-hidden border ${data.border} transform hover:scale-[1.02] transition-all duration-300`}
        >
            {/* Image */}
            <div className="w-full h-44 sm:h-56 md:h-48 bg-gray-800 overflow-hidden flex items-center justify-center relative">
                {data.image ? (
                    <img
                        src={data.image}
                        alt={data.title}
                        className="w-full h-full object-cover object-center"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No imagez
                    </div>
                )}

                {/* Badge */}
                {data.name && (
                    <span
                        className={`absolute top-3 right-3 ${data.spanbg || "bg-black/60"
                            } text-white text-xs px-3 py-1 rounded-full`}
                    >
                        {data.name}
                    </span>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
            </div>

            {/* Content */}
            <div className="p-4 space-y-3 text-white">
                <h3 className="text-lg font-semibold truncate">{data.title}</h3>

                <p className="text-sm text-gray-300 whitespace-pre-wrap max-h-20 overflow-hidden">
                    {data.des}
                </p>

                <div className="flex justify-between items-center text-sm">
                    <span className="text-black">السعر:</span>
                    <span className="font-bold text-green-400">
                        {data.price} ل.س
                    </span>
                </div>

                <button
                    onClick={() => onClick && onClick(data)}
                    className={`w-full mt-4 ${data.btnbg || "bg-violet-600"
                        } ${data.hoverbtn ? `hover:${data.hoverbtn}` : "hover:bg-violet-700"
                        } text-white py-2 rounded-xl font-medium transition`}
                >
                    {data.btntext || "عرض التفاصيل"}
                </button>
            </div>
        </div>
    );
};

export default AppCard;
