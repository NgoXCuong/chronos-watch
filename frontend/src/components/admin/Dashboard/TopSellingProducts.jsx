import { TrendingUp, ChevronRight, Trophy, Medal } from "lucide-react";
import { Button } from "../../ui/button";
import { cn } from "../../../lib/utils";

const PODIUM = {
  1: {
    ring: "border-navy-600/40 dark:border-navy-300/40",
    base: "bg-navy-100/70 border-navy-200 dark:bg-navy-500/20 dark:border-navy-500/40",
    rank: "text-navy-700 dark:text-navy-100",
    count: "text-navy-700 dark:text-navy-100",
    badge: "bg-navy-600 text-white dark:bg-navy-300 dark:text-navy-950",
    medal: "text-navy-600 dark:text-navy-100",
    height: "h-28 md:h-32",
  },
  2: {
    ring: "border-border",
    base: "bg-navy-50 border-navy-100 dark:bg-navy-500/10 dark:border-navy-500/30",
    rank: "text-navy-500 dark:text-navy-100",
    count: "text-navy-700 dark:text-navy-100",
    badge: "bg-navy-300 text-navy-900",
    medal: "text-navy-500",
    height: "h-20 md:h-24",
  },
  3: {
    ring: "border-border",
    base: "bg-muted border-border",
    rank: "text-muted-foreground",
    count: "text-foreground",
    badge: "bg-navy-200 text-navy-800",
    medal: "text-navy-300",
    height: "h-14 md:h-16",
  },
};

const PodiumBar = ({ product, rank, navigate }) => {
  const style = PODIUM[rank];
  const isWinner = rank === 1;
  return (
    <div
      className="group flex cursor-pointer flex-col items-center"
      onClick={() => navigate(`/admin/products/edit/${product.id}`)}
    >
      <div className={cn("relative mb-3", isWinner && "scale-110")}>
        <div
          className={cn(
            "overflow-hidden rounded-xl border-2 bg-card p-1 shadow-card transition-all group-hover:shadow-hover",
            isWinner ? "h-24 w-24" : "h-20 w-20",
            style.ring,
          )}
        >
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full rounded-lg object-cover"
          />
        </div>
        <span
          className={cn(
            "absolute left-1/2 -translate-x-1/2 rounded-full border-2 border-card p-1 shadow-card",
            isWinner ? "-top-2.5" : "-bottom-2.5",
            style.badge,
          )}
        >
          {isWinner ? (
            <Trophy className="h-3.5 w-3.5" strokeWidth={2.5} />
          ) : (
            <Medal className="h-3 w-3" strokeWidth={2.5} />
          )}
        </span>
      </div>

      <div className="w-full space-y-1 text-center">
        <p className="line-clamp-1 h-4 text-[11px] font-semibold text-card-foreground">
          {product.name}
        </p>
        <div
          className={cn(
            "flex flex-col items-center justify-center rounded-t-xl border-x border-t",
            style.height,
            style.base,
          )}
        >
          <span
            className={cn("text-2xl font-extrabold tabular-nums", style.rank)}
          >
            {rank}
          </span>
          <span className="mt-0.5 flex items-baseline gap-1">
            <span className={cn("text-xs font-bold tabular-nums", style.count)}>
              {product.sold_count}
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
              đã bán
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

const TopSellingProducts = ({ products, navigate }) => {
  const top3 = products?.slice(0, 3) || [];
  const podiumOrder = [top3[1], top3[0], top3[2]].filter(Boolean);
  const rankOf = (product) => top3.indexOf(product) + 1;

  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy-50 text-navy-600 dark:bg-navy-500/15 dark:text-navy-100">
            <TrendingUp className="h-5 w-5" strokeWidth={2} />
          </span>
          <h3 className="text-base font-bold text-foreground">
            Top sản phẩm bán chạy
          </h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/admin/products")}
          className="text-navy-700 dark:text-navy-100"
        >
          Xem kho hàng
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="flex-1">
        {top3.length > 0 ? (
          <div className="grid grid-cols-3 items-end gap-3 pt-4 pb-2">
            {podiumOrder.map((product) => (
              <PodiumBar
                key={product.id}
                product={product}
                rank={rankOf(product)}
                navigate={navigate}
              />
            ))}
          </div>
        ) : (
          <div className="flex h-40 flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/40 text-muted-foreground">
            <Trophy className="mb-2 h-8 w-8 opacity-40" strokeWidth={2} />
            <p className="text-sm font-medium">Chưa có dữ liệu xếp hạng</p>
          </div>
        )}
      </div>

      {products?.length > 3 && (
        <div className="mt-4 space-y-1 border-t border-border pt-4">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.06em] text-muted-foreground">
            <span>Các sản phẩm khác</span>
            <span>Doanh số</span>
          </div>
          {products.slice(3, 6).map((product, idx) => (
            <button
              key={product.id ?? idx}
              onClick={() => navigate(`/admin/products/edit/${product.id}`)}
              className="flex w-full items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-navy-50 dark:hover:bg-navy-500/10"
            >
              <span className="flex min-w-0 items-center gap-2">
                <span className="w-3 text-[11px] font-bold text-muted-foreground tabular-nums">
                  {idx + 4}
                </span>
                <span className="truncate text-[11px] font-medium text-card-foreground">
                  {product.name}
                </span>
              </span>
              <span className="shrink-0 text-[11px] font-bold text-foreground tabular-nums">
                {product.sold_count}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TopSellingProducts;
