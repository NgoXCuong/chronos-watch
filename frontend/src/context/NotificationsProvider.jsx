import { NotificationsContext } from "./NotificationsContext";
import { useNotifications } from "../hooks/useNotifications";

// Provider mỏng: chỉ chạy hook poll một lần rồi chia sẻ cho cả cây.
const NotificationsProvider = ({ children }) => {
  // 40 dòng đủ cho cả dropdown (cuộn) lẫn trang /notifications, không cần phân trang.
  const value = useNotifications({ limit: 40 });
  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};

export default NotificationsProvider;
