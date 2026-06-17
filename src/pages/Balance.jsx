import { useNavigate } from "react-router-dom";
import HARAM from "../assets/HARAM.png"
import SHAMKASH from "../assets/SHAMKASH.png"
import FOAD from "../assets/FOAD.png"
import React from "react";
import ScreenWrapper from "../components/ScreenWrapper";
import PageHeader from "../components/Custom/PageHeader";
import ServiceCard from "../components/Custom/ServiceCard";



const Balance = () => {

  const navigate = useNavigate();

  const services = [
    // {
    //   title: "شركة الهرم",
    //   description: "يمكنك الحصول على معلومات التحويل من هنا",
    //   image: HARAM,
    //   service: 'HARAM',
    //   buttonText: "تعبئة رصيد",
    //   route: "/haram",
    // },
    {
      title: "شام كاش",
      description: "تعبئة رصيد عن طريق شام كاش",
      image: SHAMKASH,
      service: 'SHAMKASH',
      buttonText: "تعبئة رصيد",
      route: "/haram",
    },
    // {
    //   title: "شركة الفؤاد",
    //   description: "يمكنك االحصول على معلومات التحويل من هنا",
    //   image: FOAD,
    //   service: 'FOAD',
    //   buttonText: "تعبئة رصيد",
    //   route: "/haram",
    // },

  ];

  return (
    <ScreenWrapper>
      <PageHeader
        title="تعبئة الرصيد"
        description="اختر طريقة التحويل، ثم أرسل معلومات الإشعار ليتم تأكيد الرصيد من الإدارة."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" dir="rtl">
        {services.map((service, idx) => (
          <ServiceCard
            key={idx}
            title={service.title}
            description={service.description}
            image={service.image}
            actionLabel={service.buttonText}
            onClick={() => navigate(service.route, {state: service.service})}
          />
        ))}
      </div>
    </ScreenWrapper>
  );
};

export default Balance;
