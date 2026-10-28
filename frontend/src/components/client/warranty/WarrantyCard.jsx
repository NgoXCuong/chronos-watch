import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/utils/formatCurrency";
import { cn } from "@/lib/utils";
import WarrantyProgress from "./WarrantyProgress";
import WarrantyStateBadge from "./WarrantyStateBadge";

// Ô "nhãn in hoa + giá trị" lặp lại trong mọi card — đặt nội bộ, không export helper
const Field = ({ label, value, mono = false }) => (
  <div className="min-w-0">
    <p className="text-xs font-semibold uppercase tracking-[0.02em] text-muted-foreground">
      {label}
    </p>
    <p
      className={cn(
        "mt-0.5 truncate text-[13px] font-semibold text-foreground",
        mono && "font-mono tabular-nums text-[12px]",
      )}
    >
      {value ?? "—"}
    </p>
  </div>
);

const WarrantyCard = ({ warranty }) => {
  const navigate = useNavigate();
  const open = () => navigate(`/warranties/${warranty.id}`);

  return (
    <Card
      role="link"
      tabIndex={0}
      aria-label={`Phiếu bảo hành ${warranty.code}`}
      onClick={open}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          open();
        }
      }}
      className={cn(
        "cursor-pointer gap-3 ring-border transition-all",
        "hover:-translate-y-0.5 hover:shadow-card hover:ring-navy-300",
        "focus-visible:outline-none focus-visible:shadow-[0_0_0_3px_rgba(15,42,74,0.14)]",
      )}
    >
      <CardContent className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 text-sm font-semibold text-foreground">
            {warranty.product_name || "Sản phẩm không còn tên"}
          </h3>
          <WarrantyStateBadge state={warranty.state} />
        </div>

        <div className="space-y-1">
          <p className="font-mono text-[12px] tabular-nums font-semibold text-navy-700 dark:text-navy-100">
            {warranty.code}
          </p>
          <p className="text-[11px] text-muted-foreground">
            Serial:{" "}
            <span className={cn("font-semibold", warranty.serial ? "font-mono tabular-nums text-foreground" : "italic")}>
              {warranty.serial || "Chưa cập nhật"}
            </span>
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 rounded-lg bg-muted/60 px-3 py-2">
          <Field label="Bắt đầu" value={formatDate(warranty.start_date)} />
          <Field label="Hết hạn" value={formatDate(warranty.end_date)} />
          <Field
            label="Thời hạn"
            value={warranty.warranty_months ? `${warranty.warranty_months} tháng` : "—"}
          />
        </div>

        <WarrantyProgress progress={warranty.progress} state={warranty.state} />

        <p className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.02em] text-navy-600">
          Xem chi tiết
          <ChevronRight className="h-3.5 w-3.5" strokeWidth={2} />
        </p>
      </CardContent>
    </Card>
  );
};

export default WarrantyCard;
