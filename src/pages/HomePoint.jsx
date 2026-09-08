import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../context/NotificationContext";
import { io } from "socket.io-client";
import ScreenWrapper from "../components/ScreenWrapper";
import PageHeader from "../components/Custom/PageHeader";
import ServiceCard from "../components/Custom/ServiceCard";
import { HOME_SERVICES } from "../config/homeServices";
import { apiUrl } from "../config/api";

export default function HomePoint() {
  const navigate = useNavigate();
  const { setHasNewUnpaid } = useNotification();

  useEffect(() => {
    const newSocket = io(apiUrl(""));
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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" dir="rtl">
        {HOME_SERVICES.map((service) => (
          <ServiceCard
            key={service.service}
            title={service.title}
            description={service.description}
            image={service.image}
            imageFit={service.imageFit}
            actionLabel={service.buttonText}
            onClick={() => navigate(service.route, { state: service.service })}
          />
        ))}
      </div>
    </ScreenWrapper>
  );
}
