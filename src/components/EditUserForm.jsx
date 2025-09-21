// components/EditUserForm.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function EditUserForm({ userId, onClose, onUpdate }) {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    number: "",
    balance: "",
  });

  useEffect(() => {
    axios.get(`https://paynet-1.onrender.com/api/admin/user/${userId}`)
      .then(res => setUserData(res.data))
      .catch(err => console.error("حدث خطأ في جلب المستخدم", err));
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://paynet-1.onrender.com/api/admin/updateuser/${userId}`, userData);
      alert("تم التعديل بنجاح ✅");
      onUpdate();  // إعادة تحميل المستخدمين
      onClose();   // إغلاق النموذج
    } catch (err) {
      console.error("خطأ في التعديل", err);
      alert("حدث خطأ أثناء التعديل");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white p-6 rounded shadow-lg w-[400px]">
        <h2 className="text-xl font-bold mb-4">تعديل المستخدم</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={userData.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="الاسم"
            required
          />
          <input
            type="text"
            name="email"
            value={userData.email}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="البريد الإلكتروني"
            required
          />
          <input
            type="text"
            name="number"
            value={userData.number}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="رقم الهاتف"
            required
          />
          <input
            type="text"
            name="balance"
            value={userData.balance}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="رقم الهاتف"
            required
          />
          
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded"
              onClick={onClose}
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              تعديل
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
