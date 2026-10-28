import React from 'react'
import { useLocation } from "react-router-dom";
import { appDetails } from '../components/payInternet/appDetails';
import AppCard from '../components/payInternet/CardApp';
import ScreenWrapper from '../components/ScreenWrapper';
import { useState } from 'react';
import axios from 'axios';


export default function PayApp() {
    const location = useLocation()
    const formType = location.state
    const config = appDetails[formType] || []
    const card = config.card


    const [paymentType, setPaymentType] = useState("cash");
    const [showChatGPTForm, setShowChatGPTForm] = useState(false);
    const [chatEmail, setChatEmail] = useState("");
    const [chatPassword, setChatPassword] = useState("");
    const [selectedCard, setSelectedCard] = useState(null);




    function parseJwt(token) {
        try {
            return JSON.parse(atob(token.split(".")[1]));

        } catch (e) {
            return null;
        }
    }

    const multiplier = config.multiplier;


    const handleSubmit = async (data) => {
        console.log(data)

        // ✅ إذا كانت chatjpt → افتح الفورم فقط
        if (['CHATGPT'].includes(data.name)) {
            setSelectedCard(data);
            setShowChatGPTForm(true);
            return;
        }

        // باقي البطاقات
        await sendPayment(data);
    };


    const sendPayment = async (data, extra = {}) => {
        const token = localStorage.getItem("token");
        const decoded = parseJwt(token);
        const email = decoded?.email;

        if (!email) {
            alert("الرجاء تسجيل الدخول");
            return;
        }

        const calculatedAmount = Number(
            (data.price * multiplier).toFixed(2)
        );

        try {
            const res = await axios.post(
                "https://paynet-main-nasar.onrender.com/api/payment/internet-full",
                {
                    landline: data.name,
                    company: data.title,
                    speed: data.url,
                    amount: data.price,
                    email,
                    paymentType,
                    calculatedAmount: data.price,

                    // 👇 بيانات إضافية (chatgpt)
                    ...extra,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert(
                "تم التسديد بنجاح.\nسوف تصلكم معلومات الاشتراك برسالة واتساب"
            );

            setShowChatGPTForm(false);
            setChatEmail("");
            setChatPassword("");

        } catch (err) {
            alert(err.response?.data?.message || "حدث خطأ");
        }
    };


    return (
        <>
            {showChatGPTForm && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-sm space-y-4">
                        <h3 className="text-lg font-bold text-center">
                            بيانات الحساب
                        </h3>

                        <input
                            type="email"
                            placeholder="البريد الإلكتروني"
                            value={chatEmail}
                            onChange={(e) => setChatEmail(e.target.value)}
                            className="w-full border rounded-lg p-2"
                        />

                        <input
                            type="password"
                            placeholder="كلمة المرور"
                            value={chatPassword}
                            onChange={(e) => setChatPassword(e.target.value)}
                            className="w-full border rounded-lg p-2"
                        />

                        <div className="flex gap-2">
                            <button
                                className="flex-1 bg-gray-300 rounded-lg py-2"
                                onClick={() => setShowChatGPTForm(false)}
                            >
                                إلغاء
                            </button>

                            <button
                                className="flex-1 bg-emerald-600 text-white rounded-lg py-2"
                                onClick={() =>
                                    sendPayment(selectedCard, {
                                        chatEmail,
                                        chatPassword,
                                    })
                                }
                            >
                                تأكيد الشراء
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ScreenWrapper>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center my-2">
                    {card.map((item, index) => (
                        <AppCard key={index} data={item.card1} onClick={handleSubmit} />

                    ))}
                </div>
            </ScreenWrapper>
        </>

    )
}
