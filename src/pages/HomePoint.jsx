import { PAYNET_BASE_URL } from "../api";
import React, { useEffect } from "react";
import ServiceCard from "../components/Card";
import ADSL from "../assets/ADSL.webp";
import elecandwater from "../assets/elecandwater.webp";
import ARDE1 from "../assets/ARDE1.webp"
import { useNotification } from "../context/NotificationContext";
import { io } from "socket.io-client";



const HomePoint = () => {
  const { setHasNewUnpaid } = useNotification(); // ✅ Context


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

  }, [setHasNewUnpaid]);



  const services = [
    {
      title: "تسديد فواتير الإنترنت",
      description: "ادفع فواتير الإنترنت الخاصة بك بسرعة وأمان.",
      image: ADSL,
      buttonText: "سدد الآن",
      service: "ADSL",
    },
    {
      title: "تسديد فواتير الارضي",
      description: "ادفع فواتير الارضي الخاصة بك بسرعة وأمان.",
      image: ARDE1,
      buttonText: "سدد الآن",
      service: "PHONE",
    },
    {
      title: "تسديد كهرباء ومياه",
      description: "إدارة فواتير الكهرباء والمياه بكل سهولة وأمان.",
      image: elecandwater,
      buttonText: "سدد الآن",
      service: "ELEC",
    },
  ];

  return (
    <div className="paynet-point-surface">
      <h1 className="page-title">خدمات نقطة البيع</h1>
      <div className="service-grid">
        {services.map((service) => (
          <ServiceCard
            key={service.service}
            title={service.title}
            description={service.description}
            image={service.image}
            buttonText={service.buttonText}
            to="/internet"
            state={service.service}
          />
        ))}
      </div>
    </div>
  );
};

export default HomePoint;
