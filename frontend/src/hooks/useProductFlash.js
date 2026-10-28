import { useEffect, useState } from "react";
import flashSaleApi from "@/api/flashSale.api";

/**
 * Giá flash của MỘT sản phẩm, tính theo giờ server (ends_in_ms chốt ngay lúc nhận
 * response để đồng hồ máy khách sai giờ không làm đếm ngược lệch).
 * Trang chi tiết dùng chung một nguồn cho ô giá chính và khối Flash Sale — hai chỗ
 * hai mức giá trên cùng một màn hình là đánh lừa khách.
 */
const useProductFlash = (productId) => {
  const [data, setData] = useState({ productId: null, flash: null, endsAt: 0 });
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    if (!productId) return undefined;
    let alive = true;
    flashSaleApi
      .getProductFlash(productId)
      .then((payload) => {
        if (!alive) return;
        const flash = payload?.flash ?? null;
        setData({
          productId,
          flash,
          endsAt: flash ? Date.now() + Number(flash.ends_in_ms || 0) : 0,
        });
      })
      .catch(() => {}); // sản phẩm không có ưu đãi / lỗi mạng: hiển thị giá niêm yết
    return () => {
      alive = false;
    };
  }, [productId]);

  useEffect(() => {
    if (!data.endsAt) return undefined;
    const timer = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [data.endsAt]);

  const flash = data.productId === productId ? data.flash : null;
  return {
    flash,
    msLeft: flash ? Math.max(0, data.endsAt - nowMs) : 0,
  };
};

export default useProductFlash;
