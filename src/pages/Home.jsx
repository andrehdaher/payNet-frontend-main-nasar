import React, { useEffect, useRef, useState } from "react";
import ServiceCard from "../components/Card";
import { data, useNavigate } from "react-router-dom";
import ADSL from "../assets/ADSL.png";
import elecandwater from "../assets/elecandwater.png";
import ARDE1 from "../assets/ARDE1.png"
import Play from "../assets/play.jpeg";
import { useNotification } from "../context/NotificationContext";
import NavBar from "../components/NavBar";
import { io } from "socket.io-client";
import SYR from '../assets/SYR.png'
import ScreenWrapper from "../components/ScreenWrapper";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/Custom/Card";
import { Button } from "../components/Custom/Button";
import application from '../assets/application.jpeg'
import axios from "axios";



const Home = () => {
  const navigate = useNavigate();
  const vantaRef = useRef(null);
  const { hasNewUnpaid, setHasNewUnpaid } = useNotification(); // ✅ Context
  const [socket, setSocket] = useState(null);
  const [userCards, setUserCards] = useState({});
  const [cardTrue, setCardTrue] = useState([])

  function parseJwt(token) {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      return null;
    }
  }

  const token = localStorage.getItem("token");
  const decoded = token ? parseJwt(token) : null;
  const email = decoded?.email;


  useEffect(() => {
    const newSocket = io("https://paynet-1.onrender.com");

    newSocket.on("connect", () => {
      newSocket.emit("financial", "done");
    });

    newSocket.on("json_message", (data) => {
      setHasNewUnpaid(data)
    });

    return () => {
      newSocket.disconnect();
    };

  }, []);

  const getUser = async () => {

    try {
      const res = await axios.get(`https://paynet-1.onrender.com/api/user/get-user-by-email?email=${email}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserCards(res.data)


    } catch (err) {
      console.error("فشل في جلب بيانات المستخدم:", err);
    }
  };
  useEffect(() => {
    if (email && token) getUser();
  }, [email, token]);





  const services = [
    {
      title: "فواتير الإنترنت",
      service: "ADSL",
      description: "ادفع فواتير الإنترنت الخاصة بك بسرعة وأمان.",
      image: ADSL,
      buttonText: "عرض التفاصيل",
      cardKey: 'cardInternet',
      route: "/internet",
    },
    {
      title: "فواتير الارضي",
      service: "PHONE",
      description: "ادفع فواتير الارضي الخاصة بك بسرعة وأمان.",
      image: ARDE1,
      buttonText: "عرض التفاصيل",
      cardKey: 'cardInternet',
      route: "/internet",
    },
    {
      title: "كهرباء ومياه",
      service: "ELEC",
      description: "إدارة فواتير الكهرباء والمياه بكل سهولة وأمان.",
      image: elecandwater,
      buttonText: "عرض التفاصيل",
      cardKey: 'cardInternet',
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

  ];

  useEffect(() => {
    if (!userCards?.cardKey) return;

    const filteredServices = services.filter(service => {
      return userCards.cardKey[service.cardKey] === true;
    })
    setCardTrue(filteredServices)

  }, [userCards])

  return (
    <ScreenWrapper>
      <div
        className="grid gap-6 p-6 sm:grid-cols-2 lg:gap-16 lg:grid-cols-3 place-items-center"
        dir="rtl"
      >
        {cardTrue.map((service, idx) => (
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
