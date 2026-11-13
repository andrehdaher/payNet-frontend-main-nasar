import React from 'react'
import USDTTRC20 from '../../assets/USDT-TRC20.jpeg'
import USDTBEB20 from '../../assets/USDTBEB20.jpeg'
import BANKTR from '../../assets/BANKTR.jpeg'
import PAYCELL from '../../assets/PAYCELL.jpeg'

export default function Usdtpay() {


    const usdtpay = [
        {
            title: 'USDT-TRC20',
            formType: 'USDTTRC20',
            description: 'شحن USDT-TRC20 بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            route: "/payinternet",
            image: USDTTRC20
        },
        {
            title: 'USDT-BEB20',
            formType: 'USDTBEB20',
            description: 'شحن USDT-BEB20 بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            route: "/payinternet",
            image: USDTBEB20
        },
        {
            title: 'BANK-TR',
            formType: 'BANKTR',
            description: 'شحن BANK-TR بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            route: "/payinternet",
            image: BANKTR
        },
        {
            title: 'PAYCELL',
            formType: 'PAYCELL',
            description: 'شحن PAYCELL بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            route: "/payinternet",
            image: PAYCELL
        },

    ]

    return usdtpay;

}
