import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { min } from "three/tsl";

export default function PurchaseModal({
    open,
    onClose,
    onConfirm,
    title,
    price,
    name,

    placeholder = "ادخل القيمة",
    confirmText = "شراء",
    cancelText = "إلغاء",
}) {
      const [mainValue, setMainValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
    const [loading, setLoading] = useState(false);
  const handleConfirm = async () => {
    // لا نسمح بالتأكيد إذا كانت القيم فارغة أو جاري التنفيذ
    if ((name && name.includes("oldAccount") && (!mainValue || !passwordValue)) || (!name.includes("oldAccount") && !mainValue) || loading) {
      return;
    }

    try {
      setLoading(true);

      // نرسل كائن القيم الصحيح حسب نوع الحساب
      const dataToSend = name && name.includes("oldAccount")
        ? { value: mainValue, password: passwordValue }
        : { value: mainValue };

      await onConfirm(dataToSend);

      // إعادة تهيئة الحقول
      setMainValue("");
      setPasswordValue("");
    } finally {
      setLoading(false);
    }
  };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        onClick={(e) => e.stopPropagation()}
                        initial={{ scale: 0.8, opacity: 0, y: 40 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: 40 }}
                        transition={{ type: "spring", stiffness: 260, damping: 22 }}
                        className="bg-[#0f172a] w-full max-w-md rounded-3xl p-6 space-y-6 text-white relative shadow-2xl border border-white/10"
                    >
                        {/* السعر */}
                        <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-700 to-blue-500 px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
                            ل.س {price}
                        </div>

                        {/* العنوان */}
                        <h2 className="text-xl font-bold text-right tracking-wide">
                            {title}
                        </h2>

                        {/* Input */}
                        <input
                            type="text"
                            placeholder={placeholder}
                            value={mainValue}
                            onChange={(e) => setMainValue(e.target.value)}
                            className="w-full bg-gray-800/80 border border-gray-700 rounded-full px-5 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 text-right transition-all duration-200"
                        />
                        {name && name.includes('oldAccount') ?
                            <input
                                type="text"
                                placeholder='باسورد حساب الشات'
                                value={passwordValue}
                                onChange={(e) => setPasswordValue(e.target.value)}
                                className="w-full bg-gray-800/80 border border-gray-700 rounded-full px-5 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 text-right transition-all duration-200"
                            /> : null}


                        {/* Buttons */}
                        <div className="flex gap-4">
                            <button
                                onClick={handleConfirm}
                                disabled={loading}
                                className="flex-1 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-60 disabled:cursor-not-allowed rounded-full py-3 transition-all duration-200 font-semibold flex items-center justify-center gap-2"
                            >
                                {loading && (
                                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                )}
                                {loading ? "جاري التنفيذ..." : confirmText}
                            </button>

                            <button
                                onClick={onClose}
                                disabled={loading}
                                className="flex-1 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-full py-3 transition-all duration-200 font-semibold"
                            >
                                {cancelText}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}