import React, { useEffect, useRef, useState } from "react";
import CardComponent from '../components/CardComponent ';
import { useLocation, useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import tasded from "../assets/tasded.png";
import iptv from "../assets/iptv.png";
import baka from "../assets/baka.png";
import astfham from "../assets/astfham.png";
import ScreenWrapper from "../components/ScreenWrapper";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/Custom/Card";
import { Button } from "../components/Custom/Button";
import astalam from '../assets/astalam.png'
import ADSL from '../assets/tasded.png'
import elictric from '../assets/electric.png'
import water from '../assets/water.png'


const Home = () => {

  const navigate = useNavigate();
  
  function parseJwt(token) {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      return null;
    }
  }

  const token = localStorage.getItem("token");
  const decoded = parseJwt(token);
  const email = decoded?.email;

  const location = useLocation()
  const serviceType = location.state
  
  const services = serviceType == 'ADSL' ?  [
    {
      title: "تسديد فاتورة",
      formType: "ADSL",
      description: "تسديد فاتورة انترنت واضافة رصيد",
      buttonText: "تسديد فاتورة",
      Action: (formType) => { navigate('/payinternet', { state: formType }) },
      image: tasded
    },
    {
      title:"استعلام عن فاتورة",
      formType: "astalam",
      description:"استعلام عن قيمة فاتورة انترنت ",
      buttonText:"استعلام عن فاتورة",
      Action: (formType) => { navigate('/astalam', { state: formType }) },
      image: astfham
    },
    {
      title:"تسديد IPTV",
      formType: "IPTV",
      description:" تسديد خدمة  بسرعة وامانIPTV",
      buttonText:"اضافة رصيد",
      Action:(formType) => { navigate('/payinternet', { state: formType }) },
      image:  iptv
    },
    {
      title:"شحن باقة",
      formType: "RECHARGE",
      description:"شحن باقة انترنت بسرعة وامان",
      buttonText:"شحن باقة",
      Action:(formType) => { navigate('/payinternet', { state: formType }) },
      image: baka
    },
  ] : serviceType == 'PHONE' ? [
    {
      title:"تسديد فاتورة الارضي",
      formType: "PHONE",
      description:"تسديد  فاتورة الارضي بسرعة وامان ",
      buttonText:"تسديد فاتورة الارضي",
      Action:(formType) => { navigate('/payinternet', { state: formType }) },
      image: ADSL   
    },
    {
      title:"استعلام عن الفاتورة",
      description:"استعلام عن  الفاتورة قبل التسديد",
      buttonText:"استعلام عن الفاتورة",
      Action: () => window.open('http://tarassul.sy/#BPKCMCOF', '_blank'),
      image: astalam
    },
  ]: serviceType == 'ELEC' ?[
    {
      title: "تسديد فاتورة كهرباء",
      formType: "ELEC",
      description: "تسديد فاتورة الكهرباء في جميع المحافظات",
      buttonText: "تسديد فاتورة",
      Action: (formType) => {navigate('/payinternet', {state: formType})},
      image: elictric
    }, 
    {
      title:"تسديد فاتورة المياه",
      formType: 'WATER',
      description:"تسديد فاتورة المياه في جميع المحافظات",
      buttonText:"تسديد فاتورة",
      Action: (formType) => {navigate('/payinternet', {state: formType})},
      image: water
    },
  ]:
  [];

  return (
    <ScreenWrapper>
    <div
      className="grid gap-6 p-6 sm:grid-cols-2 md:grid-cols-3 lg:gap-12 lg:grid-cols-4 place-items-center"
      dir="rtl"
    >        
      {
        services.map((service, idx) => {
          return <Card key={idx} className="w-72 h-[22rem]">
            <CardContent>
              <img className="size-2/3 mx-auto" src={service.image} alt="" />
            </CardContent>

            <CardHeader>
              <CardTitle>{service.title}</CardTitle>
              <CardDescription>{service.description}</CardDescription>
            </CardHeader>
          
            <CardFooter>
              <Button 
                className={'ml-auto'}
                variant="outline"
                onClick={() => service.Action(service.formType)}
              >{service.buttonText}</Button>
            </CardFooter>
          </Card>
        })
      }
    </div>
    </ScreenWrapper>
  );
};

export default Home;