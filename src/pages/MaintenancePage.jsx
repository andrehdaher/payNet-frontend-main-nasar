import React from "react";

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 px-4">
      <div className="bg-white max-w-xl w-full rounded-2xl shadow-xl p-8 text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center">
            <span className="text-4xl">⚠️</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
          الموقع متوقف مؤقتًا
        </h1>

        {/* Message */}
        <p className="text-gray-600 leading-relaxed mb-6">
          عملاؤنا الكرام،
          <br />
          نود إعلامكم بأنه تم إيقاف الموقع مؤقتًا بسبب إجراء تعديلات على نظام العملة
          لضمان تقديم خدمة أفضل وأكثر دقة.
        </p>

        <p className="text-gray-600 leading-relaxed mb-8">
          نعتذر عن أي إزعاج قد يسببه هذا الأمر، وسنعود للعمل في أقرب وقت ممكن.
          <br />
          شكرًا لتفهمكم وثقتكم بنا 🙏
        </p>

        {/* Footer */}
        <div className="border-t pt-4 text-sm text-gray-400">
          © {new Date().getFullYear()} Daher.Net — جميع الحقوق محفوظة
        </div>
      </div>
    </div>
  );
}
