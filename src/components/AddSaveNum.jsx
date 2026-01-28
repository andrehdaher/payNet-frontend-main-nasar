import React, { useState } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import axios from 'axios';
export default function AddSaveNum({ onClose }) {

  function parseJwt(token) {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch {
      return null;
    }
  }
  const token = localStorage.getItem('token')
  const decoded = parseJwt(token);
  const email = decoded?.email;



  const [formData, setFormData] = useState({
    name: "",
    number: "",
    company: "",
    date: "",
    amount: "",
    speed: "",
    email,
  });

  const company = [
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

  const speed = [
    "512 Mbps   السعر 14000",
    "1 Mbps     السعر 18500",
    "2 Mbps     السعر 24000",
    "4 Mbps     السعر 38000",
    "8 Mbps     السعر 64000",
    "16 Mbps   السعر  83000",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post('http://localhost:5000/api/payment/save-number',

      formData, {
      headers: {
        Authorization: `Bearer ${token}`,

      }
    }
    )
    alert('تم حفظ الرقم بنجاح')
    setFormData({
      name: "",
      number: "",
      company: "",
      date: "",
      amount: "",
    })


  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-xl shadow-md w-96 z-[10000]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-black font-bold text-lg">اضافة رقم</h1>
          <AiOutlineCloseCircle
            className="text-gray-500 hover:text-gray-700 cursor-pointer text-xl"
            onClick={onClose}
          />
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            className="w-full border p-2 rounded"
            placeholder="الاسم"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="number"
            className="w-full border p-2 rounded"
            placeholder="الرقم"
            value={formData.number}
            onChange={handleChange}
            required
          />

          {/* اختيار الشركة */}
          <select
            name="company"
            className="w-full border p-2 rounded"
            required
            value={formData.company}
            onChange={handleChange}
          >
            <option value="">اختر الشركة</option>
            {company.map((c, i) => (
              <option key={i} value={c}>
                {c}
              </option>
            ))}
          </select>

          <input
            type="date"
            name="date"
            className="w-full border p-2 rounded"
            required
            value={formData.date}
            onChange={handleChange}
          />
          <input
            type="number"
            name="amount"
            required
            className="w-full border p-2 rounded"
            placeholder="المبلغ"
            value={formData.amount}
            onChange={handleChange}
          />

          {/* اختيار السرعة */}
          <select
            name="speed"
            className="w-full border p-2 rounded"
            required
            value={formData.speed}
            onChange={handleChange}
          >
            <option value="">اختر السرعة</option>
            {speed.map((s, i) => (
              <option key={i} value={s}>
                {s}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="w-full bg-emerald-600 text-white p-2 rounded hover:bg-emerald-700 transition"
          >
            حفظ
          </button>
        </form>
      </div>
    </div>
  );
}