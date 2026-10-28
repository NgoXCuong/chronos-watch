import { ImageOff, ShoppingBag } from "lucide-react";
import DetailSection from "./DetailSection";
import { cn } from "@/lib/utils";
import { formatCurrency } from "../../../../utils/formatCurrency";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../ui/table";

const HEAD =
  "text-xs font-bold uppercase tracking-[0.02em] whitespace-nowrap text-navy-700 dark:text-navy-100";

const ItemCell = ({ item }) => (
  <div className="flex min-w-0 items-center gap-3">
    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-muted">
      {item.product_image || item.product?.image_url ? (
        <img
          src={item.product_image || item.product?.image_url}
          alt={item.product_name || item.product?.name}
          loading="lazy"
          className="h-full w-full object-cover p-0.5"
        />
      ) : (
        <ImageOff className="h-4 w-4 text-muted-foreground" strokeWidth={2} />
      )}
    </div>
    <div className="min-w-0">
      <p className="truncate text-[13px] font-semibold text-card-foreground">
        {item.product_name || item.product?.name || "Sản phẩm đã xóa"}
      </p>
      <p className="truncate text-[11px] text-muted-foreground">
        <span className="font-mono uppercase">
          {item.sku || item.product?.sku || `#${item.product_id}`}
        </span>
      </p>
    </div>
  </div>
);

// Bảng sản phẩm đã mua — đối chiếu tiền nằm ở bảng điều khiển trên đầu trang
const OrderItemsTable = ({ order }) => {
  const items = order.details || [];
  const units = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const goodsTotal = items.reduce(
    (sum, item) => sum + Number(item.price || 0) * (item.quantity || 0),
    0,
  );

  return (
    <DetailSection
      title="Sản phẩm đặt mua"
      icon={ShoppingBag}
      actions={
        <span className="text-[11px] font-semibold text-muted-foreground">
          {items.length} dòng · {units} chiếc
        </span>
      }
      bodyClassName="p-0"
    >
      <Table>
        <TableHeader className="bg-navy-50/40 dark:bg-navy-500/5">
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className={cn(HEAD, "w-[46%] px-5 py-3")}>
              Sản phẩm
            </TableHead>
            <TableHead className={cn(HEAD, "w-[18%] px-5 py-3 text-right")}>
              Đơn giá
            </TableHead>
            <TableHead className={cn(HEAD, "w-[12%] px-5 py-3 text-center")}>
              S.Lượng
            </TableHead>
            <TableHead className={cn(HEAD, "w-[24%] px-5 py-3 text-right")}>
              Thành tiền
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-border">
          {items.map((item) => (
            <TableRow key={item.id} className="hover:bg-muted/40">
              <TableCell className="px-5 py-3">
                <ItemCell item={item} />
              </TableCell>
              <TableCell className="px-5 py-3 text-right text-[13px] tabular-nums text-card-foreground">
                {formatCurrency(item.price)}
              </TableCell>
              <TableCell className="px-5 py-3 text-center text-[13px] font-bold tabular-nums text-navy-700 dark:text-navy-100">
                {item.quantity}
              </TableCell>
              <TableCell className="px-5 py-3 text-right text-[13px] font-bold tabular-nums text-card-foreground">
                {formatCurrency(item.price * item.quantity)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <p className="flex items-baseline justify-between gap-6 border-t border-border bg-muted/30 px-5 py-3.5 text-[13px] font-bold tabular-nums text-navy-700 dark:text-navy-100">
        <span className="text-xs font-bold uppercase tracking-[0.02em]">
          Tổng tiền hàng
        </span>
        {formatCurrency(goodsTotal)}
      </p>
    </DetailSection>
  );
};

export default OrderItemsTable;
