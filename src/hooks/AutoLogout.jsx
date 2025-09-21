import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AutoLogout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const LOGOUT_TIME = 30 * 60 * 1000; // 30 دقيقة = 1800000 مللي ثانية
    let timer;

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        // إزالة التوكن وتسجيل الخروج
        localStorage.removeItem("token");
        alert("تم تسجيل الخروج تلقائيًا بسبب الخمول.");
        navigate("/");
      }, LOGOUT_TIME);
    };

    // الأحداث التي تعني أن المستخدم نشيط
    const activityEvents = ["mousemove", "keydown", "click", "scroll", "touchstart"];

    activityEvents.forEach((event) => window.addEventListener(event, resetTimer));
    resetTimer(); // بدء المؤقت من أول تحميل

    return () => {
      // تنظيف عند الخروج من الصفحة
      clearTimeout(timer);
      activityEvents.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [navigate]);

  return null; // لا يعرض أي شيء
};

export default AutoLogout;
