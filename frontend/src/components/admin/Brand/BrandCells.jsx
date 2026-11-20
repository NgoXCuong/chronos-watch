import { uiTone } from '../../../constants/uiTones';
import { cn } from "@/lib/utils";
import { Badge } from "../../ui/badge";

const initialsOf = (name = "") => name.trim().charAt(0).toUpperCase() || "?";

// brands.logo_url + name + slug (slug để mono vì admin hay đối chiếu URL)
export const BrandInfoCell = ({ brand }) => (
  <div className="flex min-w-0 items-center gap-3">
    <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-navy-50 dark:bg-navy-500/10">
      {brand.logo_url ? (
        <img
          src={brand.logo_url}
          alt={brand.name}
          className="h-full w-full object-contain p-1"
        />
      ) : (
        <span className="text-[13px] font-extrabold text-navy-600 dark:text-navy-200">
          {initialsOf(brand.name)}
        </span>
      )}
    </span>
    <span className="min-w-0">
      <span className="block truncate text-[13px] font-bold text-foreground">
        {brand.name}
      </span>
      <span className="block truncate font-mono text-[11px] text-muted-foreground">
        {brand.slug || "—"}
      </span>
    </span>
  </div>
);

export const BrandCountryCell = ({ value }) =>
  value ? (
    <span className="text-[13px] font-medium text-foreground">{value}</span>
  ) : (
    <span className="text-[13px] text-muted-foreground">Chưa rõ</span>
  );

// product_count là alias do backend tính (subquery trên products)
// số > 0 tô teal để phân biệt "thương hiệu đang có hàng" với thương hiệu rỗng
export const BrandCountCell = ({ count }) => (
  <span
    className={cn(
      "inline-flex h-6 min-w-9 items-center justify-center rounded-md px-2 text-[13px] font-extrabold tabular-nums",
      count > 0
        ? "bg-teal-50 text-teal-700 ring-1 ring-teal-200/70 dark:bg-teal-500/15 dark:text-teal-200 dark:ring-teal-500/25"
        : "text-muted-foreground"
    )}
  >
    {count || 0}
  </span>
);

export const BrandStatusBadge = ({ isActive }) => (
  <Badge variant={isActive ? "success" : "muted"}>
    {isActive ? "Đang hiển thị" : "Đang ẩn"}
  </Badge>
);

export const BrandDescriptionCell = ({ value }) => {
  const text = String(value || '').replace(/<[^>]*>/g, '').trim();
  return <p className="line-clamp-2 break-words text-xs leading-relaxed text-muted-foreground" title={text || 'Chưa có mô tả'}>{text || 'Chưa có mô tả'}</p>;
};

export const BrandAvailabilityCell = ({ active, total }) => Number(total) > 0
  ? <span title="Số mẫu đang mở bán / Tổng số mẫu của thương hiệu" className="whitespace-nowrap text-xs tabular-nums"><strong className="text-foreground">{Number(active || 0).toLocaleString('vi-VN')}</strong><span className="mx-1 text-muted-foreground">/</span>{Number(total).toLocaleString('vi-VN')}</span>
  : <span className="text-[11px] text-muted-foreground">Chưa có mẫu</span>;

export const BrandStockCell = ({ value }) => {
  const t = uiTone('teal');
  return <span title="Tổng số chiếc trong kho, gồm cả mẫu ngừng bán" className={cn('inline-flex rounded-md px-2 py-1 text-xs font-semibold tabular-nums', Number(value) > 0 ? t.block + ' ' + t.value : 'text-muted-foreground')}>{Number(value || 0).toLocaleString('vi-VN')} <span className="ml-1 font-normal">chiếc</span></span>;
};
