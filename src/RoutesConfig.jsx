import { lazy } from "react";
import { Link, Navigate } from "react-router-dom";

export const Login = lazy(() => import("./pages/Login"));
const Home = lazy(() => import("./pages/Home"));
const Internet = lazy(() => import("./pages/Internet"));
const AddPoint = lazy(() => import("./pages/AddPoint"));
const HomePoint = lazy(() => import("./pages/HomePoint"));
const Balance = lazy(() => import("./pages/Balance"));
const FinancialStatement = lazy(() => import("./pages/FinancialStatement"));
const PayInternet = lazy(() => import("./pages/PayInternet"));
const AdminPending = lazy(() => import("./pages/AdminPending"));
const GetUser = lazy(() => import("./pages/GetUser"));
const AdminPaymentStatement = lazy(() => import("./pages/AdminPaymentStatement"));
const AdminFinancial = lazy(() => import("./pages/Adminfinancial"));
const AdminDaen = lazy(() => import("./pages/Admindaen"));
const AddUser = lazy(() => import("./pages/AddUser"));
const Astalam = lazy(() => import("./pages/Astalam"));
const Haram = lazy(() => import("./pages/Haram"));
const FinancialPoint = lazy(() => import("./pages/FinancialPoint"));
const Notebooks = lazy(() => import("./pages/Notebooks"));
const PointPayment = lazy(() => import("./pages/PointPayment"));
const Play = lazy(() => import("./pages/Play"));
const PayApp = lazy(() => import("./pages/PayApp"));

function NotFound() {
  return (
    <section className="page-message">
      <h1 className="page-title">الصفحة غير موجودة</h1>
      <Link to="/" className="text-violet-700 underline">العودة إلى الرئيسية</Link>
    </section>
  );
}

export const routesConfig = [
  { path: "/", element: <Home /> },
  { path: "/add-point", element: <AddPoint /> },
  { path: "/HomePoint", element: <HomePoint /> },
  { path: "/home-point", element: <Navigate to="/HomePoint" replace /> },
  { path: "/PointPayment", element: <PointPayment /> },
  { path: "/play", element: <Play /> },
  { path: "/internet", element: <Internet /> },
  { path: "/payinternet", element: <PayInternet /> },
  { path: "/payapp", element: <PayApp /> },
  { path: "/astalam", element: <Astalam /> },
  { path: "/balance", element: <Balance /> },
  { path: "/financial", element: <FinancialStatement /> },
  { path: "/notebooks", element: <Notebooks /> },
  { path: "/adminpending", element: <AdminPending />, allowedRoles: ["admin"] },
  { path: "/allUser", element: <GetUser />, allowedRoles: ["admin"] },
  { path: "/adminPaymentStatement", element: <AdminPaymentStatement />, allowedRoles: ["admin"] },
  { path: "/adminfinancial", element: <AdminFinancial />, allowedRoles: ["admin"] },
  { path: "/admindaen", element: <AdminDaen />, allowedRoles: ["admin"] },
  { path: "/adminAddUser", element: <AddUser />, allowedRoles: ["admin"] },
  { path: "/haram", element: <Haram /> },
  { path: "/financial-point", element: <FinancialPoint /> },
  { path: "*", element: <NotFound /> },
];
