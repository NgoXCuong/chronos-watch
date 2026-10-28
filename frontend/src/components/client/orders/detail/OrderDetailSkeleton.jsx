import { cn } from "@/lib/utils";

const Block = ({ className }) => (
  <div
    aria-hidden="true"
    className={cn("animate-pulse rounded-xl bg-muted", className)}
  />
);

/** Khung xương trang chi tiết đơn: giữ bố cục panel để trang không nhảy layout khi có dữ liệu. */
const OrderDetailSkeleton = () => (
  <div className="space-y-4">
    <div className="flex items-center gap-3">
      <Block className="size-9 rounded-full" />
      <div className="space-y-2">
        <Block className="h-3 w-40" />
        <Block className="h-3 w-24" />
      </div>
    </div>
    <Block className="h-28" />
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
      <Block className="h-64" />
      <div className="space-y-4">
        <Block className="h-40" />
        <Block className="h-48" />
      </div>
    </div>
  </div>
);

export default OrderDetailSkeleton;
