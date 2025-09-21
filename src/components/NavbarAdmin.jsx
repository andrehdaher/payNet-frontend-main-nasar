import React, { useEffect, useState } from "react";
import { Menu, X, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [balance, setBalance] = useState(null);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  function parseJwt(token) {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      return null;
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const decoded = parseJwt(token);
    if (decoded?.email) setEmail(decoded.email);

    const fetchBalance = async () => {
      try {
        const res = await axios.get(
          "https://paynet-1.onrender.com/api/user/balance",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
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

  return (
    <nav className="bg-white shadow-md text-blue-700" dir="rtl">
      <div className="container mx-auto px-4 md:px-6 py-3 flex items-center justify-between relative">
        {/* Right - اسم المستخدم */}
        <div className="text-sm md:text-base font-medium text-blue-700">
          {email ? `اسم المستخدم: ${email}` : "جاري التحميل..."}
        </div>

        {/* Center - Navigation Links (hidden on small screens) */}
        <ul className="hidden md:flex gap-6 items-center text-sm font-medium whitespace-nowrap">
          <li>
            <Link
              to="/adminpending"
              className="hover:text-white hover:bg-blue-600 px-3 py-1 rounded transition"
            >
              الصفحة الرئيسية
            </Link>
          </li>
          <li>
            <Link
              to="/adminfinancial"
              className="hover:text-white hover:bg-blue-600 px-3 py-1 rounded transition"
            >
              البيان المالي للتسديد
            </Link>
          </li>
          <li>
            <Link
              to="/adminPaymentStatement"
              className="hover:text-white hover:bg-blue-600 px-3 py-1 rounded transition"
            >
              البيان المالي للدفعات
            </Link>
          </li>
          <li>
            <Link
              to="/admindaen"
              className="hover:text-white hover:bg-blue-600 px-3 py-1 rounded transition"
            >
              ديون
  
              </Link>
          </li>
          <li>
            <Link
              to="/adminAddUser"
              className="hover:text-white hover:bg-blue-600 px-3 py-1 rounded transition"
            >
              اضافة مستخدم
  
              </Link>
          </li>
          <li>
            <Link
              to="/allUser"
              className="hover:text-white hover:bg-blue-600 px-3 py-1 rounded transition"
            >
              عرض المستخدمين            
            </Link>
          </li>
        </ul>

        {/* Left - Logout button */}
        <div className="flex items-center gap-4">
          {/* Toggle (mobile only) */}
          <div className="md:hidden">
            <button onClick={toggleMenu}>
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="hidden md:flex items-center gap-2 text-red-600 hover:bg-red-100 px-3 py-1 rounded transition"
          >
            <LogOut size={18} />
            تسجيل الخروج
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow px-6 py-4 space-y-2 border-t">
          <Link
            to="/adminpending"
            className="block py-2 px-3 hover:bg-blue-100 rounded"
          >
            الصفحة الرئيسية
          </Link>
          <Link
            to="/adminfinancial"
            className="block py-2 px-3 hover:bg-blue-100 rounded"
          >
            البيان المالي للتسديد
          </Link>
          <Link
            to="/adminPaymentStatement"
            className="block py-2 px-3 hover:bg-blue-100 rounded"
          >
            البيان المالي للدفعات
          </Link>
          <Link
            to="/admindaen"
            className="block py-2 px-3 hover:bg-blue-100 rounded"
          >
الديون
          </Link>
          <Link
            to="/adminAddUser"
            className="block py-2 px-3 hover:bg-blue-100 rounded"
          >
اضافة مستخدم
          </Link>
          <Link
            to="/allUser"
            className="block py-2 px-3 hover:bg-blue-100 rounded"
          >
عرض المستخدمين          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 hover:bg-red-100 px-3 py-2 rounded mt-2"
          >
            <LogOut size={18} />
            تسجيل الخروج
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
