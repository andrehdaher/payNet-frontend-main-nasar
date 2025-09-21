import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/NavBar";
import { io } from "socket.io-client";
import ScreenWrapper from "../components/ScreenWrapper";
import { Card, CardContent, CardHeader } from "../components/Custom/Card";
import { Input } from "../components/Custom/Input";

export default function Astalam() {
  const socketRef = useRef(null); 

  const [astalam, setastalam] = useState(false);
  const [fatora, setfatora] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [landline, setLandline] = useState("");
  const [fatoraData, setFatoraData] = useState(null);
  const [countdown, setCountdown] = useState(30);
  const [loading, setLoading] = useState(true);

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

  // العد التنازلي
  useEffect(() => {
    if (fatora && fatoraData) {
      setLoading(true);
      setCountdown(5);

      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setLoading(false);
            setastalam(false); 
            return 0;
          }
          return prev - 1; 
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [fatora, fatoraData]);

  // الاتصال بالسيرفر
  useEffect(() => {
    if (!email) return;

    const socket = io("https://daherserver-zgmy.onrender.com");
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ متصل بالسيرفر");
      socket.emit("register", email);
    });

    socket.on("json_message", (data) => {
      console.log("📩 استلمت JSON:", data);

      try {
        let parsedData;

        if (typeof data.content.data === "string") {
          parsedData = JSON.parse(data.content.data);
        } else {
          parsedData = data.content.data;
        }

        setFatoraData(parsedData);
        setfatora(true);
      } catch (error) {
        console.error("❌ خطأ في تحليل JSON:", error);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [email]);

  // دالة الاستعلام
  const handelAstalam = () => {
    if (!selectedCompany || !landline) {
      alert("يرجى اختيار الشركة وإدخال الرقم الأرضي");
      return;
    }
    if (socketRef.current) {
      socketRef.current.emit("json_message", {
        target: "worker",
        content: { email, selectedCompany, landline },
      });
    }

    setastalam(true);
    setFatoraData(null);
    setfatora(false);
    setLoading(true);
  };

  const companies = [
    "",
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

  return (
    <ScreenWrapper>
      <div>
        <Card className={'max-w-md mx-auto'}>
          <CardHeader>
            <h1 className="text-3xl py-2 text-black">استعلام عن فاتورة</h1>
          </CardHeader>

          <CardContent className={'space-y-6'}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handelAstalam();
              }}
              className="space-y-6"
            >
              <div className="relative">
                <label className="block mb-1 mr-3 text-sm font-medium text-foreground">
                  اختر الشركة
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

              <Input
                label={"رقم الارضي"}
                onChange={(e) => setLandline(e.target.value)}
                className="peer h-12 w-full text-white text-xl px-4 bg-transparent border-2 rounded-xl border-gray-300 focus:border-blue-600 outline-none"
                required
                type="text"
              />

              <button
                className={`text-white w-full py-2.5 rounded-lg ${
                  astalam ? "bg-violet-950" : "bg-violet-600 hover:bg-violet-700"
                }`}
              >
                {astalam ? "جاري الاستعلام . . ." : "استعلام عن فاتورة"}
              </button>
            </form>

            <h1 className="text-xl text-red-500">
              {astalam && (
                <>
                  الرجاء عدم مغادرة الصفحة <br />
                  المدة المتوقعة 60 ثانية
                </>
              )}
            </h1>
          </CardContent>
        </Card>

        {fatora && (
          <div
            className={`max-w-md w-full mx-auto text-black place-items-center p-4 my-3 rounded-lg bg-gray-300 overflow-y-auto max-h-80`}
          >
            {loading ? (
              <h1>الرجاء الانتظار... {countdown} ثانية</h1>
            ) : fatoraData ? (
              <table className="table-auto border-collapse border border-gray-400 w-full text-center">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="border border-gray-400 px-4 py-2">العنوان</th>
                    <th className="border border-gray-400 px-4 py-2">القيمة</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(fatoraData).map(([key, value], index) => (
                    <tr key={index} className="hover:bg-gray-100">
                      <td className="border border-gray-400 px-4 py-2">{key}</td>
                      <td className="border border-gray-400 px-4 py-2">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : null}
          </div>
        )}
      </div>
    </ScreenWrapper>
  );
}
