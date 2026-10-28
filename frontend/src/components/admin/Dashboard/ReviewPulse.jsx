import { useMemo } from "react";
import { Link } from "react-router-dom";
import { MessageSquare, Star } from "lucide-react";
import DashboardPanel from "../Common/DashboardPanel";
import { buildReviewSummary } from "../../../utils/dashboardMetrics";
import { cn } from "../../../lib/utils";

const STAR_ROWS = [5, 4, 3, 2, 1];

// Điểm trung bình + phân bố đánh giá theo sao
const ReviewPulse = ({ distribution, className }) => {
  const { average, total, bars } = useMemo(
    () => buildReviewSummary(distribution),
    [distribution],
  );
  const maxCount = Math.max(...bars.map((b) => b.count), 1);

  return (
    <DashboardPanel
      icon={MessageSquare}
      tone="warning"
      className={className}
      title="Chất lượng đánh giá"
      subtitle={`${total} lượt đánh giá`}
      action={
        <Link
          to="/admin/reviews"
          className="text-[11px] font-bold text-navy-600 uppercase tracking-[0.05em] hover:underline dark:text-navy-100"
        >
          Xem
        </Link>
      }
    >
      <div className="mb-4 flex items-end gap-3">
        <span className="text-[34px] font-extrabold leading-none text-navy-600 tabular-nums dark:text-navy-100">
          {total > 0 ? average.toFixed(1) : "—"}
        </span>
        <div className="mb-1 flex gap-0.5">
          {STAR_ROWS.map((star, index) => (
            <Star
              key={star}
              className={cn(
                "h-4 w-4",
                index < Math.round(average)
                  ? "fill-amber-400 text-amber-400"
                  : "text-muted-foreground",
              )}
              strokeWidth={1.5}
            />
          ))}
        </div>
      </div>

      {total === 0 ? (
        <p className="rounded-lg border-2 border-dashed border-border bg-muted/40 py-6 text-center text-sm font-semibold text-muted-foreground">
          Chưa có đánh giá nào
        </p>
      ) : (
        <ul className="space-y-2">
          {bars.map((bar, index) => (
            <li key={bar.star} className="flex items-center gap-2">
              {/* Cột hiển thị số sao + Icon Lucide */}
              <span className="flex w-7 shrink-0 items-center gap-0.5 text-[11px] font-bold text-muted-foreground tabular-nums">
                <span>{STAR_ROWS[index]}</span>
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              </span>

              {/* Thanh Progress */}
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-navy-600 transition-[width] duration-700 dark:bg-navy-300"
                  style={{
                    width: `${maxCount > 0 ? (bar.count / maxCount) * 100 : 0}%`,
                  }}
                />
              </div>

              {/* Text hiển thị lượt & phần trăm không bị rớt dòng */}
              <span className="shrink-0 text-right text-[11px] font-semibold text-foreground tabular-nums whitespace-nowrap">
                {bar.count} lượt · {bar.percent}%
              </span>
            </li>
          ))}
        </ul>
      )}
    </DashboardPanel>
  );
};

export default ReviewPulse;
