import React from 'react'
import { useNavigate } from 'react-router-dom';
import USDTTRC20 from '../../assets/USDT-TRC20.jpeg'
import USDTBEB20 from '../../assets/USDTBEB20.jpeg'
import BANKTR from '../../assets/BANKTR.jpeg'
import PAYCELL from '../../assets/PAYCELL.jpeg'

export default function Usdtpay() {
    const navigate = useNavigate();
    const Action = (formType) => {
        navigate('/payinternet', { state: formType });
    };


    const usdtpay = [
        {
            title: 'USDT-TRC20',
            formType: 'USDTTRC20',
            description: 'شحن USDT-TRC20 بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
            image: USDTTRC20
        },
        {
            title: 'USDT-BEB20',
            formType: 'USDTBEB20',
            description: 'شحن USDT-BEB20 بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
            image: USDTBEB20
        },
        {
            title: 'BANK-TR',
            formType: 'BANKTR',
            description: 'شحن BANK-TR بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
            image: BANKTR
        },
        {
            title: 'PAYCELL',
            formType: 'PAYCELL',
            description: 'شحن PAYCELL بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
            image: PAYCELL
        },

    ]

    return usdtpay;

}
