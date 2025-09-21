import React, { useState , useEffect , useRef } from "react";
import Navbar from "../components/NavBar";
import axios from "axios";
import ScreenWrapper from "../components/ScreenWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "../components/Custom/Card";
import { Input } from "../components/Custom/Input";
import { Button } from "../components/Custom/Button";
import { useLocation } from "react-router-dom";
import qrImage from "../assets/QRcode.png";


export default function TransferForm() {

  const [isSubmitting, setIsSubmitting] = useState(false);
  const location = useLocation()
  const serviceType = location.state

  const [formData, setFormData] = useState({
    name: "",
    destination: serviceType == "HARAM" ? "ماهر حبيب ضاهر - محردة - هرم " : serviceType == "SHAMKASH" ? "andreh daher" : "ماهر حبيب ضاهر - محردة - فؤاد ",
    number: serviceType == "FOAD" ? "0969735667" : "0969735667",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
      if (isSubmitting) return; // حماية إضافية
      setIsSubmitting(true);

    const token = localStorage.getItem("token");
    const decoded = parseJwt(token);

    await axios.post("https://paynet-1.onrender.com/api/saveBalance/haram", formData, {
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
            
            {
              serviceType == 'SHAMKASH' ? 
              <div className="text-center space-y-2">
                <p className="font-semibold text-sm text-gray-600">امسح رمز QR التالي للتحويل إلى الرقم:</p>
                <img src={qrImage} alt="QR Code" className="mx-auto w-40 h-40 object-contain" />
              </div>
              :
              <Input
                name="number"
                type="text"
                label="الرقم"
                value={formData.number}
                onChange={handleChange}
                required
              />
            }
            <Input
              className='col-span-2'
              name="destination"
              type="text"
              label="الى"
              value={formData.destination}
              onChange={handleChange}
              required
            />
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
