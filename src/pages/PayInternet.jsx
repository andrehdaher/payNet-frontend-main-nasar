import React, { useState , useEffect , useRef} from "react";
import axios from "axios";
import ScreenWrapper from "../components/ScreenWrapper";
import { Card, CardContent, CardHeader } from "../components/Custom/Card";
import { Input } from "../components/Custom/Input";
import { Button } from "../components/Custom/Button";
import { useLocation } from "react-router-dom";

export default function PayInternet() {
  const vantaRef = useRef(null);
  const [landline, setLandline] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedSpeed, setSelectedSpeed] = useState("");
  const [amountToPay, setAmountToPay] = useState("");
  const [paymentType, setPaymentType] = useState("cash"); // القيمة الافتراضية نقداً
  const location = useLocation()
  const formType = location.state  
  
  function parseJwt(token) {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      return null;
    }
  }
  

  const calculatedAmount = amountToPay ? (amountToPay * 1.05).toFixed(2) : "";
  const inputs = [
    {
      id: "landline",
      label: ['WATER', 'ELEC'].includes(formType) ? 'رقم الباركود' : "رقم الارضي",
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
      label: "المبلغ المراد تسديده",
      type: "number",
      value: amountToPay,
      onChange: setAmountToPay,
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
  landline && selectedCompany && selectedSpeed && amountToPay;

  const companies = ['PHONE'].includes(formType) ? [
    "",
    "تسديد ارضي فقط",
    "تسديد انترنت بريد فقط",
    "تسديد ارضي + انترنت بريد",
  ]: ['ELEC'].includes(formType) ? [
    "",
    "حماة-كهرباء",
    "حمص-كهرباء",
    "دمشق-كهرباء",
    "ريف دمشق-كهرباء",
    "السويداء-كهرباء",
    "درعا-كهرباء",
    "القنيطرة-كهرباء",
    "اللاذقية-كهرباء",
    "طرطوس-كهرباء",
    "دير الزور-كهرباء",
    "حلب-كهرباء",
  ]: ['WATER'].includes(formType) ? [
    "",
    "حماة-مياه",
    "حمص-مياه",
    "دمشق-مياه",
    "ريف دمشق-مياه",
    "السويداء-مياه",
    "درعا-مياه",
    "القنيطرة-مياه",
    "اللاذقية-مياه",
    "طرطوس-مياه",
    "دير الزور-مياه",
    "حلب-مياه",
  ]: [
    "",
    "ناس",
    "برونت",
    "اينت",
    "رنت",
    "الكم",
    "ليما",
    "سوا",
    "اية",
    "يارا",
    "بطاقات",
    "هايبر",
    "ويف",
    "امنية",
    "فيو",
    "ليزر",
    "متس",
    "سما",
    "زاد",
    "دنيا",
    "هاي فاي",
    "تكامل",
    "لاين",
    "الجمعية",
  ];
  const speeds = ['ADSL'].includes(formType) ? [
    "512 Mbps   السعر 14000",
    "1 Mbps     السعر 18500",
    "2 Mbps     السعر 24000",
    "4 Mbps     السعر 38000",
    "8 Mbps     السعر 64000",
    "16 Mbps   السعر  83000",
  
  ]: ['IPTV'].includes(formType) ? [
    "البرونزية      السعر 17500",
    "العائلية       السعر 22000",
    "الذهبية        السعر 29000",

  ]: [
    "5 GB        السعر 1800",
    "10 GB       السعر 3300",
    "20 GB       السعر 5700",
    "30 GB       السعر 7600",
    "50 GB       السعر 11500",
    "75 GB       السعر 13500",
    "100 GB      السعر 19000",
    "200 GB      السعر 35000",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const token = localStorage.getItem("token");
    const decoded = parseJwt(token);
    const email = decoded?.email;

    console.log(formType)

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

  useEffect(()=>{
    if(['PHONE'].includes(formType)){ setSelectedSpeed('5') }
  }, [])

  return (
    <ScreenWrapper className={'min-h-screen flex items-center justify-center p-4'}>
        <Card>
          <CardHeader>
            <h1 className="text-2xl">
              {formType == 'ADSL' && 'تسديد فاتورة ADSL'}
              {formType == 'IPTV' && 'تسديد فاتورة IPTV'}
              {formType == 'RECHARGE' && 'شحن باقة'}
              {formType == 'PHONE' && 'دفع فاتورة هاتف'}
              {formType == 'ELEC' && 'دفع فاتورة كهرباء'}
              {formType == 'WATER' && 'دفع فاتورة مياه'}
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
                        { !['PHONE'].includes(formType) ? 'اختر الشركة' : 'نوع الدفع'}
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
                  {/* اختيار السرعة */}
                  {Array.isArray(speeds) && speeds.length > 0 && !['PHONE'].includes(formType) && (
                    ['ELEC', 'WATER'].includes(formType) ? 
                    <>
                      <Input
                        key={input.id}
                        id={input.id}
                        label={'رقم الاشتراك / العداد'}
                        type={'Number'}
                        value={selectedSpeed}
                        onChange={(e) => setSelectedSpeed(e.target.value)}
                        readOnly={input.readOnly || false}
                        required={!input.readOnly}
                      />
                    </>
                    :
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
                  )}
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
                    onClick={()=>{
                      setPaymentType('cash')
                    }}
                    variant={paymentType == 'cash' ? 'default' : 'outline'}
                  >
                    نقدا
                  </Button>
                  <Button
                    type={'button'}
                    className={'w-1/2'}
                    onClick={()=>{
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
                className={`w-full py-3 rounded-lg font-semibold transition ${
                  isFormValid
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