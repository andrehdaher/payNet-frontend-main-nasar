import React from "react";
import ScreenWrapper from "../components/ScreenWrapper";
import Dlink from "../assets/Dlink124.png";
import LiteBeam from '../assets/litebeam.png'
import CardProduct from "../components/CardProduct";
import axios from "axios";
import { useState, useEffect } from "react";

export default function Advertisements() {
  const [products, setProducts] = useState([])
  const [name, setName] = useState("")
  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:5000/api/product/get-product",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProducts(res.data);
    } catch (err) {
      console.error("فشل في جلب المنتجات:", err);
    }
  };
  useEffect(() => {

    fetchProducts();
  }, [])

  const handleWhatsappOrder = (productName) => {
    const phoneNumber = "963993822320"; // استبدل هذا بالرقم الذي تريد استقبال الرسائل عليه
    const message = `مرحبًا، أرغب في طلب المنتج: ${productName}`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  }
  const handleSearch = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Searching for:", name);
      const res = await axios.get(
        `http://localhost:5000/api/product/search-product?name=${name}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProducts(res.data);
    } catch (err) {
      console.error("فشل في جلب نتائج البحث:", err);
    }


  };
  useEffect(() => {
    if (name.trim() === "") {
      fetchProducts();
      return;
    };
    handleSearch();
  }, [name]);



  return (
    <ScreenWrapper>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold m-6 text-gray-800 p-3 flex flex-col items-center gap-2 transition-all duration-300 ease-out hover:-translate-y-2  hover:text-gray-900">
            🛒 البضائع
            <span className="w-full h-[4px] bg-gray-200 rounded"></span>
          </h1>
          <input
            type="text"
            placeholder="ابحث عن منتج..."
            className="w-full  p-2 border border-gray-300 rounded-lg mb-4 cursor-pointer  text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            value={name}

            onChange={(e) => setName(e.target.value)}


          />
          <div className="
  grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
  gap-6
  max-h-[70vh]
  overflow-y-auto
  pb-4
  justify-items-center
">

            {products.map((product, idx) => (
              <CardProduct

                key={idx}
                title={product.name}
                description={product.description}
                image={product.imageUrl}
                price={product.price}
                action={() => handleWhatsappOrder(product.name)}
                textButton={'اطلب الآن'}
              />
            ))}
          </div>
        </div>


      </div>
    </ScreenWrapper>
  );
}
