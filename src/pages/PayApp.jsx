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



    function parseJwt(token) {
        try {
            return JSON.parse(atob(token.split(".")[1]));

        } catch (e) {
            return null;
        }
    }

    const multiplier = config.multiplier;



    const handleSubmit = async (data) => {
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
        if (!window.confirm('هل انت متاكد من عملية الشراء')) {
            return
        }

        try {
            const res = await axios.post(
                "https://paynet-1.onrender.com/api/payment/internet-full",
                {
                    landline: data.name,
                    company: data.title,
                    speed: data.url,
                    amount: data.price,
                    email,
                    paymentType,
                    calculatedAmount: data.price,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert("تم التسديد بنجاح. الرصيد الجديد: " + res.data.newBalance + '\n' + 'سوف تصلكم معلومات الاشتراك برسالة على واتساب ');

        } catch (err) {
            alert(err.response?.data?.message || "حدث خطأ");
        }
    };


    return (
        <ScreenWrapper>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center my-2">
                {card.map((item, index) => (
                    <AppCard key={index} data={item.card1} onClick={handleSubmit} />

                ))}
            </div>
        </ScreenWrapper>
    )
}
