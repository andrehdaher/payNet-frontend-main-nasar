import React, { useEffect, useRef, useState } from "react";
import ServiceCard from "../components/Card";
import { data, useNavigate } from "react-router-dom";
import ADSL from "../assets/ADSL.png";
import elecandwater from "../assets/elecandwater.png";
import ARDE1 from "../assets/ARDE1.png"
import { useNotification } from "../context/NotificationContext";
import NavBar from "../components/NavBar";
import { io } from "socket.io-client";



const HomePoint = () => {
  const navigate = useNavigate();
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);
    const {hasNewUnpaid, setHasNewUnpaid } = useNotification(); // ✅ Context
      const [socket, setSocket] = useState(null);
      
      
useEffect(()=>{
  const newSocket = io("https://paynet-1.onrender.com");

  newSocket.on("connect" , ()=>{
    console.log('تم الاتصال بالسيرفر')
    newSocket.emit("financial" ,"done");
  });

  newSocket.on("json_message" , (data)=>{
    console.log(data)
    setHasNewUnpaid(data)
  });

  return () => {
    newSocket.disconnect();
  };

},[]);


  useEffect(() => {
    if (!vantaEffect && window.VANTA) {
      setVantaEffect(
        window.VANTA.NET({
          el: vantaRef.current,
          color: 0x0f172a,
          backgroundColor: 0xeaeaea,
          points: 8.0,
          maxDistance: 20.0,
          spacing: 15.0,
        })
      );
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  const services = [
    {
      title: "تسديد فواتير الإنترنت",
      description: "ادفع فواتير الإنترنت الخاصة بك بسرعة وأمان.",
      image: ADSL,
      buttonText: "سدد الآن",
      route: "/internet",
    },
    {
      title: "تسديد فواتير الارضي",
      description: "ادفع فواتير الارضي الخاصة بك بسرعة وأمان.",
      image: ARDE1,
      buttonText: "سدد الآن",
      route: "/phone",
    },
    {
      title: "تسديد كهرباء ومياه",
      description: "إدارة فواتير الكهرباء والمياه بكل سهولة وأمان.",
      image: elecandwater,
      buttonText: "سدد الآن",
      route: "/utilities",
    },
  ];

  return (
    <div ref={vantaRef} className="min-h-screen w-full text-white relative">
<NavBar/>
      <div
          className="grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3 place-items-center"
        dir="rtl"
      >
        {services.map((service, idx) => (
          <ServiceCard
            key={idx}
            title={service.title}
            description={service.description}
            image={service.image}
            buttonText={service.buttonText}
            onClick={() => navigate(service.route)}
          />
        ))}
      </div>
    </div>
  );
};

export default HomePoint;
