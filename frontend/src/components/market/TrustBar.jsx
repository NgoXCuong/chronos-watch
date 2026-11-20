import React from "react";
import {
  Truck,
  ShieldCheck,
  RefreshCw,
  BadgePercent,
  Headphones,
} from "lucide-react";

const ITEMS = [
  { icon: Truck, title: "Giao hàng toàn quốc", sub: "Miễn phí mọi đơn" },
  { icon: ShieldCheck, title: "Cam kết chính hãng", sub: "Có phiếu bảo hành" },
  { icon: RefreshCw, title: "Đổi trả trong 7 ngày", sub: "Điều kiện dễ dàng" },
  {
    icon: BadgePercent,
    title: "Ưu đãi hằng tuần",
    sub: "Flash Sale & voucher",
  },
  { icon: Headphones, title: "Hỗ trợ 24/7", sub: "Hotline 1900 8888 66" },
];

/** Dải 5 card tin cậy kiểu sàn TMĐT ngay dưới hero. */
const TrustBar = () => (
  <div className="grid grid-cols-2 gap-3 rounded-xl border border-border bg-card px-4 md:grid-cols-5">
    {ITEMS.map(({ icon: Icon, title, sub }) => (
      <div key={title} className="flex items-center gap-3 ">
        <span className="flex size-9 shrink-0 items-center justify-center text-primary">
          <Icon size={18} strokeWidth={2} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="text-[14px] font-bold text-foreground">{title}</p>
          <p className="mt-0.5 text-[12px] text-muted-foreground">{sub}</p>
        </div>
      </div>
    ))}
  </div>
);

export default TrustBar;
