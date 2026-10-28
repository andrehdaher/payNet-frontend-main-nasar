import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useNotification } from "../context/NotificationContext";
import {
  FaWhatsapp,
  FaHome,
  FaMoneyBill,
  FaSignOutAlt,
  FaWallet,
  FaFileInvoice,
  FaBars,
  FaTimes,
  FaUser,
  FaStickyNote,
  FaAd,
} from "react-icons/fa";
import { apiUrl } from "../config/api";

const REFUSED_STATUS = "غير مسددة";

function getTodayDate() {
  return new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Damascus",
  });
}

function getRefusedSeenKey(userEmail, date = getTodayDate()) {
  return `paynet:refused-seen:${userEmail || "anonymous"}:${date}`;
}

const NavBar = () => {
  const [balance, setBalance] = useState(null);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [daen, setDaen] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    hasNewUnpaid,
    hasUnseenRefusedToday,
    setHasUnseenRefusedToday,
    setRefusedTodaySeenAt,
  } = useNotification();

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
        const res = await axios.get(apiUrl("/api/user/balance"), {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBalance(res.data.balance);
      } catch (error) {
        console.error("فشل في جلب الرصيد:", error);
      }
    };

    const fetchDaen = async () => {
      try {
        const res = await axios.get(apiUrl("/api/user/daen"), {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDaen(res.data.daen);
      } catch (error) {
        console.error("فشل في جلب الدين:", error);
      }
    };

    const fetchTodayRefused = async () => {
      if (!decoded?.email) return;

      try {
        const today = getTodayDate();
        const seenAt = Number(localStorage.getItem(getRefusedSeenKey(decoded.email, today)) || 0);
        setRefusedTodaySeenAt(seenAt || null);

        const res = await axios.get(apiUrl("/api/admin/user/confirmed"), {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            date: today,
            status: REFUSED_STATUS,
            page: 1,
            limit: 50,
          },
        });

        const refusedRows = Array.isArray(res.data?.data) ? res.data.data : [];
        const hasNewRefused = refusedRows.some((payment) => {
          const timestamp = new Date(payment.updatedAt || payment.createdAt || 0).getTime();
          return timestamp > seenAt;
        });

        setHasUnseenRefusedToday(hasNewRefused);
      } catch (error) {
        console.error("فشل في جلب العمليات المرفوضة:", error);
        setHasUnseenRefusedToday(false);
      }
    };

    fetchDaen();
    fetchBalance();
    fetchTodayRefused();
  }, [setHasUnseenRefusedToday, setRefusedTodaySeenAt]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const menuItems = [
    { to: "/", label: "الصفحة الرئيسية", icon: <FaHome aria-hidden="true" /> },
    {
      to: "/financial",
      label: "البيان المالي",
      icon: <FaMoneyBill aria-hidden="true" />,
      badge: hasNewUnpaid,
    },
    ...(role === "user"
      ? [
        { to: "/balance", label: "تعبئة رصيد", icon: <FaWallet aria-hidden="true" /> },
        {
          to: "/financial-point",
          label: "البيان المالي للنقاط الفرعية",
          icon: <FaFileInvoice aria-hidden="true" />,
        },
        {
          to: "/point-statement",
          label: "تحويلات رصيد النقاط",
          icon: <FaWallet aria-hidden="true" />,
        },
        {
          to: "/add-point",
          label: "نقاط البيع الفرعية",
          icon: <FaUser aria-hidden="true" />,
        },
        {
          to: "/notebooks",
          label: "الأرقام المحفوظة",
          icon: <FaStickyNote aria-hidden="true" />,
        },
        {
          to: "/advertisements",
          label: "البضائع",
          icon: <FaAd aria-hidden="true" />,
        },
        {
          external: "https://wa.me/963993822320",
          label: "واتساب",
          icon: <FaWhatsapp className="text-green-600" aria-hidden="true" />,
        },
      ]
      : []),
    ...(role === "user-point"
      ? [
        {
          to: "/PointPayment",
          label: "البيان المالي للدفعات",
          icon: <FaFileInvoice aria-hidden="true" />,
        },

      ]
      : []),
  ];

  const isActive = (to) => location.pathname === to;

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur" dir="rtl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-lg font-extrabold text-violet-700">PayNet</span>
              {hasUnseenRefusedToday && (
                <span
                  className="inline-flex items-center rounded-full bg-red-600 px-2 py-1 text-[11px] font-bold leading-none text-white shadow-sm ring-1 ring-red-200"
                  role="status"
                  aria-live="polite"
                >
                  عمليات مرفوضة
                </span>
              )}
              <span className="hidden rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700 sm:inline">
                {email || "جاري التحميل..."}
              </span>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-slate-700">
              <span>
                الرصيد: {balance !== null ? `${balance.toFixed(2)} ل.س` : "جاري التحميل..."}
              </span>
              {daen !== null && daen !== 0 && (
                <span className="font-bold text-red-700">
                  الدين: {daen.toFixed(2)} ل.س
                </span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-300 text-violet-700 transition-colors hover:bg-violet-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
            aria-label={isOpen ? "إغلاق القائمة" : "فتح القائمة"}
            aria-expanded={isOpen}
          >
            {!isOpen ? <FaBars size={18} aria-hidden="true" /> : <FaTimes size={18} aria-hidden="true" />}
          </button>
        </div>
      </header>

      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-slate-950/30"
          aria-label="إغلاق القائمة"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        dir="rtl"
        className={`fixed right-0 top-0 z-50 flex h-full w-72 max-w-[85vw] flex-col border-l border-slate-200 bg-white shadow-xl transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        aria-label="القائمة الجانبية"
      >
        <div className="border-b border-slate-200 bg-violet-50 p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="font-bold text-slate-900">{email || "جاري التحميل..."}</span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-md p-2 text-slate-600 transition-colors hover:bg-white hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
              aria-label="إغلاق القائمة"
            >
              <FaTimes aria-hidden="true" />
            </button>
          </div>
          <p className="mt-2 text-sm font-medium text-slate-700">
            {balance !== null ? `${balance.toFixed(2)} ل.س` : "جاري التحميل..."}
          </p>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto p-4" aria-label="تنقل المستخدم">
          {menuItems.map((item, i) =>
            item.external ? (
              <a
                key={i}
                href={item.external}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-violet-50 hover:text-violet-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
              >
                {item.icon} {item.label}
              </a>
            ) : (
              <Link
                key={i}
                to={item.to}
                onClick={() => setIsOpen(false)}
                className={`relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold transition-colors ${isActive(item.to)
                  ? "bg-violet-700 text-white shadow-sm"
                  : "text-slate-700 hover:bg-violet-50 hover:text-violet-800"
                  } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500`}
                aria-current={isActive(item.to) ? "page" : undefined}
              >
                {item.icon} {item.label}
                {item.badge && (
                  <span className="absolute left-3 top-3 block h-2.5 w-2.5 rounded-full bg-red-600" aria-label="يوجد تنبيه جديد" />
                )}
              </Link>
            ),
          )}
        </nav>

        <div className="border-t border-slate-200 p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-md px-3 py-2.5 font-semibold text-red-700 transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          >
            <FaSignOutAlt aria-hidden="true" /> تسجيل الخروج
          </button>
        </div>
      </aside>
    </>
  );
};

export default NavBar;
