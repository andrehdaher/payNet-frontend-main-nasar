import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ADSL from "../assets/ADSL.png";
import elecandwater from "../assets/elecandwater.png";
import ARDE1 from "../assets/ARDE1.png";
import { useNotification } from "../context/NotificationContext";
import { io } from "socket.io-client";
import ScreenWrapper from "../components/ScreenWrapper";
import PageHeader from "../components/Custom/PageHeader";
import ServiceCard from "../components/Custom/ServiceCard";

const services = [
  {
    title: "تسديد فواتير الإنترنت",
    description: "ادفع فواتير الإنترنت بسرعة وأمان.",
    image: ADSL,
    buttonText: "سدد الآن",
    service: "ADSL",
  },
  {
    title: "تسديد فواتير الأرضي",
    description: "ادفع فواتير الهاتف الأرضي بسرعة وأمان.",
    image: ARDE1,
    buttonText: "سدد الآن",
    service: "PHONE",
  },
  {
    title: "تسديد كهرباء ومياه",
    description: "إدارة فواتير الكهرباء والمياه بسهولة.",
    image: elecandwater,
    buttonText: "سدد الآن",
    service: "ELEC",
  },
];

export default function HomePoint() {
  const navigate = useNavigate();
  const { setHasNewUnpaid } = useNotification();

  useEffect(() => {
    const newSocket = io("https://paynet-1.onrender.com/api/payment/save-number");
    newSocket.on("connect", () => {
      newSocket.emit("financial", "done");
    });
    newSocket.on("json_message", (data) => {
      setHasNewUnpaid(data);
    });
    return () => newSocket.disconnect();
  }, [setHasNewUnpaid]);

  return (
    <ScreenWrapper>
      <PageHeader title="خدمات نقطة البيع" description="اختر الخدمة المطلوبة لإتمام العملية." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <ServiceCard
            key={service.service}
            title={service.title}
            description={service.description}
            image={service.image}
            actionLabel={service.buttonText}
            onClick={() => navigate("/internet", { state: service.service })}
          />
        ))}
      </div>
    </ScreenWrapper>
  );
}
