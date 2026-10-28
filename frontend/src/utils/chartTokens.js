import { useEffect, useMemo, useState } from "react";

// Recharts không nhận class Tailwind → resolve token trong index.css tại runtime.
// Nhờ vậy biểu đồ tự đổi màu theo light/dark mà không hardcode hex.
// Token semantic (border, card, muted-foreground…) chỉ tồn tại ở dạng `--<name>`
// vì @theme inline không phát ra biến CSS `--color-<name>`.
export const resolveTokenColor = (name, fallback = "transparent") => {
  if (typeof window === "undefined") return fallback;
  const style = getComputedStyle(document.documentElement);
  return (
    style.getPropertyValue(`--color-${name}`).trim() ||
    style.getPropertyValue(`--${name}`).trim() ||
    fallback
  );
};

// Trả về hex đã resolve + tự cập nhật khi đổi theme (light ↔ dark)
export const useChartTokens = (names) => {
  const key = names.join(",");
  const [theme, setTheme] = useState(() =>
    typeof document !== "undefined"
      ? document.documentElement.classList.contains("dark")
      : false,
  );

  useEffect(() => {
    const observer = new MutationObserver(() =>
      setTheme(document.documentElement.classList.contains("dark")),
    );
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  return useMemo(
    () =>
      Object.fromEntries(key.split(",").map((n) => [n, resolveTokenColor(n)])),
    [key, theme],
  );
};

// Trạng thái đơn hàng → token màu (spec §6: pending=warning, shipping=info,
// delivered=success, cancelled=destructive, còn lại dùng sắc độ navy)
export const ORDER_STATUS_TOKEN = {
  pending: "warning",
  confirmed: "navy-500",
  processing: "navy-700",
  shipping: "info",
  delivered: "success",
  cancelled: "destructive",
  returned: "navy-300",
};

export const STATUS_FALLBACK_TOKEN = "navy-300";

// Sắc độ cho biểu đồ nhiều loạt: navy trước, nhấn lạnh teal/violet xen kẽ
// (xem constants/uiTones.js) — vẫn không dùng vàng/gold.
export const NAVY_SERIES_TOKENS = [
  "navy-600",
  "navy-500",
  "navy-700",
  "navy-300",
  "navy-800",
  "navy-200",
];

export const SERIES_TOKENS = [
  "navy-600",
  "teal-500",
  "violet-500",
  "navy-300",
  "teal-300",
  "violet-300",
];
