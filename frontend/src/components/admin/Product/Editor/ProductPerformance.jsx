import { Eye, MessageSquare, Shell, Star, TrendingUp } from "lucide-react";
import FormSection from "../../Common/FormSection";
import { formatDateTime } from "../../../../utils/formatCurrency";
import { cn } from "@/lib/utils";

// Cột do hệ thống tính: views / sold_count / avg_rating / review_count / timestamps.
// Form không gửi các cột này lên backend — chỉ hiển thị để admin ra quyết định.
const ProductPerformance = ({ product }) => {
  const rating = Number(product?.avg_rating) || 0;

  const stats = [
    { label: "Lượt xem", icon: Eye, value: product?.views ?? 0 },
    { label: "Đã bán", icon: TrendingUp, value: product?.sold_count ?? 0 },
    {
      label: "Đánh giá TB",
      icon: Star,
      value: rating ? rating.toFixed(1) : "Chưa có",
      star: true,
    },
    { label: "Số review", icon: MessageSquare, value: product?.review_count ?? 0 },
  ];

  return (
    <FormSection
      title="Hiệu suất"
      hint="Số liệu hệ thống ghi nhận — không chỉnh sửa được"
      icon={Shell}
      bodyClassName="space-y-3"
    >
      <div className="grid grid-cols-2 gap-2">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-border bg-navy-50/50 px-3 py-2.5 dark:bg-navy-500/8"
          >
            <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.02em] text-muted-foreground">
              <stat.icon
                className={cn(
                  "h-3.5 w-3.5",
                  // Sao đánh giá là ngoại lệ màu vàng duy nhất của hệ thống
                  stat.star ? "fill-amber-400 text-amber-400" : "text-navy-600",
                )}
                strokeWidth={2}
              />
              {stat.label}
            </p>
            <p className="mt-1 text-[15px] font-extrabold tabular-nums text-navy-700 dark:text-navy-100">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <dl className="space-y-1 border-t border-border pt-3 text-[11px]">
        <div className="flex items-baseline justify-between gap-2">
          <dt className="text-muted-foreground">Tạo lúc</dt>
          <dd className="font-semibold tabular-nums text-navy-700 dark:text-navy-100">
            {formatDateTime(product?.created_at)}
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-2">
          <dt className="text-muted-foreground">Cập nhật</dt>
          <dd className="font-semibold tabular-nums text-navy-700 dark:text-navy-100">
            {formatDateTime(product?.updated_at)}
          </dd>
        </div>
      </dl>
    </FormSection>
  );
};

export default ProductPerformance;
