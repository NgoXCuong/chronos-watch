import { Link } from "react-router-dom";
import { Package, ShieldCheck, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/formatCurrency";
import { isDeliveredOrder, orderItems, reviewLink } from "@/utils/myOrders";
import OrderDetailPanel from "./OrderDetailPanel";

const Item = ({ item, canReview }) => {
  const to = reviewLink(item);
  const inactive = item.status === "inactive";
  const canOpen = Boolean(item.slug) && !inactive;

  return (
    <li className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
      <div className="size-16 shrink-0 overflow-hidden rounded-lg border border-border bg-navy-50 p-1">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            className="size-full object-contain"
          />
        ) : (
          <span className="flex size-full items-center justify-center">
            <Package size={18} strokeWidth={1.6} className="text-navy-300" aria-hidden="true" />
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        {canOpen ? (
          <Link
            to={`/products/${item.slug}`}
            className="line-clamp-2 text-sm font-bold text-foreground transition-colors hover:text-navy-600"
          >
            {item.name}
          </Link>
        ) : (
          <p className="line-clamp-2 text-sm font-bold text-foreground">{item.name}</p>
        )}

        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          {item.sku && (
            <Badge variant="muted" className="font-mono">
              {item.sku}
            </Badge>
          )}
          {inactive && <Badge variant="muted">Ngừng bán</Badge>}
          {item.warrantyMonths > 0 && (
            <Badge variant="brand" className="gap-1">
              <ShieldCheck size={11} strokeWidth={2} aria-hidden="true" />
              {item.warrantyMonths} tháng
            </Badge>
          )}
          {canReview && to && (
            <Link
              to={to}
              className="inline-flex items-center gap-1 text-[12px] font-semibold text-navy-600 transition-colors hover:text-navy-700"
            >
              <Star size={12} strokeWidth={2} aria-hidden="true" />
              Đánh giá
            </Link>
          )}
        </div>
      </div>

      <div className="shrink-0 text-right">
        <p className="text-[12px] tabular-nums text-muted-foreground">
          {formatCurrency(item.unitPrice)} × {item.quantity}
        </p>
        <p className="text-sm font-bold tabular-nums text-navy-700">
          {formatCurrency(item.lineTotal)}
        </p>
      </div>
    </li>
  );
};

/**
 * Dòng sản phẩm lấy từ SNAPSHOT của đơn (product_name/product_image/sku/warranty_months),
 * nên đơn cũ vẫn hiển thị đúng như khách đã mua kể cả khi sản phẩm đã đổi hoặc bị gỡ.
 */
const OrderDetailItems = ({ order, className }) => {
  const items = orderItems(order);
  const canReview = isDeliveredOrder(order);

  return (
    <OrderDetailPanel
      title="Sản phẩm"
      icon={Package}
      className={className}
      aside={
        <span className="text-[12px] font-semibold tabular-nums text-muted-foreground">
          {items.length} mặt hàng
        </span>
      }
      bodyClassName="py-1"
    >
      {items.length === 0 ? (
        <p className="py-3 text-[13px] text-muted-foreground">
          Đơn hàng không còn dòng sản phẩm nào để hiển thị.
        </p>
      ) : (
        <ul className="divide-y divide-border">
          {items.map((item) => (
            <Item key={item.key} item={item} canReview={canReview} />
          ))}
        </ul>
      )}
    </OrderDetailPanel>
  );
};

export default OrderDetailItems;
