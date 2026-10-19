import React from "react";

export default function Maintenance() {
    return (
        <div
            className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-600 to-blue-900"
            dir="rtl"
        >
            <div className="text-center px-6">
                {/* Main Icon */}
                <div className="mb-8">
                    <svg
                        className="w-32 h-32 mx-auto text-white opacity-80"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                    </svg>
                </div>

                {/* Main Title */}
                <h1 className="text-5xl font-bold text-white mb-4">الموقع متوقف الآن</h1>

                {/* Subtitle */}
                <p className="text-2xl text-blue-100 mb-8">نعتذر عن أي إزعاج</p>

                {/* Description */}
                <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-8 mb-8 max-w-md mx-auto">
                    <p className="text-white text-lg mb-4">
                        🔧 نحن نجري عملية صيانة دورية لتحسين خدماتنا
                    </p>
                    <p className="text-blue-100 text-base">
                        سيكون الموقع متاحاً قريباً جداً. شكراً لصبرك وتفهمك!
                    </p>
                </div>

                {/* Support Info */}
                <div className="text-white mt-8">
                    <p className="text-sm mb-2">هل لديك استفسار؟</p>
                    <p className="text-base font-semibold text-blue-100">
                        تواصل معنا عبر البريد الإلكتروني أو رقم الهاتف
                    </p>
                </div>

                {/* Footer */}
                <div className="mt-12 text-blue-200 text-sm">
                    <p>© 2026 جميع الحقوق محفوظة</p>
                </div>
            </div>
        </div>
    );
}
