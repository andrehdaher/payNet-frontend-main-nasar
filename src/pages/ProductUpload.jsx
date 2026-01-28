import React, { useState } from 'react';
import axios from 'axios';

export default function ProductUpload() {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [stock, setStock] = useState(0);
    const [message, setMessage] = useState(null);
    const [uploading, setUploading] = useState(false);

    const token = localStorage.getItem("token");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);

        if (!name || !price || !imageUrl) {
            setMessage({ type: 'error', text: 'الرجاء تعبئة الاسم والسعر وإضافة رابط الصورة.' });
            return;
        }

        // JSON data
        const productData = {
            name,
            price,
            category,
            description,
            imageUrl,
            stock
        };

        try {
            setUploading(true);

            const apiBase = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

            const res = await axios.post(
                `${apiBase}/api/product/add`,
                productData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"  // مهم
                    }
                }
            );

            setMessage({ type: 'success', text: 'تم رفع المنتج بنجاح!' });

            // reset form
            setName('');
            setPrice('');
            setCategory('');
            setDescription('');
            setImageUrl('');
            setStock(0);

        } catch (err) {
            console.error(err);
            const errMsg = err?.response?.data?.message || err.message || 'حصل خطأ أثناء الرفع';
            setMessage({ type: 'error', text: errMsg });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="w-full max-w-3xl bg-white rounded-2xl shadow-md p-6">
                <h1 className="text-2xl font-semibold mb-4">إضافة منتج جديد</h1>

                {message && (
                    <div
                        className={`mb-4 p-3 rounded ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                            }`}
                    >
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <div>
                            <label className="block text-sm font-medium mb-1">اسم المنتج</label>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full border rounded px-3 py-2"
                                placeholder="مثال: هاتف ذكي"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">السعر</label>
                            <input
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                type="number"
                                min="0"
                                step="0.01"
                                className="w-full border rounded px-3 py-2"
                                placeholder="0.00"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">الفئة</label>
                            <input
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full border rounded px-3 py-2"
                                placeholder="مثال: إلكترونيات"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">الكمية (المخزون)</label>
                            <input
                                value={stock}
                                onChange={(e) => setStock(e.target.value)}
                                type="number"
                                min="0"
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>

                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">الوصف</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="4"
                            className="w-full border rounded px-3 py-2"
                            placeholder="وصف المنتج..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">رابط الصورة</label>
                        <input
                            type="text"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            placeholder="https://example.com/image.jpg"
                            className="block w-full text-sm py-2 border rounded px-3"
                        />
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={uploading}
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white ${uploading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'
                                }`}
                        >
                            {uploading ? 'جارٍ الرفع...' : 'رفع المنتج'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
