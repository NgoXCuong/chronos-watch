import { Eye, MoreVertical, RefreshCcw, SlidersHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { buttonVariants } from "../../ui/button";
import { cn } from "../../../lib/utils";
import { ORDER_STATUS, getNextStatuses } from "../../../constants/orderStatus";

// Menu thao tác dòng: xem chi tiết + chỉ liệt kê trạng thái kế tiếp hợp lệ
export const OrderRowActions = ({
  order,
  onView,
  onStatusUpdate,
  updating,
}) => {
  const next = getNextStatuses(order.status);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`Thao tác đơn ${order.order_code || `#${order.id}`}`}
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "h-8 w-8 rounded-lg text-muted-foreground hover:bg-navy-50 hover:text-navy-700 dark:hover:bg-navy-500/15 dark:hover:text-navy-100",
        )}
      >
        <MoreVertical className="h-4 w-4" strokeWidth={2} />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 p-1.5">
        <DropdownMenuItem
          className="gap-2.5 rounded-lg py-2 text-[13px] font-semibold"
          onSelect={() => onView(order.id)}
        >
          <Eye className="h-4 w-4 text-muted-foreground" strokeWidth={2} />
          Chi tiết đơn hàng
        </DropdownMenuItem>
        <DropdownMenuSeparator className="my-1" />
        <p className="flex items-center gap-1.5 px-2 pb-1 pt-1.5 text-[11px] font-bold uppercase tracking-[0.02em] text-muted-foreground">
          <SlidersHorizontal className="h-3 w-3" strokeWidth={2} />
          Chuyển trạng thái
        </p>
        {updating ? (
          <div className="py-4 text-center">
            <RefreshCcw className="mx-auto h-4 w-4 animate-spin text-navy-600 dark:text-navy-200" />
          </div>
        ) : next.length > 0 ? (
          next.map((status) => {
            const Icon = ORDER_STATUS[status].icon;
            return (
              <DropdownMenuItem
                key={status}
                className="gap-2.5 rounded-lg py-2 text-[13px] font-semibold"
                onSelect={() => onStatusUpdate(order.id, status)}
              >
                <Icon
                  className="h-4 w-4 text-muted-foreground"
                  strokeWidth={2}
                />
                {ORDER_STATUS[status].label}
              </DropdownMenuItem>
            );
          })
        ) : (
          <p className="px-2 py-2 text-[12px] text-muted-foreground">
            Đơn đã khóa — không còn trạng thái kế tiếp
          </p>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
