import { useCallback, useEffect, useRef, useState } from "react";
import notificationApi from "../api/notification.api";
import { useAuth } from "./useAuth";
import { NOTIFICATIONS_CHANGED } from "../utils/notifications";

const EMPTY = { items: [], unreadCount: 0, counts: null };

// Thông báo lưu ở backend (bảng notifications) nên trạng thái đã đọc bền qua F5.
// Hook chỉ lo: poll định kỳ + cập nhật lạc quan khi bấm đọc.
export const useNotifications = ({ pollMs = 60000, limit = 15 } = {}) => {
    const { isAuthenticated } = useAuth();
    const [data, setData] = useState(EMPTY);
    const [loading, setLoading] = useState(false);
    const aliveRef = useRef(true);

    const load = useCallback(async () => {
        try {
            const result = await notificationApi.list({ limit });
            if (!aliveRef.current) return;
            setData({
                items: Array.isArray(result?.items) ? result.items : [],
                unreadCount: Number(result?.unreadCount) || 0,
                counts: result?.counts ?? null,
            });
        } catch (error) {
            console.error("Lỗi tải thông báo:", error.message);
        } finally {
            if (aliveRef.current) setLoading(false);
        }
    }, [limit]);

    useEffect(() => {
        aliveRef.current = true;
        if (!isAuthenticated) {
            setData(EMPTY);
            return () => {
                aliveRef.current = false;
            };
        }

        setLoading(true);
        load();
        const timer = setInterval(load, pollMs);
        // Quay lại tab sau một lúc → cập nhật ngay, không chờ hết chu kỳ poll.
        const onFocus = () => load();
        window.addEventListener("focus", onFocus);
        window.addEventListener(NOTIFICATIONS_CHANGED, onFocus);

        return () => {
            aliveRef.current = false;
            clearInterval(timer);
            window.removeEventListener("focus", onFocus);
            window.removeEventListener(NOTIFICATIONS_CHANGED, onFocus);
        };
    }, [isAuthenticated, load, pollMs]);

    const markRead = useCallback(async (id) => {
        if (!id) return;
        setData((prev) => {
            const wasUnread = prev.items.some((item) => item.id === id && !item.read_at);
            return {
                ...prev,
                items: prev.items.map((item) =>
                    item.id === id && !item.read_at
                        ? { ...item, read_at: new Date().toISOString() }
                        : item
                ),
                unreadCount: wasUnread ? Math.max(0, prev.unreadCount - 1) : prev.unreadCount,
            };
        });
        try {
            await notificationApi.markRead(id);
        } catch (error) {
            console.error("Lỗi đánh dấu đã đọc:", error.message);
        }
    }, []);

    const markAllRead = useCallback(async () => {
        const now = new Date().toISOString();
        setData((prev) => ({
            ...prev,
            items: prev.items.map((item) => ({ ...item, read_at: item.read_at || now })),
            unreadCount: 0,
        }));
        try {
            await notificationApi.markAllRead();
        } catch (error) {
            console.error("Lỗi đánh dấu đã đọc:", error.message);
        }
    }, []);

    return {
        notifications: data.items,
        unreadCount: data.unreadCount,
        counts: data.counts,
        loading,
        refresh: load,
        markRead,
        markAllRead,
    };
};
