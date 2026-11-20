import { TrendingUp, ChevronRight, Trophy, Medal } from "lucide-react";
import { Button } from "../../ui/button";
import { cn } from "../../../lib/utils";
import { rankingTone } from "../../../constants/rankingTones";

const PodiumBar = ({ product, rank, navigate }) => {
  const tone = rankingTone(rank);
  const style = { ring: tone.block, base: tone.block, rank: tone.value, count: tone.value, badge: tone.chip, height: rank === 1 ? "h-24" : rank === 2 ? "h-18" : "h-14" };
  const isWinner = rank === 1;
  return (
    <button
      type="button"
      className="group flex min-w-0 cursor-pointer flex-col items-center rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
      aria-label={`Hạng ${rank}: ${product.name}, ${product.sold_count} đã bán`}
      onClick={() => navigate(`/admin/products/edit/${product.id}`)}
    >
      <div className={cn("relative mb-3", isWinner && "scale-110")}>
        <div
          className={cn(
            "overflow-hidden rounded-xl border-2 bg-card p-1 shadow-card transition-all group-hover:shadow-hover",
            isWinner ? "h-20 w-20" : "h-16 w-16",
            style.ring,
          )}
        >
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full rounded-lg object-contain"
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
        <p title={product.name} className="line-clamp-1 h-4 text-[11px] font-semibold text-card-foreground">
          {product.name}
        </p>
        <div
          className={cn(
            "relative flex flex-col items-center justify-center overflow-hidden rounded-t-xl border-x border-t transition-transform duration-200 group-hover:-translate-y-1 motion-reduce:transform-none",
            style.height,
            style.base,
          )}
        >
          <span className={cn("absolute inset-x-0 top-0 h-1", tone.edge)} aria-hidden="true" />
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
    </button>
  );
};

const TopSellingProducts = ({ products, navigate }) => {
  const top3 = products?.slice(0, 3) || [];
  const podiumOrder = [top3[1], top3[0], top3[2]].filter(Boolean);
  const rankOf = (product) => top3.indexOf(product) + 1;

  return (
    <div className="flex h-full min-h-0 min-w-0 flex-col rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="mb-3 flex items-center justify-between gap-3">
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

      <div className="flex min-h-0 flex-1 flex-col justify-end">
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

    </div>
  );
};

export default TopSellingProducts;
