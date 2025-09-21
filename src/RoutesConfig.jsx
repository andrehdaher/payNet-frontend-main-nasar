import React from "react";
import ProtectedRoute from "./components/ProtectedRoute";

const Login = React.lazy(() => import("./pages/Login"));
const Home = React.lazy(() => import("./pages/Home"));
const Internet = React.lazy(() => import("./pages/Internet"));
const AddPoint = React.lazy(() => import("./pages/AddPoint"));
const HomePoint = React.lazy(() => import("./pages/HomePoint"));
const Balance = React.lazy(() => import("./pages/Balance"));
const FinancialStatement = React.lazy(() => import("./pages/FinancialStatement"));
const PendingPayments = React.lazy(() => import("./pages/PendingPayments"));
const PayInternet = React.lazy(() => import("./pages/PayInternet"));
const AdminPending = React.lazy(() => import("./pages/AdminPending"));
const GetUser = React.lazy(() => import("./pages/GetUser"));
const AdminPaymentStatement = React.lazy(() => import("./pages/AdminPaymentStatement"));
const Adminadminfinancial = React.lazy(() => import("./pages/Adminfinancial"));
const Admindaen = React.lazy(() => import("./pages/Admindaen"));
const AddUser = React.lazy(() => import("./pages/AddUser"));
const Astalam = React.lazy(() => import("./pages/Astalam"));
const Haram = React.lazy(() => import("./pages/Haram"));
const PaymentStatement = React.lazy(() => import("./pages/PaymentStatement"));
const FinancialPoint = React.lazy(() => import("./pages/FinancialPoint"));
const Notebooks = React.lazy(() => import("./pages/Notebooks"));


export const routesConfig = [
  { path: "/login", element: <Login /> },
  { path: "/", element: <ProtectedRoute><Home /></ProtectedRoute> },
  { path: "/add-point", element: <ProtectedRoute><AddPoint /></ProtectedRoute> },
  { path: "/HomePoint", element: <ProtectedRoute><HomePoint /></ProtectedRoute> },
  
  { path: "/internet", element: <ProtectedRoute><Internet /></ProtectedRoute> },
  { path: "/payinternet", element: <ProtectedRoute><PayInternet /></ProtectedRoute> },
  { path: "/astalam", element: <ProtectedRoute><Astalam /></ProtectedRoute> },

  { path: "/balance", element: <ProtectedRoute><Balance /></ProtectedRoute> },
  { path: "/financial", element: <ProtectedRoute><FinancialStatement /></ProtectedRoute> },
  { path: "/pending", element: <ProtectedRoute><PendingPayments /></ProtectedRoute> },
  { path: "/notebooks", element: <Notebooks><Notebooks /></Notebooks> },

  { path: "/adminpending", element: <ProtectedRoute allowedRoles={["admin"]}><AdminPending /></ProtectedRoute> },
  { path: "/allUser", element: <ProtectedRoute allowedRoles={["admin"]}><GetUser /></ProtectedRoute> },
  { path: "/adminPaymentStatement", element: <ProtectedRoute allowedRoles={["admin"]}><AdminPaymentStatement /></ProtectedRoute> },
  { path: "/adminfinancial", element: <ProtectedRoute allowedRoles={["admin"]}><Adminadminfinancial /></ProtectedRoute> },
  { path: "/admindaen", element: <ProtectedRoute allowedRoles={["admin"]}><Admindaen /></ProtectedRoute> },
  { path: "/adminAddUser", element: <ProtectedRoute allowedRoles={["admin"]}><AddUser /></ProtectedRoute> },

  { path: "/haram", element: <ProtectedRoute><Haram /></ProtectedRoute> },
  { path: "/PaymentStatement", element: <ProtectedRoute><PaymentStatement /></ProtectedRoute> },
  { path: "/financial-point", element: <ProtectedRoute><FinancialPoint /></ProtectedRoute> },

  { path: "*", element: <Home /> },
];