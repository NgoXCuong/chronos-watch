import { Link } from "react-router-dom";
import { formatCurrency } from "@/utils/formatCurrency";
import { orderItems } from "@/utils/myOrders";
import { cn } from "@/lib/utils";

const MAX_THUMBS = 4;

const Thumb = ({ item, size = "large" }) => (
  <div
    className={cn(
      "shrink-0 overflow-hidden rounded-lg border border-border bg-navy-50 p-1",
      size === "large" ? "size-20" : "size-14",
    )}
  >
    {item.image ? (
      <img
        src={item.image}
        alt={item.name}
        loading="lazy"
        className="size-full object-contain"
      />
    ) : (
      <span className="flex size-full items-center justify-center text-[11px] text-muted-foreground">
        Ảnh mất
      </span>
    )}
  </div>
);

/**
 * Ảnh đại diện + tên sản phẩm đầu, các dòng còn lại chỉ còn thumbnail.
 * Tên và ảnh lấy từ SNAPSHOT của đơn (`product_name`/`product_image`), nên đơn cũ
 * vẫn hiển thị đúng như khách đã mua kể cả khi sản phẩm đã đổi tên hoặc bị gỡ.
 */
const MyOrderItems = ({ order, className }) => {
  const items = orderItems(order);
  const first = items[0];
  const rest = items.slice(1, MAX_THUMBS);
  const hidden = Math.max(0, items.length - 1 - rest.length);

  if (!first) {
    return (
      <p className={cn("text-[13px] text-muted-foreground", className)}>
        Đơn không còn dòng sản phẩm nào hiển thị được.
      </p>
    );
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Thumb item={first} />
      <div className="min-w-0 flex-1">
        {first.slug && first.status !== "inactive" ? (
          <Link
            to={`/products/${first.slug}`}
            className="block truncate text-sm font-bold text-foreground transition-colors hover:text-navy-600"
          >
            {first.name}
          </Link>
        ) : (
          <p className="truncate text-sm font-bold text-foreground">{first.name}</p>
        )}
        <p className="mt-0.5 text-[12px] tabular-nums text-muted-foreground">
          {formatCurrency(first.unitPrice)} × {first.quantity}
          {items.length > 1 && ` · ${items.length} mặt hàng`}
        </p>
      </div>
      <div className="hidden items-center gap-2 sm:flex">
        {rest.map((item) => (
          <Thumb key={item.key} item={item} size="small" />
        ))}
        {hidden > 0 && (
          <span className="flex size-14 items-center justify-center rounded-lg border border-border bg-muted text-[12px] font-bold tabular-nums text-muted-foreground">
            +{hidden}
          </span>
        )}
      </div>
    </div>
  );
};

export default MyOrderItems;
