import ServiceCard from "../components/Card";
import { useNavigate } from "react-router-dom";
import HARAM from "../assets/HARAM.png"
import SHAMKASH from "../assets/SHAMKASH.png"
import FOAD from "../assets/FOAD.png"
import NavBar from '../components/NavBar'
import React, { useEffect, useState , useRef } from "react";
import ScreenWrapper from "../components/ScreenWrapper";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/Custom/Card";
import { Button } from "../components/Custom/Button";



const Balance = () => {

  const navigate = useNavigate();

  const services = [
    {
      title: "شركة الهرم",
      description: "يمكنك الحصول على معلومات التحويل من هنا",
      image: HARAM,
      service: 'HARAM',
      buttonText: "تعبئة رصيد",
      route: "/haram",
    },
    {
      title: "شام كاش",
      description: "تعبئة رصيد عن طريق شام كاش",
      image: SHAMKASH,
      service: 'SHAMKASH',
      buttonText: "تعبئة رصيد",
      route: "/haram",
    },
    {
      title: "شركة الفؤاد",
      description: "يمكنك االحصول على معلومات التحويل من هنا",
      image: FOAD,
      service: 'FOAD',
      buttonText: "تعبئة رصيد",
      route: "/haram",
    },

  ];

  return (
    <ScreenWrapper>
      <div  
        className="grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3 place-items-center"
        dir="rtl"
      >
        {services.map((service, idx) => (
          <Card key={idx} className="">
            <CardContent>
              <img className="w-96 h-48 mx-auto" src={service.image} alt="" />
            </CardContent>

            <CardHeader>
              <CardTitle>{service.title}</CardTitle>
              <CardDescription>{service.description}</CardDescription>
            </CardHeader>


            <CardFooter>
              <Button
                className="ml-auto" 
                variant="outline"
                onClick={() => navigate(service.route, {state: service.service})}
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

export default Balance;
