// components/AddPointForm.jsx
import React, { useState , useEffect } from "react";
import axios from "axios";

export default function AddPointForm({ onClose }) {
    const [email, setEmail] = useState("");
      const [loading, setLoading] = useState(false); // ✅ حالة التحميل

    function parseJwt(token) {
      try {
        return JSON.parse(atob(token.split(".")[1]));
      } catch (e) {
        return null;
      }
    }
  useEffect(()=>{
        const token = localStorage.getItem("token");
      if (!token) return;
  
      const decoded = parseJwt(token);
      if (decoded?.email) setEmail(decoded.email);
  } , [])
  const [formData, setFormData] = useState({
    username: "",
    agent: "",
    owner: "",
    password: "",
    nember : "",
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
    onClose(); // إغلاق الفورم بعد الحفظ
  };
  
  const handelSave = async ()=>{
    try{
            setLoading(true); // ✅ بدء التحميل
    await axios.post("https://paynet-1.onrender.com/api/point/add-point" , {formData , email})
    alert("تم اضافة نقطة البيع بنجاح")
    }
    catch(err){
      console.log(err)
      alert("الايميل موجود مسبقا")

    }
    finally {
      setLoading(false); // ✅ إيقاف التحميل بعد انتهاء العملية
    }

  }

  return (

    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ">
      <div className="bg-white rounded-lg p-6 w-[400px] shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-center">إضافة نقطة بيع</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="username"
            placeholder="اسم المستخدم"
            value={formData.username}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="text"
            name="password"
            placeholder="كلمة المرور"
            value={formData.password}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="text"
            name="number"
            placeholder="رقم الخليوي"
            value={formData.number}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="text"
            name="agent"
            placeholder="الوكيل"
            value={email}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />

          <input
            type="text"
            name="owner"
            placeholder="صاحب النقطة"
            value={formData.owner}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />

          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="bg-violet-600 text-white px-4 py-2 rounded"
              onClick={handelSave}
            >
              {loading ? "جاري الحفظ..." : "حفظ"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
