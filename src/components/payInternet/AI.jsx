import React from 'react'
import { useNavigate } from 'react-router-dom';
import CHATGPT from '../../assets/CHATGPT.jpeg'
import GEMINI from '../../assets/GEMINI.jpeg'
import Claude from '../../assets/Claude.jpeg'
import canva from '../../assets/canva.jpeg'


export default function AI() {
    const navigate = useNavigate();
    const Action = (formType) => {
        navigate('/payapp', { state: formType });
    };

    const AI = [
        {
            title: 'CHATGPT (يدوي)',
            formType: 'CHATGPT',
            description: 'شحن CHATGPT بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
            image: CHATGPT
        },
        {
            title: 'GEMINI (يدوي)',
            formType: 'GEMINI',
            description: 'شحن GEMINI بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
            image: GEMINI
        },
        {
            title: 'Claude ai',
            formType: 'Claude ai',
            description: 'شحن Claude ai بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            Action: Action,
            image: Claude
        },
        // {
        //     title: 'canva pro',
        //     formType: 'canva pro',
        //     description: 'شحن canva pro بسرعة وأمان',
        //     buttonText: "عرض التفاصيل",
        //     Action: Action,
        //     image: canva
        // },


    ]
    return AI
}
