import { PAYNET_BASE_URL } from "../api";
import React, { useEffect, useRef, useState } from "react";
import ServiceCard from "../components/Card";
import ADSL from "../assets/ADSL.webp";
import elecandwater from "../assets/elecandwater.webp";
import ARDE1 from "../assets/ARDE1.webp"
import { useNotification } from "../context/NotificationContext";
import { io } from "socket.io-client";
import ScreenWrapper from "../components/ScreenWrapper";
import SYR from "../assets/SYR.png"
import Play from "../assets/play.jpeg"
import application from "../assets/application.jpeg"
import usdtpay from "../assets/usdtpay.jpeg"
import viewapp from "../assets/viewapp.jpeg"
import AI from "../assets/AI.jpeg"



const Home = () => {
  const vantaRef = useRef(null);
  const { hasNewUnpaid, setHasNewUnpaid } = useNotification(); // ✅ Context
  const [socket, setSocket] = useState(null);


  useEffect(() => {
    const newSocket = io(PAYNET_BASE_URL);

    newSocket.on("connect", () => {
      console.log('تم الاتصال بالسيرفر')
      newSocket.emit("financial", "done");
    });

    newSocket.on("json_message", (data) => {
      console.log(data)
      setHasNewUnpaid(data)
    });

    return () => {
      newSocket.disconnect();
    };

  }, []);


  const services = [
    {
      title: "فواتير الإنترنت",
      service: "ADSL",
      description: "ادفع فواتير الإنترنت الخاصة بك بسرعة وأمان.",
      image: ADSL,
      buttonText: "عرض التفاصيل",
      route: "/internet",
    },
    {
      title: "فواتير الارضي",
      service: "PHONE",
      description: "ادفع فواتير الارضي الخاصة بك بسرعة وأمان.",
      image: ARDE1,
      buttonText: "عرض التفاصيل",
      route: "/internet",
    },
    {
      title: "كهرباء ومياه",
      service: "ELEC",
      description: "إدارة فواتير الكهرباء والمياه بكل سهولة وأمان.",
      image: elecandwater,
      buttonText: "عرض التفاصيل",
      route: "/internet",
    },
    {
      title: "سريتل و MTN",
      service: "SYR",
      description: "تحويل وحدات سريتل و MTN .",
      image: SYR,
      buttonText: "عرض التفاصيل",
      cardKey: 'cardSyriatel',
      route: "/internet",
    },
    {
      title: "قسم الألعاب",
      service: "play",
      description: "شحن حسابات الألعاب المختلفة بسرعة وأمان.",
      image: Play,
      buttonText: "عرض التفاصيل",
      cardKey: 'cardPlay',
      route: "/internet",
    },
    // {
    //   title: "قسم التطبيقات",
    //   service: "application",
    //   description: "شحن الطبيقات وبرامج المحادثة المختلفة بسرعة و أمان",
    //   image: application,
    //   buttonText: "عرض التفاصيل",
    //   cardKey: 'cardapplication',
    //   route: "/internet",
    // },
    {
      title: "قسم الدفع الالكتروني",
      service: "usdtpay",
      description: "شحن المحفظات الالكترونية المختلفة بسرعة و أمان",
      image: usdtpay,
      buttonText: "عرض التفاصيل",
      cardKey: 'usdtpay',
      route: "/internet",
    },
    {
      title: "قسم تطبيقات المشاهدة",
      service: "viewapp",
      description: "شحن  تطبيقات المشاهدة المختلفة بسرعة و أمان",
      image: viewapp,
      buttonText: "عرض التفاصيل",
      cardKey: 'viewapp',
      route: "/internet",
    },
    // {
    //   title: "قسم ال AI",
    //   service: "ai",
    //   description: "شحن  تطبيقات الذكاء الاصطناعي المختلفة بسرعة و أمان",
    //   image: AI,
    //   buttonText: "عرض التفاصيل",
    //   cardKey: 'ai',
    //   route: "/internet",
    // },

  ];

  return (
    <ScreenWrapper>
      <h1 className="page-title">الخدمات</h1>
      <div className="service-grid">
        {services.map((service, idx) => (
          <ServiceCard key={service.title} {...service} to={service.route} state={service.service} eager={idx < 3} />
        ))}
      </div>
    </ScreenWrapper>
  );
};

export default Home;
