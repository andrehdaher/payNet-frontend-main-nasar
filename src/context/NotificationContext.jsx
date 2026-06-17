import React, { createContext, useState, useContext } from "react";

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  // هل هناك عملية غير مسددة جديدة؟
  const [hasNewUnpaid, setHasNewUnpaid] = useState(false);
  const [hasUnseenRefusedToday, setHasUnseenRefusedToday] = useState(false);
  const [refusedTodaySeenAt, setRefusedTodaySeenAt] = useState(null);

  return (
    <NotificationContext.Provider
      value={{
        hasNewUnpaid,
        setHasNewUnpaid,
        hasUnseenRefusedToday,
        setHasUnseenRefusedToday,
        refusedTodaySeenAt,
        setRefusedTodaySeenAt,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
