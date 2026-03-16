import React from 'react'
import { useLocation } from "react-router-dom";
import { appDetails } from '../components/payInternet/appDetails';
import AppCard from '../components/payInternet/CardApp';
import ScreenWrapper from '../components/ScreenWrapper';
import { useState } from 'react';
import PurchaseModal from "../components/payInternet/PurchaseModal";
import axios from 'axios';


export default function PayApp() {
    const location = useLocation()
    const formType = location.state
    const config = appDetails[formType] || [];
    const [paymentType, setPaymentType] = useState("cash");
    const [showChatGPTForm, setShowChatGPTForm] = useState(false);
    const [chatEmail, setChatEmail] = useState("");
    const [chatPassword, setChatPassword] = useState("");
    const [selectedCard, setSelectedCard] = useState(null);
    const [card, setCard] = useState([]);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState(formType);
    const [placeholder, setPlaceholder] = useState("ادخل الـ ID");
    const [image, setImage] = useState("");
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showModal, setShowModal] = useState(false);





    function parseJwt(token) {
        try {
            return JSON.parse(atob(token.split(".")[1]));

        } catch (e) {
            return null;
        }
    }

    const multiplier = config.multiplier;


    const handleSubmit = async (data) => {
        setSelectedProduct(data);
        setShowModal(true);

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
                "https://paynet-1.onrender.com/api/payment/internet-full",
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

    const getProductOnline = async () => {
        try {
            const res = await axios.get(`https://paynet-1.onrender.com/api/productonline/get-product-online?name=${formType}`);
            setImage(res.data.products[0].image);
            setCard(res.data.card[0]);
            setPlaceholder(res.data.products[0].type);
        }
        catch (err) {
            alert(err.response?.data?.message || "حدث خطأ أثناء جلب المنتجات");
        }
    };

    React.useEffect(() => {
        getProductOnline();
    }, [])



    return (
        <>
            <PurchaseModal
                open={showModal}

                title={selectedProduct?.title}
                price={selectedProduct?.price}
                name={selectedProduct?.name}
                placeholder={
                    (placeholder && (placeholder.includes('view') || selectedProduct?.title?.includes('حساب جديد جاهز لمدة شهر'))) ?
                        'ادخل رقم الواتس لارسال معلومات الاشتراك' :
                        (selectedProduct?.title?.includes(' تجديد ')) ?
                            'ادخل الايميل' :
                            'ادخل الـ ID الخاص بك'
                }
                onClose={() => setShowModal(false)}
                onConfirm={(value) => {
                    sendPayment(selectedProduct, { playerId: value });
                    setShowModal(false);
                }}
            />

            <ScreenWrapper>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center my-2">

                    {card.map((item, index) => (

                        <AppCard key={index} data={item} name={name} onClick={handleSubmit} />

                    ))}
                </div>
            </ScreenWrapper>
        </>

    )
}
