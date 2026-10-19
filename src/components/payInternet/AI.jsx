import React from 'react'
import { useNavigate } from 'react-router-dom';
import CHATGPT from '../../assets/CHATGPT.jpeg'


export default function AI() {
    const navigate = useNavigate();
    const Action = (formType) => {
        navigate('/payapp', { state: formType });
    };

    const AI = [
        {
            title: 'CHATGPT',
            formType: 'CHATGPT',
            description: 'شحن CHATGPT بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
            image: CHATGPT
        },


    ]
    return AI
}
