import React from 'react'
import InInventoryManagmentAd from '../../assets/InventoryManagmentAd.png'
import Daher from '../../assets/Daher.Net Ad Photo.png'
import Desktop from '../../assets/Desktop - 2.png'
import tasmem from '../../assets/tasmem.jpeg'

export default function programes() {

    const openWhatsApp = (formType) => {
        const phone = "963993822320";

        const message = `مرحبا، اريد طلب ${formType}`;
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

        window.open(url, "_blank");
    };

    const programes = [
        {
            title: 'برنامج محاسبة متكامل',
            formType: 'برنامج محاسبة',
            description: 'برنامج محاسبة احترافي يساعدك على إدارة المبيعات والمشتريات والمخزون وتقارير الأرباح بكل سهولة.',
            buttonText: "اطلب الآن",
            Action: openWhatsApp,
            image: InInventoryManagmentAd
        },



        {
            title: 'نظام ERP متكامل للشركات',
            formType: 'ERP',
            description: 'حل احترافي لإدارة أعمالك بالكامل، يشمل المحاسبة والمبيعات والمخزون والموارد البشرية مع تقارير دقيقة تساعدك على اتخاذ قرارات أفضل.',
            buttonText: "اطلب الآن",
            Action: openWhatsApp,
            image: Daher
        },
        {
            title: 'نظام PayNet لتسديد الفواتير',
            formType: 'PayNet',
            description: 'قم بتسديد فواتير الإنترنت والكهرباء والخدمات الأخرى بشكل آلي وآمن مع نظام PayNet وإدارة متكاملة للعمليات.',
            buttonText: "اطلب الآن",
            Action: openWhatsApp,
            image: Desktop
        },
        {
            title: 'تصميم وبرمجة مواقع وتطبيقات احترافية',
            formType: 'Web Development',
            description: 'حوّل فكرتك إلى موقع أو تطبيق احترافي مع تصميم عصري وأداء سريع وتجربة مستخدم مميزة تناسب جميع الأجهزة.',
            buttonText: "اطلب الآن",
            Action: openWhatsApp,
            image: tasmem
        },
    ]

    return programes
}