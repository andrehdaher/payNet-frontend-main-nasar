import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NotificationProvider } from "./context/NotificationContext";
import { ToastProvider } from "./context/ToastContext";
import { Suspense } from "react";
import AutoLogout from "./hooks/AutoLogout";
import { routesConfig } from "./RoutesConfig";
import { LoadingSkeleton } from "./components/Custom/LoadingSkeleton";
import NewServicesAnnouncement from "./components/NewServicesAnnouncement";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
      gcTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <NotificationProvider>
          <ToastProvider>
            <BrowserRouter>
              <AutoLogout />
              <NewServicesAnnouncement />
              <Suspense fallback={<div className="min-h-screen bg-slate-50 p-8" dir="rtl"><div className="mx-auto max-w-3xl"><h1 className="mb-6 text-2xl font-bold text-violet-700">PayNet</h1><LoadingSkeleton rows={6} /></div></div>}>
                <Routes>
                  {routesConfig.map((route, index) => (
                    <Route key={index} path={route.path} element={route.element} />
                  ))}
                </Routes>
              </Suspense>
            </BrowserRouter>
          </ToastProvider>
        </NotificationProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App;
