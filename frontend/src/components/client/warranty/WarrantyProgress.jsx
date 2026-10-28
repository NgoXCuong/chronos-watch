import { cn } from "@/lib/utils";

// progress = { totalDays, leftDays, usedPercent } do backend tính (utils/warranty.js);
// NULL khi phiếu thiếu mốc ngày → chỉ ẩn thanh, không suy đoán số ngày.
const captionFor = (progress, state) => {
  if (state === "void") return "Phiếu không còn hiệu lực";
  if (!progress) return null;
  if (progress.leftDays <= 0) return "Đã hết hạn";
  return `Còn ${progress.leftDays} ngày`;
};

const WarrantyProgress = ({ progress, state, className, showTotal = false }) => {
  const caption = captionFor(progress, state);
  const percent = Math.min(100, Math.max(0, progress?.usedPercent ?? 0));
  const expired = progress ? progress.leftDays <= 0 : state === "expired";

  return (
    <div className={cn("space-y-1.5", className)}>
      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
      >
        <div
          className="h-full rounded-full bg-navy-600 transition-[width] duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>

      {caption && (
        <div className="flex items-center justify-between gap-2 text-[11px] font-semibold">
          <span className={expired ? "text-warning" : "text-muted-foreground"}>{caption}</span>
          <span className="text-muted-foreground tabular-nums">
            {showTotal && progress ? `${progress.totalDays} ngày · ` : ""}
            {percent}%
          </span>
        </div>
      )}
    </div>
  );
};

export default WarrantyProgress;
