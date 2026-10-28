import { useCallback, useEffect, useState } from "react";
import adminApi from "../api/admin.api";

// Số liệu dashboard: gọi một lần khi mount, có thể reload thủ công
export const useDashboardStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApi.getDashboard();
      setStats(data);
    } catch (err) {
      setError(err?.message || "Không tải được số liệu thống kê");
      console.error("Lỗi lấy thống kê:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { stats, loading, error, reload: load };
};
