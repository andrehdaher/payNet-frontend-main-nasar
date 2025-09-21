import React, { createContext, useState, useContext } from "react";

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  // هل هناك عملية غير مسددة جديدة؟
  const [hasNewUnpaid, setHasNewUnpaid] = useState(false);

  return (
    <NotificationContext.Provider value={{ hasNewUnpaid, setHasNewUnpaid }}>
      {children}
    </NotificationContext.Provider>
  );
};
