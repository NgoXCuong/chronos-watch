import { CheckCircle2, Clock, Inbox, ShieldCheck, Ticket, Wrench } from "lucide-react";
import StatsGrid from "../Common/StatsGrid";

const num = (value) => Number(value) || 0;

// Dải KPI từ GET /admin/warranties/stats (toàn hệ thống), không đếm trên 10 dòng đang hiển thị.
// Tone lạnh (teal/violet) + semantic (warning/sale) chỉ xuất hiện ở khối số liệu này.
const WarrantyKpis = ({ stats, loading }) => {
  const total = num(stats?.total);
  const active = num(stats?.active_count);
  const pending = num(stats?.pending_request_count);

  const cards = [
    {
      label: "Tổng phiếu",
      value: total,
      icon: Ticket,
      tone: "navy",
      hint: `${num(stats?.closed_count)} phiếu đã đóng · ${num(stats?.void_count)} phiếu vô hiệu`,
    },
    {
      label: "Còn hạn",
      value: active,
      icon: ShieldCheck,
      tone: "teal",
      hint:
        total > 0
          ? `${Math.round((active / total) * 100)}% tổng số phiếu`
          : "Chưa có phiếu bảo hành",
    },
    {
      label: "Hết hạn",
      value: num(stats?.expired_count),
      icon: Clock,
      tone: "warning",
      hint: "Qua ngày hết hạn — khách không gửi yêu cầu mới được",
    },
    {
      label: "Đang tiếp nhận",
      value: num(stats?.processing_count),
      icon: Wrench,
      tone: "violet",
      hint: "Phiếu đang có kỹ thuật xử lý",
    },
    {
      label: "Đã đóng",
      value: num(stats?.closed_count),
      icon: CheckCircle2,
      tone: "navy",
      hint: "Hồ sơ bảo hành đã kết thúc",
    },
    {
      label: "Yêu cầu chờ xử lý",
      value: pending,
      icon: Inbox,
      tone: pending > 0 ? "sale" : "teal",
      hint: `Tổng ${num(stats?.open_request_count)} yêu cầu đang mở (pending + processing)`,
    },
  ];

  return (
    <StatsGrid
      columns={3}
      stats={cards.map((card) => ({ ...card, loading }))}
    />
  );
};

export default WarrantyKpis;
