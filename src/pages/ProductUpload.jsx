import React, { useState } from "react";
import axios from "axios";
import NavbarAdmin from "../components/NavbarAdmin";
import PageHeader from "../components/Custom/PageHeader";
import Alert from "../components/Custom/Alert";
import { Button } from "../components/Custom/Button";
import { Input } from "../components/Custom/Input";
import Footer from "../components/Footer";

export default function ProductUpload() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [stock, setStock] = useState(0);
  const [message, setMessage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const token = localStorage.getItem("token");

  const inputClass = "w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none transition-colors focus:border-violet-500 focus:ring-2 focus:ring-violet-500";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!name || !price || !imageUrl) {
      setMessage({ type: "error", text: "الرجاء تعبئة الاسم والسعر وإضافة رابط الصورة." });
      return;
    }

    try {
      setUploading(true);
      const apiBase = process.env.REACT_APP_API_BASE_URL || "https://paynet-1.onrender.com/api/payment/save-number";

      await axios.post(
        `${apiBase}/api/product/add`,
        { name, price, category, description, imageUrl, stock },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setMessage({ type: "success", text: "تم رفع المنتج بنجاح." });
      setName("");
      setPrice("");
      setCategory("");
      setDescription("");
      setImageUrl("");
      setStock(0);
    } catch (err) {
      console.error(err);
      const errMsg = err?.response?.data?.message || err.message || "حصل خطأ أثناء الرفع";
      setMessage({ type: "error", text: errMsg });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-16" dir="rtl">
      <NavbarAdmin />
      <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
        <PageHeader title="إضافة منتج جديد" description="أضف بيانات المنتج والصورة ليظهر ضمن المنتجات المتاحة." />

        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          {message && <Alert type={message.type} className="mb-4">{message.text}</Alert>}

          <form onSubmit={handleSubmit} className="space-y-4" aria-busy={uploading}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input id="product-name" label="اسم المنتج" value={name} onChange={(e) => setName(e.target.value)} placeholder="مثال: هاتف ذكي" required />

              <Input id="product-price" label="السعر" value={price} onChange={(e) => setPrice(e.target.value)} type="number" min="0" step="0.01" placeholder="0.00" required />

              <Input id="product-category" label="الفئة" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="مثال: إلكترونيات" />

              <Input id="product-stock" label="الكمية (المخزون)" value={stock} onChange={(e) => setStock(e.target.value)} type="number" min="0" />
            </div>

            <div>
              <label htmlFor="product-description" className="mb-1 block text-sm font-semibold text-slate-700">الوصف</label>
              <textarea id="product-description" value={description} onChange={(e) => setDescription(e.target.value)} rows="4" className={inputClass} placeholder="وصف المنتج..." />
            </div>

            <Input id="product-image-url" type="text" label="رابط الصورة" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://example.com/image.jpg" />

            <Button type="submit" loading={uploading}>
              {uploading ? "جارٍ الرفع..." : "رفع المنتج"}
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
