import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NotificationProvider } from "./context/NotificationContext";
import { Suspense } from "react";
import AutoLogout from "./hooks/AutoLogout";
import { routesConfig } from "./RoutesConfig";

function App() {
  return (
    <div>
      <NotificationProvider>
          <BrowserRouter>
          <AutoLogout />
          <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
            <Routes>
              {routesConfig.map((route, index) => (
                <Route key={index} path={route.path} element={route.element} />
              ))}
            </Routes>
          </Suspense>
        </BrowserRouter>
      </NotificationProvider>
    </div>
  );
}

export default App;
