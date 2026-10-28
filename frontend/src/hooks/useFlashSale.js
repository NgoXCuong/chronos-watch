import { useCallback, useEffect, useRef, useState } from "react";
import flashSaleApi from "@/api/flashSale.api";

// Nhà đếm phải chạy theo GIỜ SERVER: đồng hồ máy khách lệch/sai giờ là đếm ngược sai.
// offset = server_time - Date.now() ghi lại lúc nhận response, mỗi tick cộng dồn vào.
const useFlashSale = ({ showHidden = false, enabled = true } = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(enabled);
  const [nowMs, setNowMs] = useState(() => Date.now());
  const offsetRef = useRef(0);

  const refresh = useCallback(async () => {
    try {
      const payload = await flashSaleApi.getCurrent(
        showHidden ? { show_hidden: 1 } : undefined,
      );
      const serverMs = Date.parse(payload?.server_time);
      offsetRef.current = Number.isFinite(serverMs) ? serverMs - Date.now() : 0;
      setData(payload);
    } catch {
      // Panel ưu đãi không được chặn trang chủ: không có đợt thì ẩn panel
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [showHidden]);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }
    refresh();
  }, [refresh, enabled]);

  useEffect(() => {
    const timer = setInterval(
      () => setNowMs(Date.now() + offsetRef.current),
      1000,
    );
    return () => clearInterval(timer);
  }, []);

  const sale = data?.sale ?? null;
  const upcoming = data?.upcoming ?? null;
  const endsInMs = sale ? new Date(sale.end_date).getTime() - nowMs : 0;
  const startsInMs = upcoming
    ? new Date(upcoming.start_date).getTime() - nowMs
    : 0;

  // state là ảnh chụp lúc gọi API — hết khung giờ ngay trên màn hình thì chuyển
  // "expired" tại chỗ, không đợi khách tải lại trang.
  const state = !sale
    ? upcoming
      ? "upcoming"
      : null
    : endsInMs <= 0
      ? "expired"
      : data.state;

  return {
    loading,
    state,
    sale,
    items: data?.items ?? [],
    upcoming,
    endsInMs,
    startsInMs,
    serverNowMs: nowMs,
    refresh,
  };
};

export default useFlashSale;
