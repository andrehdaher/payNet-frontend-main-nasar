import React, { useState } from "react";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useToast } from "../context/ToastContext";
import { Input } from "./Custom/Input";
import { Button } from "./Custom/Button";
import {
  authConfig,
  getApiErrorMessage,
  getCurrentEmail,
  paymentQueryKeys,
} from "../api/paymentQueries";
import { apiUrl } from "../config/api";

export default function AddSaveNum({ onClose, onSuccess }) {
  const toast = useToast();
  const queryClient = useQueryClient();
  const email = getCurrentEmail();
  const [formData, setFormData] = useState({
    name: "",
    number: "",
    company: "",
    date: "",
    amount: "",
    speed: "",
    email,
  });

  const companies = [
    "ناس",
    "برونت",
    "اينت",
    "رنت",
    "الكم",
    "ليما",
    "سوا",
    "اية",
    "يارا",
    "بطاقات",
    "هايبر",
    "ويف",
    "امنية",
    "فيو",
    "ليزر",
    "متس",
    "سما",
    "زاد",
    "دنيا",
    "هاي فاي",
    "تكامل",
    "لاين",
    "الجمعية",
  ];

  const speeds = [
    "512 Mbps   السعر 14000",
    "1 Mbps     السعر 18500",
    "2 Mbps     السعر 24000",
    "4 Mbps     السعر 38000",
    "8 Mbps     السعر 64000",
    "16 Mbps   السعر  83000",
  ];

  const saveMutation = useMutation({
    mutationFn: () =>
      axios.post(
        apiUrl("/api/payment/save-number"),
        { ...formData, email },
        authConfig(),
      ),
    onSuccess: () => {
      toast.success("تم حفظ الرقم بنجاح");
      queryClient.invalidateQueries({ queryKey: paymentQueryKeys.savedNumbers(email) });
      setFormData({
        name: "",
        number: "",
        company: "",
        date: "",
        amount: "",
        speed: "",
        email,
      });
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "تعذر حفظ الرقم."));
    },
  });

  const selectClass =
    "h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition-colors focus:border-violet-500 focus:ring-2 focus:ring-violet-500";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate();
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      onClick={saveMutation.isPending ? undefined : onClose}
      dir="rtl"
      role="presentation"
    >
      <div
        className="z-[10000] w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-save-number-title"
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <h1 id="add-save-number-title" className="text-lg font-bold text-slate-900">
            إضافة رقم
          </h1>
          <button
            type="button"
            onClick={onClose}
            disabled={saveMutation.isPending}
            className="rounded-md p-1 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 disabled:opacity-60"
            aria-label="إغلاق النافذة"
          >
            <AiOutlineCloseCircle className="text-xl" aria-hidden="true" />
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit} aria-busy={saveMutation.isPending}>
          <Input id="saved-name" name="name" label="الاسم" value={formData.name} onChange={handleChange} required />
          <Input id="saved-number" name="number" type="number" label="الرقم" value={formData.number} onChange={handleChange} required />

          <div className="space-y-1 text-right">
            <label htmlFor="saved-company" className="block text-sm font-semibold text-slate-700">
              الشركة
            </label>
            <select id="saved-company" name="company" className={selectClass} required value={formData.company} onChange={handleChange}>
              <option value="">اختر الشركة</option>
              {companies.map((company) => (
                <option key={company} value={company}>
                  {company}
                </option>
              ))}
            </select>
          </div>

          <Input id="saved-date" name="date" type="date" label="تاريخ التسديد" value={formData.date} onChange={handleChange} required />
          <Input id="saved-amount" name="amount" type="number" label="المبلغ" value={formData.amount} onChange={handleChange} required />

          <div className="space-y-1 text-right">
            <label htmlFor="saved-speed" className="block text-sm font-semibold text-slate-700">
              السرعة
            </label>
            <select id="saved-speed" name="speed" className={selectClass} required value={formData.speed} onChange={handleChange}>
              <option value="">اختر السرعة</option>
              {speeds.map((speed) => (
                <option key={speed} value={speed}>
                  {speed}
                </option>
              ))}
            </select>
          </div>

          <Button type="submit" className="w-full" variant="success" loading={saveMutation.isPending}>
            حفظ
          </Button>
        </form>
      </div>
    </div>
  );
}
