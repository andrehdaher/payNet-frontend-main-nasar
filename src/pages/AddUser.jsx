import { useState } from "react";
import Navbar from "../components/NavbarAdmin";

export default function AddUser() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    number: "",
    password: "",
    balance: 0,
    role: "user",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("https://paynet-1.onrender.com/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ تم إضافة المستخدم بنجاح");
        setFormData({
          name: "",
          email: "",
          number: "",
          password: "",
          balance: 0,
          role: "user",
        });
      } else {
        setMessage(`❌ خطأ: ${data.message}`);
      }
    } catch (err) {
      setMessage(`❌ خطأ في الاتصال: ${err.message}`);
    }
  };

  return (
<div>
        <Navbar/>
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg"
        >
          <h2 className="text-2xl font-bold mb-4 text-center">إضافة مستخدم جديد</h2>
  
          {message && <div className="mb-4 text-center text-sm">{message}</div>}
  
          <input
            type="text"
            name="name"
            placeholder="الاسم"
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-2 rounded mb-3"
            required
          />
          <input
            type="text"
            name="email"
            placeholder="البريد الإلكتروني"
            value={formData.email}
            onChange={handleChange}
            className="w-full border p-2 rounded mb-3"
            required
          />
          <input
            type="text"
            name="number"
            placeholder="رقم الهاتف"
            value={formData.number}
            onChange={handleChange}
            className="w-full border p-2 rounded mb-3"
            required
          />
          <input
            type="text"
            name="password"
            placeholder="كلمة المرور"
            value={formData.password}
            onChange={handleChange}
            className="w-full border p-2 rounded mb-3"
            required
          />
          <input
            type="number"
            name="balance"
            placeholder="الرصيد"
            value={formData.balance}
            onChange={handleChange}
            className="w-full border p-2 rounded mb-3"
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border p-2 rounded mb-4"
          >
            <option value="user">مستخدم</option>
            <option value="admin">مدير</option>
          </select>
  
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
          >
            إضافة
          </button>
        </form>
      </div>
</div>
  );
}
