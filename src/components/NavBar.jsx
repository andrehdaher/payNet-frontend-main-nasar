import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useNotification } from "../context/NotificationContext";

import {
  FaWhatsapp,
  FaHome,
  FaMoneyBill,
  FaExchangeAlt,
  FaSignOutAlt,
  FaWallet,
  FaFileInvoice,
  FaBars,
  FaTimes,
  FaUser,
  FaStickyNote,
} from "react-icons/fa";

const NavBar = () => {
  const [balance, setBalance] = useState(null);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { hasNewUnpaid } = useNotification();

  function parseJwt(token) {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch {
      return null;
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const decoded = parseJwt(token);
    if (decoded?.email) setEmail(decoded.email);
    if (decoded?.role) setRole(decoded.role);

    const fetchBalance = async () => {
      try {
        const res = await axios.get(
          "https://paynet-1.onrender.com/api/user/balance",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setBalance(res.data.balance);
      } catch (error) {
        console.error("فشل في جلب الرصيد:", error);
      }
    };

    fetchBalance();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const menuItems = [
    { to: "/", label: "الصفحة الرئيسية", icon: <FaHome /> },
    {
      to: "/financial",
      label: "البيان المالي للتسديد",
      icon: <FaMoneyBill />,
      badge: hasNewUnpaid,
    },
    { to: "/pending", label: "عمليات قيد الترحيل", icon: <FaExchangeAlt /> },

    // خيارات للمستخدم العادي
    ...(role === "user"
      ? [
          { to: "/balance", label: "تعبئة رصيد", icon: <FaWallet /> },
          {
            to: "/PaymentStatement",
            label: "البيان المالي للدفعات",
            icon: <FaFileInvoice />,
          },
          {
            to: "/financial-point",
            label: "البيان المالي للنقاط الفرعية",
            icon: <FaFileInvoice />,
          },
          {
            to: "/add-point",
            label: "نقاط البيع الفرعية",
            icon: <FaUser />,
          },
          {
            to: "/notebooks",
            label: "الارقام المحفوظة",
            icon: <FaStickyNote />,
          },
          {
            external: "https://wa.me/963993822320",
            label: "واتساب",
            icon: <FaWhatsapp className="text-green-500" />,
          },
        ]
      : []),

    // خيارات لنقاط البيع
    ...(role === "user-point"
      ? [
          {
            to: "/PointPayment",
            label: "البيان المالي للدفعات",
            icon: <FaFileInvoice />,
          },
        ]
      : []),
  ];


  return (
    <>
      {/* زر فتح القائمة */}
      <div className="z-40 fixed top-0 px-5 bg-muted w-full flex justify-between shadow-md">
        <div className="p-4 border-b flex justify-center items-center gap-2">
          <span className="font-bold text-violet-700">{email || "جاري التحميل..."}</span>
          <span className="text-sm text-gray-600">
            الرصيد الحالي:
            {balance !== null ? ` ${balance.toFixed(2)} ل.س` : "جاري التحميل..."}
          </span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="h-fit my-auto text-violet-600 p-2 rounded-md hover:bg-violet-200 transition"
        >
          <span
            className={`inline-block transition-transform duration-300 ease-in-out ${
              isOpen ? "rotate-90 scale-110" : "rotate-0 scale-100"
            }`}
          >
            {!isOpen ? <FaBars size={20} /> : <FaTimes size={20} />}
          </span>
        </button>
      </div>

      {/* NavBar */}
      <aside
        dir="rtl"
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg border-l border-gray-200 flex flex-col transform transition-transform duration-500 z-40
        ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="p-4 border-b bg-violet-500/10 flex flex-row-reverse justify-between items-center gap-1">
          <span className="font-bold text-foreground">{email || "جاري التحميل..."}</span>
          <span className="text-sm text-gray-500">
            {balance !== null ? `${balance.toFixed(2)} ل.س` : "جاري التحميل..."}
          </span>
        </div>

        {/* Links */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {menuItems.map((item, i) =>
            item.external ? (
              <a
                key={i}
                href={item.external}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 rounded-md hover:bg-violet-100 transition"
              >
                {item.icon} {item.label}
              </a>
            ) : (
              <Link
                key={i}
                to={item.to}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 p-2 rounded-md hover:bg-violet-100 transition relative"
              >
                {item.icon} {item.label}
                {item.badge && (
                  <span className="absolute top-2 right-2 block h-2.5 w-2.5 rounded-full bg-red-600"></span>
                )}
              </Link>
            )
          )}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full text-red-600 hover:bg-red-100 px-3 py-2 rounded-md transition"
          >
            <FaSignOutAlt /> تسجيل الخروج
          </button>
        </div>
      </aside>
    </>
  );
};

export default NavBar;
