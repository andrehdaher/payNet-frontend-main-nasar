import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, Home, Users, WalletCards, FileText, PackagePlus } from "lucide-react";

const navItems = [
  { to: "/adminpending", label: "العمليات المعلقة", icon: Home, group: "المدفوعات" },
  { to: "/adminfinancial", label: "بيان التسديد", icon: FileText, group: "المدفوعات" },
  { to: "/adminPaymentStatement", label: "بيان الدفعات", icon: WalletCards, group: "المالية" },
  { to: "/admindaen", label: "الديون", icon: WalletCards, group: "المالية" },
  { to: "/adminAddUser", label: "إضافة مستخدم", icon: Users, group: "المستخدمون" },
  { to: "/allUser", label: "عرض المستخدمين", icon: Users, group: "المستخدمون" },
  { to: "/productUpload", label: "إضافة منتج", icon: PackagePlus, group: "المنتجات" },
];

export default function NavbarAdmin() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

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
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const renderLinks = (mobile = false) => (
    <div className={mobile ? "space-y-1" : "flex items-center gap-1"}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = location.pathname === item.to;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={() => setIsOpen(false)}
            className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 ${
              active
                ? "bg-violet-700 text-white shadow-sm"
                : "text-slate-700 hover:bg-violet-50 hover:text-violet-800"
            } ${mobile ? "w-full" : ""}`}
            aria-current={active ? "page" : undefined}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
    </div>
  );

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur" dir="rtl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <span className="text-lg font-extrabold text-violet-700">PayNet Admin</span>
          <span className="hidden truncate rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700 sm:inline">
            {email || "جاري التحميل..."}
          </span>
        </div>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="تنقل الإدارة">
          {renderLinks()}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleLogout}
            className="hidden items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 md:inline-flex"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            تسجيل الخروج
          </button>
          <button
            type="button"
            onClick={() => setIsOpen((value) => !value)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-300 text-violet-700 transition-colors hover:bg-violet-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 lg:hidden"
            aria-label={isOpen ? "إغلاق القائمة" : "فتح القائمة"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-3 shadow-lg lg:hidden">
          <nav aria-label="تنقل الإدارة للجوال">{renderLinks(true)}</nav>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-2 flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            تسجيل الخروج
          </button>
        </div>
      )}
    </header>
  );
}
