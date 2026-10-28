import { cn } from "@/lib/utils";

/** Khung chờ của một thẻ đơn — cùng hình dạng để danh sách không nhảy khi load xong. */
const MyOrderCardSkeleton = ({ className }) => (
  <div
    className={cn(
      "animate-pulse rounded-xl border border-border bg-card p-4 shadow-card md:p-5",
      className,
    )}
  >
    <div className="flex items-start justify-between gap-3 border-b border-border pb-3">
      <div className="space-y-2">
        <div className="h-3 w-16 rounded bg-muted" />
        <div className="h-4 w-36 rounded bg-muted" />
      </div>
      <div className="h-6 w-24 rounded-full bg-muted" />
    </div>
    <div className="flex items-center gap-3 py-4">
      <div className="size-20 rounded-lg bg-muted" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-2/3 rounded bg-muted" />
        <div className="h-3 w-1/3 rounded bg-muted" />
      </div>
    </div>
    <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
      <div className="h-6 w-28 rounded bg-muted" />
      <div className="h-8 w-32 rounded bg-muted" />
    </div>
  </div>
);

export default MyOrderCardSkeleton;
