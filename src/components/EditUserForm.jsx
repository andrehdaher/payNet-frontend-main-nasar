import React, { useState, useEffect } from "react";
import axios from "axios";
import { useToast } from "../context/ToastContext";
import { Input } from "./Custom/Input";
import { Button } from "./Custom/Button";
import { apiUrl } from "../config/api";

export default function EditUserForm({ userId, onClose, onUpdate }) {
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    number: "",
    balance: "",
  });

  useEffect(() => {
    axios
      .get(apiUrl(`/api/admin/user/${userId}`))
      .then((res) => setUserData(res.data))
      .catch((err) => console.error("حدث خطأ في جلب المستخدم", err));
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await axios.put(apiUrl(`/api/admin/updateuser/${userId}`), userData);
      toast.success("تم التعديل بنجاح");
      onUpdate();
      onClose();
    } catch (err) {
      console.error("خطأ في التعديل", err);
      toast.error("حدث خطأ أثناء التعديل");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
      dir="rtl"
      role="presentation"
    >
      <div
        className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-user-title"
      >
        <h2 id="edit-user-title" className="mb-4 text-xl font-bold text-slate-900">
          تعديل المستخدم
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4" aria-busy={isSubmitting}>
          <Input id="edit-name" name="name" label="الاسم" value={userData.name} onChange={handleChange} required />
          <Input id="edit-email" name="email" label="البريد الإلكتروني" value={userData.email} onChange={handleChange} required />
          <Input id="edit-number" name="number" label="رقم الهاتف" value={userData.number} onChange={handleChange} required />
          <Input id="edit-balance" name="balance" label="الرصيد" value={userData.balance} onChange={handleChange} required />

          <div className="flex flex-col-reverse gap-2 sm:flex-row">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose} disabled={isSubmitting}>
              إلغاء
            </Button>
            <Button type="submit" className="flex-1" loading={isSubmitting}>
              تعديل
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
