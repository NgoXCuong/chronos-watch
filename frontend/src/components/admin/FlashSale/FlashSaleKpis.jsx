import {
  Boxes,
  CalendarClock,
  CircleDollarSign,
  Flame,
  ListChecks,
  Zap,
} from "lucide-react";
import StatsGrid from "../Common/StatsGrid";
import { formatCompactVnd } from "../../../utils/formatCurrency";

const num = (value) => Number(value) || 0;

// Dải KPI từ GET /admin/flash-sales/stats (toàn hệ thống, do backend aggregate),
// không đếm trên 10 dòng đang hiển thị. Tone lạnh (teal/violet) + semantic
// (success/sale) chỉ xuất hiện ở khối số liệu này — header bảng/CTA vẫn navy.
const FlashSaleKpis = ({ stats, loading }) => {
  const total = num(stats?.total);
  const active = num(stats?.active_count);
  const sold = num(stats?.sold_units);
  const quota = num(stats?.quota_units);

  const cards = [
    {
      label: "Tổng đợt",
      value: total,
      icon: Zap,
      tone: "navy",
      hint: `${active} đang bật · ${Math.max(0, total - active)} đang tắt`,
    },
    {
      label: "Đang chạy",
      value: num(stats?.running_count),
      icon: Flame,
      tone: "teal",
      hint: `${num(stats?.expired_count)} đợt đã hết hạn`,
    },
    {
      label: "Sắp chạy",
      value: num(stats?.upcoming_count),
      icon: CalendarClock,
      tone: "violet",
      hint: "Đang bật nhưng chưa tới mốc bắt đầu",
    },
    {
      label: "Sản phẩm flash",
      value: num(stats?.product_count),
      icon: Boxes,
      tone: "navy",
      hint: "Sản phẩm đang có giá flash ở các đợt chạy",
    },
    {
      label: "Suất đã bán",
      value: `${sold}/${quota}`,
      icon: ListChecks,
      tone: "success",
      hint: `Còn ${num(stats?.remaining_units)} suất trong các đợt đang chạy`,
    },
    {
      label: "Doanh thu đợt chạy",
      value: formatCompactVnd(stats?.running_revenue),
      icon: CircleDollarSign,
      tone: "sale",
      hint: "Theo giá Flash đã áp vào đơn (chưa trừ hoàn/hủy)",
    },
  ];

  return (
    <StatsGrid columns={3} stats={cards.map((card) => ({ ...card, loading }))} />
  );
};

export default FlashSaleKpis;
