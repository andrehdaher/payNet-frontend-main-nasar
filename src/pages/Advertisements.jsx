import React from "react";
import ScreenWrapper from "../components/ScreenWrapper";
import Dlink from "../assets/Dlink124.png";
import LiteBeam from '../assets/litebeam.png'
import CardProduct from "../components/CardProduct";

export default function Advertisements() {
  const products = [
    {
      title: "تسديد فاتورة",
      description: "تسديد فاتورة انترنت واضافة رصيد",
      image: Dlink,
      price: 17,
      action: () => console.log("تم الضغط"),
      textButton: "شراء",
    },
    {
      title: "صحن LiteBeam m5",
      description: "صحن حديث بسرعة عالية",
      image: LiteBeam,
      price: 50,
      action: () => console.log("تم الضغط"),
      textButton: "شراء",
    },
    {
      title: "صحن LiteBeam m5",
      description: "صحن حديث بسرعة عالية",
      image: LiteBeam,
      price: 50,
      action: () => console.log("تم الضغط"),
      textButton: "شراء",
    },
    {
      title: "صحن LiteBeam m5",
      description: "صحن حديث بسرعة عالية",
      image: LiteBeam,
      price: 50,
      action: () => console.log("تم الضغط"),
      textButton: "شراء",
    },
    {
      title: "صحن LiteBeam m5",
      description: "صحن حديث بسرعة عالية",
      image: LiteBeam,
      price: 50,
      action: () => console.log("تم الضغط"),
      textButton: "شراء",
    },
    {
      title: "صحن LiteBeam m5",
      description: "صحن حديث بسرعة عالية",
      image: LiteBeam,
      price: 50,
      action: () => console.log("تم الضغط"),
      textButton: "شراء",
    },
    {
      title: "صحن LiteBeam m5",
      description: "صحن حديث بسرعة عالية",
      image: LiteBeam,
      price: 50,
      action: () => console.log("تم الضغط"),
      textButton: "شراء",
    },

  ];

  return (
    <ScreenWrapper>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold mb-4 text-gray-800">البضائع</h1>
          <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
            {products.map((product, idx) => (
              <CardProduct
                key={idx}
                title={product.title}
                description={product.description}
                image={product.image}
                price={product.price}
                action={product.action}
                textButton={product.textButton}
              />
            ))}
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold mb-4 text-gray-800">برامج محاسبة</h1>
        </div>

        <div>
          <h1 className="text-2xl font-bold mb-4 text-gray-800">خدمات</h1>
        </div>
      </div>
    </ScreenWrapper>
  );
}
