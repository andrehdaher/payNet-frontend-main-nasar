import React from 'react'
import NETFLIX from '../../assets/NETFLIX.jpeg'
import SHAMNA from '../../assets/SHAMNA.jpeg'
import LOOK4K from '../../assets/LOOK4K.jpeg'
import SHAHID from '../../assets/SHAHID.jpeg'
import IPTV from '../../assets/IPTV.jpeg'
import ZAINTV from '../../assets/ZAINTV.jpeg'

export default function ViewApp() {

    const ViewApp = [
        {
            title: 'NETFLIX',
            formType: 'NETFLIX',
            description: 'شحن NETFLIX بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            route: "/payapp",
            image: NETFLIX
        },
        {
            title: 'SHAMNA',
            formType: 'SHAMNA',
            description: 'شحن SHAMNA بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            route: "/payapp",
            image: SHAMNA
        },
        {
            title: 'LOOK 4K',
            formType: 'LOOK4K',
            description: 'شحن SHAMNA بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            route: "/payapp",
            image: LOOK4K
        },
        {
            title: 'SHAHID',
            formType: 'SHAHID',
            description: 'شحن SHAHID بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            route: "/payapp",
            image: SHAHID
        },
        {
            title: 'IPTV',
            formType: 'IPTV',
            description: 'شحن IPTV بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            route: "/payapp",
            image: IPTV
        },
        {
            title: 'ZAIN TV',
            formType: 'ZAINTV',
            description: 'شحن ZAIN TV بسرعة وأمان',
            buttonText: "عرض التفاصيل",
            route: "/payapp",
            image: ZAINTV
        },

    ]
    return ViewApp
}
