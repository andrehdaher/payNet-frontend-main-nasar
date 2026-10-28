import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/NavBar";
import axios from "axios";
import ScreenWrapper from "../components/ScreenWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "../components/Custom/Card";
import { Input } from "../components/Custom/Input";
import { Button } from "../components/Custom/Button";
import { useLocation } from "react-router-dom";
import qrImage from "../assets/QRcode.png";
import { div } from "three/tsl";
import select from "daisyui/components/select";


export default function TransferForm() {

  const [isSubmitting, setIsSubmitting] = useState(false);
  const location = useLocation()
  const [selectedNumber, setSelectedNumber] = useState(""); // الرقم المختار
  const [operator, setOperator] = useState("");
  const syriatelNumbers = ["0931402801", "0991095594", "0996833722", "0934238827", '0982545390'];
  const mtnNumbers = ["0968711645", "0957631500", "0957773023", "0946158361"];
  const serviceType = location.state

  const [formData, setFormData] = useState({
    name: "",
    destination: serviceType == "HARAM" ? "لانا تمام شاهين - سلمية - هرم " : serviceType == 'SYRMTN' ? "الشركة السريتيل و MTN" : serviceType == "SHAMKASH" ? "alfanet" : "لانا تمام شاهين - سلمية " ,
    number: serviceType == "FOAD" ? "0968711645" : "0968711645",
    operator: "",
    noticeNumber: "",
    amount: "",
    date: "",
  });

  function parseJwt(token) {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      return null;
    }
  }



  useEffect(() => {
    const token = localStorage.getItem("token");
    const decoded = parseJwt(token);
    if (decoded && decoded.email) {
      setFormData((prev) => ({ ...prev, name: decoded.email }));
    }
  }, []);




  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // تحديث عند اختيار شركة
  const handleOperatorChange = (e) => {
    const selected = e.target.value;
    setOperator(selected);
    setFormData((prev) => ({ ...prev, operator: selected }));
  };

  // تحديث عند اختيار رقم
  const handleNumberChange = (e) => {
    const num = e.target.value;
    setSelectedNumber(num);
    setFormData((prev) => ({ ...prev, number: num }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // حماية إضافية
    setIsSubmitting(true);

    const token = localStorage.getItem("token");
    const decoded = parseJwt(token);

    await axios.post("https://paynet-main-nasar.onrender.com/api/saveBalance/haram", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    alert("تم تحويل الإشعار بنجاح");

    setFormData({
      name: "",
      destination: "ماهر حبيب ضاهر - محردة - هرم ",
      number: "0969735667",
      operator: "",
      noticeNumber: "",
      amount: "",
      date: "",
    });
    setIsSubmitting(false); // إعادة التفعيل

  };

  return (
    <ScreenWrapper>
      <form
        onSubmit={handleSubmit}
        className="w-3/4 mx-auto mt-8"
        dir="rtl"
      >
        <Card>
          <CardHeader>
            <CardTitle>
              تحويل اشعار
            </CardTitle>
          </CardHeader>
          <CardContent className=' grid grid-cols-2 gap-2'>
            <Input
              name="name"
              type="text"
              label="اسم المستخدم"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <div>
              {/* نوع الخدمة */}
              {serviceType === "SYRMTN" ? (
                <select
                  className="flex h-10 w-full mt-6 rounded-md 
          border border-foreground/50 bg-foreground/10 px-3 
          py-2 text-foreground text-base ring-offset-background 
          placeholder:text-foreground focus-visible:outline-none 
          focus-visible:ring-2 focus-visible:ring-ring 
          focus-visible:ring-offset-2 disabled:cursor-not-allowed 
          disabled:opacity-50 md:text-sm transition-all duration-500"
                  value={operator}
                  onChange={handleOperatorChange}
                >
                  <option value="">اختر الشركة</option>
                  <option value="syriatel">سيريتل</option>
                  <option value="mtn">MTN</option>
                </select>
              ) : null}

              {/* الأرقام حسب الشركة */}
              {operator === "syriatel" && (
                <select
                  className="flex h-10 w-full mt-4 rounded-md border border-foreground/50 
          bg-foreground/10 px-3 py-2 text-foreground text-base"
                  value={selectedNumber}
                  onChange={handleNumberChange}

                >
                  {syriatelNumbers.map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              )}

              {operator === "mtn" && (
                <select
                  className="flex h-10 w-full mt-4 rounded-md border border-foreground/50 
          bg-foreground/10 px-3 py-2 text-foreground text-base"
                >
                  {mtnNumbers.map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              )}
            </div>
            {
              serviceType == 'SHAMKASH' ?
                <div className="col-span-2 text-center space-y-2">

                  <p className="font-semibold text-sm text-gray-600">امسح رمز QR التالي للتحويل إلى الرقم:</p>

                  <img src={qrImage} alt="QR Code" className="mx-auto w-40 h-40 object-contain" />

                </div>
                : null

            }
            {serviceType != 'SYRMTN' ?
              <>

                <Input

                  className='col-span-2'
                  name="destination"
                  type="text"
                  label="الى"
                  value={formData.destination}
                  onChange={handleChange}
                  required
                />

              </>
              : null

            }
            {serviceType == 'HARAM' ?
              <>
                <Input
                  name="number"
                  type="text"
                  label="الرقم"
                  value={formData.number}
                  onChange={handleChange}
                  required
                />
              </>
              : null

            }
            <Input
              name="operator"
              type="text"
              label="صاحب الاشعار"
              value={formData.operator}
              onChange={handleChange}
              required
            />

            <Input
              name="noticeNumber"
              type="text"
              label="رقم الإشعار"
              value={formData.noticeNumber}
              onChange={handleChange}
              required
            />
            <Input
              name="amount"
              type="number"
              label="المبلغ"
              value={formData.amount}
              onChange={handleChange}
              required
            />
            <Input
              name="date"
              type="date"
              label={'تاريخ الحوالة'}
              value={formData.date}
              onChange={handleChange}
              required
            />
            {/*<Input
              name="img"
              type="file"
              accept="image/*"
              label={'صورة الاشعار'}
              required
            />*/}
            <Button
              type="submit"
              className="w-full col-span-2"
            >
              {isSubmitting ? "جاري التحويل..." : "تحويل"}
            </Button>
          </CardContent>
        </Card>
      </form>
    </ScreenWrapper>
  );
}
