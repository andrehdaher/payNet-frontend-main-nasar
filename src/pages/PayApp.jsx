import React, { useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { appDetails } from "../components/payInternet/appDetails";
import AppCard from "../components/payInternet/CardApp";
import ScreenWrapper from "../components/ScreenWrapper";
import PurchaseModal from "../components/payInternet/PurchaseModal";
import { useToast } from "../context/ToastContext";
import {
  authConfig,
  getApiErrorMessage,
  getCurrentEmail,
  paymentQueryKeys,
} from "../api/paymentQueries";

export default function PayApp() {
  const toast = useToast();
  const location = useLocation();
  const formType = location.state;
  const config = appDetails[formType] || [];
  const multiplier = config.multiplier || 1;
  const [paymentType] = useState("cash");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const productQuery = useQuery({
    queryKey: paymentQueryKeys.productOnline(formType),
    queryFn: async () => {
      const response = await axios.get(`https://paynet-1.onrender.com/api/payment/save-number/api/productonline/get-product-online?name=${formType}`);
      return {
        card: response.data?.card?.[0] || [],
        placeholder: response.data?.products?.[0]?.type || "ادخل الـ ID",
      };
    },
    enabled: Boolean(formType),
  });

  const paymentMutation = useMutation({
    mutationFn: ({ product, extra }) => {
      const email = getCurrentEmail();

      if (!email) {
        throw new Error("الرجاء تسجيل الدخول");
      }

      const calculatedAmount = Number((product.price * multiplier).toFixed(2));

      return axios.post(
        "https://paynet-1.onrender.com/api/payment/save-number/api/payment/internet-full",
        {
          landline: product.name,
          company: product.title,
          speed: product.url,
          amount: product.price,
          email,
          paymentType,
          calculatedAmount,
          ...extra,
        },
        authConfig(),
      );
    },
    onSuccess: () => {
      toast.success("تم التسديد بنجاح. سوف تصلكم معلومات الاشتراك برسالة واتساب");
      setShowModal(false);
      setSelectedProduct(null);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "حدث خطأ"));
    },
  });

  const placeholder = productQuery.data?.placeholder || "ادخل الـ ID";
  const cards = productQuery.data?.card || [];

  const getPlaceholder = () => {
    if (
      placeholder.includes("view") ||
      selectedProduct?.title?.includes("حساب جديد جاهز لمدة شهر")
    ) {
      return "ادخل رقم الواتس لارسال معلومات الاشتراك";
    }

    if (selectedProduct?.title?.includes(" تجديد ")) {
      return "ادخل الايميل";
    }

    return "ادخل الـ ID الخاص بك";
  };

  return (
    <>
      <PurchaseModal
        open={showModal}
        title={selectedProduct?.title}
        price={selectedProduct?.price}
        name={selectedProduct?.name}
        placeholder={getPlaceholder()}
        loading={paymentMutation.isPending}
        onClose={() => {
          if (!paymentMutation.isPending) setShowModal(false);
        }}
        onConfirm={(value) =>
          paymentMutation.mutateAsync({
            product: selectedProduct,
            extra: { playerId: value.value, password: value.password },
          })
        }
      />

      <ScreenWrapper>
        {productQuery.isError && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-800" dir="rtl">
            {getApiErrorMessage(productQuery.error, "حدث خطأ أثناء جلب المنتجات")}
          </div>
        )}
        <div className="my-2 grid grid-cols-1 place-items-center gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {productQuery.isLoading ? (
            <p className="text-sm font-semibold text-slate-600" dir="rtl">جاري تحميل المنتجات...</p>
          ) : (
            cards.map((item, index) => (
              <AppCard
                key={item._id || item.id || index}
                data={item}
                name={formType}
                onClick={(data) => {
                  setSelectedProduct(data);
                  setShowModal(true);
                }}
              />
            ))
          )}
        </div>
      </ScreenWrapper>
    </>
  );
}
