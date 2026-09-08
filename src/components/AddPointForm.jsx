import React, { useState, useEffect } from "react";
import axios from "axios";
import { useToast } from "../context/ToastContext";
import { Input } from "./Custom/Input";
import { Button } from "./Custom/Button";
import { apiUrl } from "../config/api";

export default function AddPointForm({ onClose }) {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  function parseJwt(token) {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      return null;
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const decoded = parseJwt(token);
    if (decoded?.email) setEmail(decoded.email);
  }, []);

  const [formData, setFormData] = useState({
    username: "",
    agent: "",
    owner: "",
    password: "",
    nember: "",
    createdAt: new Date().toISOString().split("T")[0],
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onClose();
  };

  const handelSave = async () => {
    try {
      setLoading(true);
      await axios.post(apiUrl("/api/point/add-point"), { formData, email });
      toast.success("تمت إضافة نقطة البيع بنجاح");
    } catch (err) {
      console.error(err);
      toast.error("البريد الإلكتروني موجود مسبقاً");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      dir="rtl"
      role="presentation"
    >
      <div
        className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-point-title"
      >
        <h2 id="add-point-title" className="mb-4 text-center text-xl font-bold text-slate-900">
          إضافة نقطة بيع
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3" aria-busy={loading}>
          <Input
            id="point-username"
            name="username"
            label="اسم المستخدم"
            value={formData.username}
            onChange={handleChange}
          />
          <Input
            id="point-password"
            name="password"
            label="كلمة المرور"
            value={formData.password}
            onChange={handleChange}
          />
          <Input
            id="point-number"
            name="number"
            label="رقم الخليوي"
            value={formData.number}
            onChange={handleChange}
          />
          <Input
            id="point-agent"
            name="agent"
            label="الوكيل"
            value={email}
            onChange={handleChange}
          />
          <Input
            id="point-owner"
            name="owner"
            label="صاحب النقطة"
            value={formData.owner}
            onChange={handleChange}
          />

          <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row">
            <Button type="button" onClick={onClose} variant="outline" className="flex-1">
              إلغاء
            </Button>
            <Button type="submit" className="flex-1" onClick={handelSave} loading={loading}>
              {loading ? "جاري الحفظ..." : "حفظ"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
