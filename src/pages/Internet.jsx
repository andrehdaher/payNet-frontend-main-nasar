import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from 'react-router-dom';
import tasded from "../assets/tasded.png";
import iptv from "../assets/iptv.png";
import baka from "../assets/baka.png";
import astfham from "../assets/astfham.webp";
import ScreenWrapper from "../components/ScreenWrapper";
import ServiceCard from "../components/Card";
import { Button } from "../components/Custom/Button";
import astalam from '../assets/astalam.webp'
import ADSL from '../assets/tasded.png'
import elictric from '../assets/electric.webp'
import water from '../assets/water.webp'
import SYRIATEL from '../assets/SYRIATEL.jpeg'
import MTN from '../assets/MTN.jpeg'
import PlayDetails from "../components/payInternet/PlayDetails";
import ApplicationDetails from "../components/payInternet/ApplicationDetails";
import Usdtpay from "../components/payInternet/Usdtpay";
import ViewApp from "../components/payInternet/ViewApp";
import AI from "../components/payInternet/AI";
const Home = () => {


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
      route: "/payinternet",
      image: tasded
    },
    {
      title: "استعلام عن فاتورة",
      formType: "astalam",
      description: "استعلام عن قيمة فاتورة انترنت ",
      buttonText: "استعلام عن فاتورة",
      route: "/astalam",
      image: astfham
    },
    {
      title: "تسديد IPTV",
      formType: "IPTV",
      description: " تسديد خدمة  بسرعة وامانIPTV",
      buttonText: "اضافة رصيد",
      route: "/payinternet",
      image: iptv
    },
    {
      title: "شحن باقة",
      formType: "RECHARGE",
      description: "شحن باقة انترنت بسرعة وامان",
      buttonText: "شحن باقة",
      route: "/payinternet",
      image: baka
    },
  ] : serviceType == 'PHONE' ? [
    {
      title: "تسديد فاتورة الارضي",
      formType: "PHONE",
      description: "تسديد  فاتورة الارضي بسرعة وامان ",
      buttonText: "تسديد فاتورة الارضي",
      route: "/payinternet",
      image: ADSL
    },
    {
      title: "استعلام عن الفاتورة",
      description: "استعلام عن  الفاتورة قبل التسديد",
      buttonText: "استعلام عن الفاتورة",
      externalUrl: "http://tarassul.sy/#BPKCMCOF",
      image: astalam
    },
  ] : serviceType == 'ELEC' ? [
    {
      title: "تسديد فاتورة كهرباء",
      formType: "ELEC",
      description: "تسديد فاتورة الكهرباء في جميع المحافظات",
      buttonText: "تسديد فاتورة",
      route: "/payinternet",
      image: elictric
    },
    {
      title: "تسديد فاتورة المياه",
      formType: 'WATER',
      description: "تسديد فاتورة المياه في جميع المحافظات",
      buttonText: "تسديد فاتورة",
      route: "/payinternet",
      image: water
    },

  ] : serviceType == 'SYR' ? [
    {
      title: "تحويل وحدات سريتل",
      formType: 'SYR',
      description: "تحويل وحدات وفواتير سريتل وسريتل كاش",
      buttonText: "تسديد فاتورة",
      route: "/payinternet",
      image: SYRIATEL
    },
    {
      title: "تحويل وحدات MTN",
      formType: 'MTN',
      description: "تحويل وحدات وفواتير MTN MTN كاش",
      buttonText: "تسديد فاتورة",
      route: "/payinternet",
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
              [];

  const visibleServices = services.slice(0, visibleCount);


  return (
    <ScreenWrapper>
      <h1 className="page-title">خدمات الدفع</h1>
      {!services.length && <p className="page-message">اختر قسمًا من <Link className="text-violet-700 underline" to="/">الصفحة الرئيسية</Link>.</p>}
      <div className="service-grid">

        {visibleServices.map((service, idx) => (
          <ServiceCard
            key={service.formType ?? service.title}
            {...service}
            to={service.route}
            state={service.formType}
            eager={idx < 3}
          />
        ))}
      </div>
      {visibleCount < services.length && (
        <div className="flex justify-center  mt-6">
          <Button
            className='w-full max-w-xs'
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