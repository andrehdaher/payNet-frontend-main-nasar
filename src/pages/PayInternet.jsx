import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ScreenWrapper from "../components/ScreenWrapper";
import { Card, CardContent, CardHeader } from "../components/Custom/Card";
import { Input } from "../components/Custom/Input";
import { Button } from "../components/Custom/Button";
import { useLocation } from "react-router-dom";
import { internetDetails } from "../components/payInternet/internetDetails";

export default function PayInternet() {
  const vantaRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [landline, setLandline] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedSpeed, setSelectedSpeed] = useState("");
  const [amountToPay, setAmountToPay] = useState("");
  const [paymentType, setPaymentType] = useState("cash"); // القيمة الافتراضية نقداً
  const location = useLocation()
  const formType = location.state
  const config = internetDetails[formType] || {};



  function parseJwt(token) {
    try {
      return JSON.parse(atob(token.split(".")[1]));

    } catch (e) {
      return null;
    }
  }

  const multiplier = config.multiplier;
  const calculatedAmount = amountToPay ? (amountToPay * multiplier).toFixed(2) : "";


  const inputs = [
    {
      id: "landline",
      label: config.label,
      type: "number",
      value: landline,
      onChange: setLandline,
    },
    {
      id: '1'
    },
    {
      id: "2"
    },
    {
      id: "amountToPay",
      label: ['شحن يدوي jawaker'].includes(config.title) ? "ادخل الكمية التي تريد شحنها" : "المبلغ المراد تسديده",
      type: "number",
      value: amountToPay,
      onChange: setAmountToPay,
      min: config.min
    },
    {
      id: "calculatedAmount",
      label: "المبلغ المطلوب",
      type: "number",
      value: calculatedAmount,
      readOnly: true,
    },
  ];
  const isFormValid =
    landline && selectedCompany && (selectedSpeed || ['PHONE', 'SYR', 'MTN'].includes(formType)) && amountToPay;

  const companies = config.companies || [];
  const speeds = Array.isArray(config.speeds) ? config.speeds : [];
  const title = config.title || "";
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const token = localStorage.getItem("token");
    const decoded = parseJwt(token);
    const email = decoded?.email;


    try {
      const res = await axios.post(
        "https://paynet-1.onrender.com/api/payment/internet-full",
        {
          landline,
          company: selectedCompany,
          speed: selectedSpeed,
          amount: parseFloat(amountToPay),
          email,
          paymentType,
          calculatedAmount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("تم التسديد بنجاح. الرصيد الجديد: " + res.data.newBalance);


      // إعادة تعيين الحقول
      setLandline("");
      setSelectedCompany("");
      setSelectedSpeed("");
      setAmountToPay("");
      // إعادة تحميل الصفحة أو تحديث الحالة حسب الحاجة
      window.location.reload();

    } catch (err) {
      alert(err.response?.data?.message || "حدث خطأ");
      // التوكن غير صالح، نسجل الخروج
      localStorage.removeItem('token'); // أو حسب تخزينك للتوكن
      window.location.href = '/login'; // إعادة توجيه لصفحة تسجيل الدخول
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (['PHONE', 'PAYCELL', 'USDTTRC20', 'USDTBEB20', 'SYR', 'MTN', 'pubg', 'pubgtr', 'freefire', 'ballpool8', 'clashclans', 'clashroyal', 'jawakerman', 'jawaker', 'knivesout', 'ludoking', 'mobilelegend', 'projectentropy', 'whithoutsurvivial'].includes(formType)) { setSelectedSpeed('0') }
  }, [])

  return (
    <ScreenWrapper className={'min-h-screen flex items-center justify-center p-4'}>
      <Card>
        <CardHeader>

          <h1 className="text-2xl">
            {title}
          </h1>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6 ">
            {/* الحقول النصية */}
            <div className="grid grid-cols-2 gap-6">
              {inputs.map((input, idx) => (
                input.id == 1 ? <>
                  <div className="relative">
                    <label className="block mb-1 mr-3 text-sm font-medium text-foreground">
                      {config.description}
                    </label>
                    <select
                      value={selectedCompany}
                      onChange={(e) => setSelectedCompany(e.target.value)}
                      className="peer h-10 w-full text-foreground px-2 bg-foreground/10 border rounded-md border-foreground/50 outline-none"
                      required
                    >
                      {companies.map((company) => (
                        <option key={company} value={company}>
                          {company}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
                  : input.id == 2 ? <>
                    {/* اختيار السرعة أو العداد */}
                    {(Array.isArray(config.speeds) && config.speeds.length > 0) || config.speeds === "counter" || config.speeds === 'mobilelegend' || config.speeds === 'BANKTR' ? (
                      config.speeds === "counter" || config.speeds === 'mobilelegend' || config.speeds === 'BANKTR' ? (
                        <Input
                          key={input.id}
                          id={input.id}
                          label={config.speeds === 'mobilelegend' ? 'يرجى ادخال Zone ID' : config.speeds === 'BANKTR' ? "يرجى ادخال رقم الحساب" : 'رقم الاشتراك / العداد'}
                          type={'number'}
                          value={selectedSpeed}
                          onChange={(e) => setSelectedSpeed(e.target.value)}
                          required
                        />
                      ) : (
                        <div className="relative col-span-2">
                          <label className="block mb-1 mr-3 text-sm font-medium text-foreground">
                            {formType == 'ADSL' ? 'اختر السرعة' : 'اختر الباقة'}
                          </label>
                          <select
                            value={selectedSpeed}
                            onChange={(e) => setSelectedSpeed(e.target.value)}
                            className="peer h-10 w-full text-foreground px-2 bg-foreground/10 border rounded-md border-foreground/50 outline-none"
                            required
                          >
                            <option value="" disabled hidden></option>
                            {speeds.map((speed) => (
                              <option key={speed} value={speed}>
                                {speed}
                              </option>
                            ))}
                          </select>
                        </div>
                      )
                    ) : null}
                  </>
                    :
                    <Input
                      key={input.id}
                      id={input.id}
                      label={input.label}
                      type={input.type}
                      value={input.value}
                      onChange={(e) => input.onChange && input.onChange(e.target.value)}
                      readOnly={input.readOnly || false}
                      required={!input.readOnly}
                      min={input.min}
                    />
              ))}
            </div>

            {/* نوع الدفع */}
            <div className="">
              <label className="block mb-2 mr-3 text-sm font-medium text-foreground">
                نوع الدفع
              </label>
              <div className="flex gap-2">
                <Button
                  type={'button'}
                  className={'w-1/2'}
                  onClick={() => {
                    setPaymentType('cash')
                  }}
                  variant={paymentType == 'cash' ? 'default' : 'outline'}
                >
                  نقدا
                </Button>
                <Button
                  type={'button'}
                  className={'w-1/2'}
                  onClick={() => {
                    setPaymentType('credit')
                  }}
                  variant={paymentType == 'credit' ? 'default' : 'outline'}
                >
                  دين
                </Button>
              </div>
            </div>

            {/* زر التسديد */}
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className={`w-full py-3 rounded-lg font-semibold transition ${isFormValid
                ? "bg-violet-600 hover:bg-violet-700 text-white cursor-pointer"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
            >
              {isSubmitting ? "جاري التسديد..." : "تسديد الفاتورة"}
            </button>
          </form>
        </CardContent>
      </Card>
    </ScreenWrapper>
  );
}