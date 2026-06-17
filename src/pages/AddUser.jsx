import { useState } from "react";
import Navbar from "../components/NavbarAdmin";
import PageHeader from "../components/Custom/PageHeader";
import Alert from "../components/Custom/Alert";
import { Button } from "../components/Custom/Button";
import { Input } from "../components/Custom/Input";
import FormSection from "../components/Custom/FormSection";
import Footer from "../components/Footer";

export default function AddUser() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    number: "",
    password: "",
    balance: 0,
    role: "user",
  });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("https://paynet-1.onrender.com/api/payment/save-number/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: "تم إضافة المستخدم بنجاح." });
        setFormData({ name: "", email: "", number: "", password: "", balance: 0, role: "user" });
      } else {
        setMessage({ type: "error", text: data.message || "تعذر إضافة المستخدم." });
      }
    } catch (err) {
      setMessage({ type: "error", text: `خطأ في الاتصال: ${err.message}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-16" dir="rtl">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
        <PageHeader title="إضافة مستخدم جديد" description="أنشئ حساب مستخدم أو مدير مع الرصيد الابتدائي." />

        {message && <Alert type={message.type} className="mb-4">{message.text}</Alert>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormSection title="بيانات الحساب">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input id="name" name="name" label="الاسم" value={formData.name} onChange={handleChange} required />
              <Input id="email" name="email" label="البريد الإلكتروني" value={formData.email} onChange={handleChange} required />
              <Input id="number" name="number" label="رقم الهاتف" value={formData.number} onChange={handleChange} required />
              <Input id="password" name="password" label="كلمة المرور" value={formData.password} onChange={handleChange} required />
              <Input id="balance" name="balance" label="الرصيد" type="number" value={formData.balance} onChange={handleChange} />
              <div className="space-y-1 text-right">
                <label htmlFor="role" className="block text-sm font-semibold text-slate-700">النوع</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-slate-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500"
                >
                  <option value="user">مستخدم</option>
                  <option value="admin">مدير</option>
                </select>
              </div>
            </div>
          </FormSection>

          <Button type="submit" loading={loading} className="w-full">
            إضافة
          </Button>
        </form>
      </main>
      <Footer />
    </div>
  );
}
