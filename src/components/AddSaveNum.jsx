import React, { useState } from "react";
import axios from 'axios';
export default function AddSaveNum() {

  function parseJwt (token){
    try{
      return JSON.parse(atob(token.split(".")[1]));
    }catch{
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const res = axios.post('http://localhost:5000/api/payment/addnumber' , {formData})
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-md w-96">
        <h1 className="text-black font-bold text-lg mb-4 text-center">اضافة رقم</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            className="w-full border p-2 rounded"
            placeholder="الاسم"
            value={formData.name}
            onChange={handleChange}
          />
          <input
            type="number"
            name="number"
            className="w-full border p-2 rounded"
            placeholder="الرقم"
            value={formData.number}
            onChange={handleChange}
          />

          {/* اختيار الشركة */}
          <select
            name="company"
            className="w-full border p-2 rounded"
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
            value={formData.date}
            onChange={handleChange}
          />
          <input
            type="number"
            name="amount"
            className="w-full border p-2 rounded"
            placeholder="المبلغ"
            value={formData.amount}
            onChange={handleChange}
          />

          {/* اختيار السرعة */}
          <select
            name="speed"
            className="w-full border p-2 rounded"
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
