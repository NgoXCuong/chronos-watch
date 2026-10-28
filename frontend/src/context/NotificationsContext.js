import { createContext, useContext } from "react";

// Một nguồn thông báo cho cả header lẫn trang /notifications: bấm đọc ở trang thì
// badge trên chuông cập nhật ngay, không phải chờ hết chu kỳ poll.
export const NotificationsContext = createContext(null);

export const useNotificationsContext = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error("useNotificationsContext phải dùng trong NotificationsProvider");
  }
  return context;
};
