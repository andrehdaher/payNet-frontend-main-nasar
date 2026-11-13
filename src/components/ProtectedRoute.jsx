import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (!token) return <Navigate to="/login" replace />;

  let payload;
  try {
    payload = JSON.parse(atob(token.split(".")[1]));
  } catch (error) {
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }

  if (!payload || typeof payload !== "object") return <Navigate to="/login" replace />;

  // ✅ إذا لم يكن الدور ضمن المسموح به
  if (allowedRoles && (!payload.role || !allowedRoles.includes(payload.role))) {
    return <Navigate to="/" replace />;
  }

  // ✅ إذا كان الدور user-point ويحاول فتح "/" نوجهه لـ HomePoint
  if (payload.role === "user-point" && location.pathname === "/") {
    return <Navigate to="/HomePoint" replace />;
  }

  return children ?? <Outlet context={{ session: payload, token }} />;
}
