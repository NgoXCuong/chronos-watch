import { Badge } from "../../ui/badge";
import { ReviewStars } from "./ReviewStars";
import { cn } from "@/lib/utils";

const DistributionRow = ({ star, count, total }) => (
  <div className="flex items-center gap-2">
    <span className="w-3 shrink-0 text-right text-[11px] font-bold tabular-nums text-muted-foreground">
      {star}
    </span>
    <span className="h-1.5 w-24 shrink-0 overflow-hidden rounded-full bg-muted sm:w-32">
      <span
        className="block h-full rounded-full bg-navy-600 dark:bg-navy-300"
        style={{ width: `${total ? Math.round((count / total) * 100) : 0}%` }}
      />
    </span>
    <span className="w-6 shrink-0 text-[11px] tabular-nums text-muted-foreground">
      {count}
    </span>
  </div>
);

// Số liệu toàn bảng đánh giá (GET /admin/reviews/stats) — không đổi theo bộ lọc,
// nên đặt riêng trên đầu trang để admin thấy áp lực kiểm duyệt còn lại
const ReviewStatsBar = ({ stats, loading }) => {
  const total = Number(stats?.total) || 0;
  const average = Number(stats?.avg_rating) || 0;
  const distribution = stats?.distribution || {};

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-8 gap-y-4 rounded-xl border border-border bg-card p-4 shadow-card",
        loading && "animate-pulse",
      )}
    >
      <div className="min-w-[132px]">
        <p className="text-[11px] font-bold uppercase tracking-[0.02em] text-muted-foreground">
          Điểm trung bình
        </p>
        <p className="mt-1.5 flex items-center gap-2">
          <span className="text-[26px] font-extrabold leading-none tabular-nums text-navy-600 dark:text-navy-100">
            {total ? average.toFixed(1) : "—"}
          </span>
          <ReviewStars rating={Math.round(average)} />
        </p>
        <p className="mt-1.5 text-[11px] tabular-nums text-muted-foreground">
          trên {total} đánh giá
        </p>
      </div>

      <div className="space-y-1.5">
        {[5, 4, 3, 2, 1].map((star) => (
          <DistributionRow
            key={star}
            star={star}
            count={Number(distribution[star]) || 0}
            total={total}
          />
        ))}
      </div>

      <div className="ml-auto flex flex-wrap items-center gap-2">
        <Badge variant="success">{Number(stats?.active_count) || 0} đang hiển thị</Badge>
        <Badge variant="muted">{Number(stats?.hidden_count) || 0} đã ẩn</Badge>
        <Badge variant="info">{Number(stats?.unreplied_count) || 0} chờ phản hồi</Badge>
      </div>
    </div>
  );
};

export default ReviewStatsBar;
