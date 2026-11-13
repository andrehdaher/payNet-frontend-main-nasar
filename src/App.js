import { ToastProvider } from "./context/ToastContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NotificationProvider } from "./context/NotificationContext";
import { Suspense } from "react";
import AutoLogout from "./hooks/AutoLogout";
import AppLayout, { PageLoading } from "./components/AppLayout";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import { Login, routesConfig } from "./RoutesConfig";

export function AppRoutes() {
  return (
    <ToastProvider>
      <NotificationProvider>
        <AutoLogout />
        <Routes>
          <Route path="/login" element={
            <div className="paynet-shell">
              <main className="paynet-login">
                <Suspense fallback={<PageLoading />}><Login /></Suspense>
              </main>
              <Footer />
            </div>
          } />
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              {routesConfig.map(({ path, element, allowedRoles }) => (
                <Route key={path} path={path} element={
                  allowedRoles ? <ProtectedRoute allowedRoles={allowedRoles}>{element}</ProtectedRoute> : element
                } />
              ))}
            </Route>
          </Route>
        </Routes>
      </NotificationProvider>
    </ToastProvider>
  );
}

export default function App() {
  return <BrowserRouter><AppRoutes /></BrowserRouter>;
}
