import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (!token) return <Navigate to="/login" />;

  let payload;
  try {
    payload = JSON.parse(atob(token.split(".")[1]));
  } catch (error) {
    localStorage.removeItem("token");
    return <Navigate to="/login" />;
  }

  // ✅ إذا لم يكن الدور ضمن المسموح به
  if (allowedRoles && (!payload.role || !allowedRoles.includes(payload.role))) {
    return <Navigate to="/" />;
  }

  // ✅ إذا كان الدور user-point ويحاول فتح "/" نوجهه لـ HomePoint
  if (payload.role === "user-point" && location.pathname === "/") {
    return <Navigate to="/home-point" />;
  }

  return children;
}
