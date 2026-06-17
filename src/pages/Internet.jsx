import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import tasded from "../assets/tasded.png";
import iptv from "../assets/iptv.png";
import baka from "../assets/baka.png";
import astfham from "../assets/astfham.png";
import ScreenWrapper from "../components/ScreenWrapper";
import { Button } from "../components/Custom/Button";
import PageHeader from "../components/Custom/PageHeader";
import ServiceCard from "../components/Custom/ServiceCard";
import EmptyState from "../components/Custom/EmptyState";
import astalam from '../assets/astalam.png'
import ADSL from '../assets/tasded.png'
import elictric from '../assets/electric.png'
import water from '../assets/water.png'
import SYRIATEL from '../assets/SYRIATEL.jpeg'
import MTN from '../assets/MTN.jpeg'
import PlayDetails from "../components/payInternet/PlayDetails";
import ApplicationDetails from "../components/payInternet/ApplicationDetails";
import Usdtpay from "../components/payInternet/Usdtpay";
import ViewApp from "../components/payInternet/ViewApp";
import AI from "../components/payInternet/AI";
import programes from "../components/payInternet/programes";
const Home = () => {


  const navigate = useNavigate();
  const [cardKey, setCardKey] = useState([]);

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
  const ITEMS_PER_LOAD = 12;
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_LOAD);
  const location = useLocation()
  const serviceType = location.state



  const services = serviceType == 'ADSL' ? [
    {
      title: "تسديد فاتورة",
      formType: "ADSL",
      description: "تسديد فاتورة انترنت واضافة رصيد",
      buttonText: "تسديد فاتورة",
      Action: (formType) => { navigate('/payinternet', { state: formType }) },
      image: tasded
    },
    {
      title: "استعلام عن فاتورة",
      formType: "astalam",
      description: "استعلام عن قيمة فاتورة انترنت ",
      buttonText: "استعلام عن فاتورة",
      Action: (formType) => { navigate('/astalam', { state: formType }) },
      image: astfham
    },
    {
      title: "تسديد IPTV",
      formType: "IPTV",
      description: " تسديد خدمة  بسرعة وامانIPTV",
      buttonText: "اضافة رصيد",
      Action: (formType) => { navigate('/payinternet', { state: formType }) },
      image: iptv
    },
    {
      title: "شحن باقة",
      formType: "RECHARGE",
      description: "شحن باقة انترنت بسرعة وامان",
      buttonText: "شحن باقة",
      Action: (formType) => { navigate('/payinternet', { state: formType }) },
      image: baka
    },
  ] : serviceType == 'PHONE' ? [
    {
      title: "تسديد فاتورة الارضي",
      formType: "PHONE",
      description: "تسديد  فاتورة الارضي بسرعة وامان ",
      buttonText: "تسديد فاتورة الارضي",
      Action: (formType) => { navigate('/payinternet', { state: formType }) },
      image: ADSL
    },
    {
      title: "استعلام عن الفاتورة",
      description: "استعلام عن  الفاتورة قبل التسديد",
      buttonText: "استعلام عن الفاتورة",
      Action: () => window.open('http://tarassul.sy/#BPKCMCOF', '_blank'),
      image: astalam
    },
  ] : serviceType == 'ELEC' ? [
    {
      title: "تسديد فاتورة كهرباء",
      formType: "ELEC",
      description: "تسديد فاتورة الكهرباء في جميع المحافظات",
      buttonText: "تسديد فاتورة",
      Action: (formType) => { navigate('/payinternet', { state: formType }) },
      image: elictric
    },
    {
      title: "تسديد فاتورة المياه",
      formType: 'WATER',
      description: "تسديد فاتورة المياه في جميع المحافظات",
      buttonText: "تسديد فاتورة",
      Action: (formType) => { navigate('/payinternet', { state: formType }) },
      image: water
    },

  ] : serviceType == 'SYR' ? [
    {
      title: "تحويل وحدات سريتل",
      formType: 'SYR',
      description: "تحويل وحدات وفواتير سريتل وسريتل كاش",
      buttonText: "تسديد فاتورة",
      Action: (formType) => { navigate('/payinternet', { state: formType }) },
      image: SYRIATEL
    },
    {
      title: "تحويل وحدات MTN",
      formType: 'MTN',
      description: "تحويل وحدات وفواتير MTN MTN كاش",
      buttonText: "تسديد فاتورة",
      Action: (formType) => { navigate('/payinternet', { state: formType }) },
      image: MTN
    }
  ] :
    serviceType == 'play' ?
      [
        ...PlayDetails()
      ] :
      serviceType == 'application' ?
        [
          ...ApplicationDetails()

        ] :
        serviceType == 'usdtpay' ?
          [
            ...Usdtpay()


          ] :
          serviceType == 'viewapp' ?
            [
              ...ViewApp()
            ]
            :
            serviceType == 'ai' ?
              [
                ...AI()
              ] :
              serviceType == 'Software' ?
                [
                  ...programes()
                ] :
                [];

  const visibleServices = services.slice(0, visibleCount);


  return (
    <ScreenWrapper>
      <PageHeader
        title="اختيار الخدمة"
        description="اختر نوع العملية المطلوبة للمتابعة إلى نموذج الدفع أو الشراء."
        onBack={() => navigate("/")}
      />

      {visibleServices.length === 0 ? (
        <EmptyState title="لا توجد خدمات في هذا القسم" description="ارجع إلى الصفحة الرئيسية واختر قسما آخر." />
      ) : (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" dir="rtl">
        {
          visibleServices.map((service, idx) => {
            return <ServiceCard
                onClick={() => service.Action(service.formType)}
              key={idx}
              title={service.title}
              description={service.description}
              image={service.image}
              actionLabel={service.buttonText}
            />

          })

        }
      </div>
      )}
      {visibleCount < services.length && (
        <div className="flex justify-center  mt-6">
          <Button
            className='w-80'
            onClick={() => setVisibleCount(prev => prev + ITEMS_PER_LOAD)}
          >
            تحميل المزيد
          </Button>
        </div>
      )}

    </ScreenWrapper>
  );
};

export default Home;
