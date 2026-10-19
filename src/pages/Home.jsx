import React, { useEffect, useRef, useState } from "react";
import ServiceCard from "../components/Card";
import { data, useNavigate } from "react-router-dom";
import ADSL from "../assets/ADSL.png";
import elecandwater from "../assets/elecandwater.png";
import ARDE1 from "../assets/ARDE1.png"
import { useNotification } from "../context/NotificationContext";
import NavBar from "../components/NavBar";
import { io } from "socket.io-client";
import ScreenWrapper from "../components/ScreenWrapper";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/Custom/Card";
import { Button } from "../components/Custom/Button";
import SYR from "../assets/SYR.png"
import Play from "../assets/play.jpeg"
import application from "../assets/application.jpeg"
import usdtpay from "../assets/usdtpay.jpeg"
import viewapp from "../assets/viewapp.jpeg"
import AI from "../assets/AI.jpeg"



const Home = () => {
  const navigate = useNavigate();
  const vantaRef = useRef(null);
  const { hasNewUnpaid, setHasNewUnpaid } = useNotification(); // ✅ Context
  const [socket, setSocket] = useState(null);


  useEffect(() => {
    const newSocket = io("https://paynet-main-nasar.onrender.com");

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
      <div
        className="grid gap-6 p-6 sm:grid-cols-2 lg:gap-16 lg:grid-cols-3 place-items-center"
        dir="rtl"
      >
        {services.map((service, idx) => (
          <Card key={idx} className="">
            <CardContent>
              <img className="w-96 h-80 mx-auto object-cover" src={service.image} alt="" />
            </CardContent>

            <CardHeader>
              <CardTitle>{service.title}</CardTitle>
              <CardDescription>{service.description}</CardDescription>
            </CardHeader>


            <CardFooter>
              <Button
                className="ml-auto"
                variant="outline"
                onClick={() => navigate(service.route, { state: service.service })}
              >
                {service.buttonText}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </ScreenWrapper>
  );
};

export default Home;
