import ServiceCard from "../components/Card";
import SHAMKASH from "../assets/SHAMKASH.png";
import ScreenWrapper from "../components/ScreenWrapper";

const Balance = () => {

  const services = [
    // {
    //   title: "شركة الهرم",
    //   description: "يمكنك الحصول على معلومات التحويل من هنا",
    //   image: HARAM,
    //   service: "HARAM",
    //   buttonText: "تعبئة رصيد",
    //   route: "/haram",
    // },
    {
      title: "شام كاش",
      description: "تعبئة رصيد عن طريق شام كاش",
      image: SHAMKASH,
      service: "SHAMKASH",
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
    // {
    //   title: "syriatel and mtn",
    //   description: "للحصول على معلومات التحويل عن طريق كاش سريتل و mtn",
    //   image: syrmtn,
    //   service: "SYRMTN",
    //   buttonText: "معلومات التحويل",
    //   route: "/haram",
    // },
    // {
    //   title: "دفعة نقدية",
    //   description: "اضافة دفعة نقدية عن طريق المكتب",
    //   image: cash,
    //   service: "CASH",
    //   buttonText: "معلومات التحويل",
    //   route: "/haram",
    // },
  ];

  return (
    <ScreenWrapper>
      <h1 className="page-title">تعبئة الرصيد</h1>
      <div className="service-grid">
        {services.map((service, idx) => (
          <ServiceCard key={service.title} {...service} to={service.route} state={service.service} eager={idx < 3} />
        ))}
      </div>
    </ScreenWrapper>
  );
};

export default Balance;
