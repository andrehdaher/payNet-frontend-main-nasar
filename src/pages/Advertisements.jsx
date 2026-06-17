import React from "react";
import ScreenWrapper from "../components/ScreenWrapper";
import Dlink from "../assets/Dlink124.png";
import LiteBeam from '../assets/litebeam.png'
import CardProduct from "../components/CardProduct";
import axios from "axios";
import { useState, useEffect } from "react";
import PageHeader from "../components/Custom/PageHeader";
import EmptyState from "../components/Custom/EmptyState";
import { Input } from "../components/Custom/Input";

export default function Advertisements() {
  const [products, setProducts] = useState([])
  const [name, setName] = useState("")
  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "https://paynet-1.onrender.com/api/payment/save-number/api/product/get-product",
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
      const res = await axios.get(
        `https://paynet-1.onrender.com/api/payment/save-number/api/product/search-product?name=${name}`,
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
          <PageHeader title="البضائع" description="ابحث عن المنتجات المتاحة واطلبها مباشرة عبر واتساب." />
          <Input
            id="product-search"
            type="text"
            label="البحث"
            placeholder="ابحث عن منتج..."
            containerClassName="mb-4"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {products.length === 0 ? (
            <EmptyState title="لا توجد منتجات" description="غيّر البحث أو تحقق لاحقا عند إضافة منتجات جديدة." />
          ) : (
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
          )}
        </div>


      </div>
    </ScreenWrapper>
  );
}
