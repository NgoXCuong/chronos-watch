import "../../styles/flash-sale-storefront.css";
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Zap, ArrowUpRight, Clock } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import useFlashSale from "../../hooks/useFlashSale";
import { formatTimeLeft } from "../../utils/flashSale";
import FlashSaleCountdown from "./FlashSaleCountdown";
import FlashSaleRail from "./FlashSaleRail";

export default function FlashSalePanel() {
  const { loading, state, sale, items, upcoming, endsInMs, startsInMs } = useFlashSale();
  const { hash } = useLocation();
  useEffect(() => {
    if (!loading && hash === "#flash-sale") document.getElementById("flash-sale")?.scrollIntoView({ behavior: "smooth" });
  }, [loading, hash]);
  if (!loading && !sale && !upcoming) return null;
  const ended = state === "expired";
  const active = !!sale && !ended && state !== "sold_out";
  const visible = (items || []).filter((item) => item.product);
  const status = ended ? "Đã kết thúc" : state === "sold_out" ? "Đã hết suất" : sale ? "Đang diễn ra" : "Sắp mở bán";
  return <section id="flash-sale" className="flash-storefront" aria-labelledby="home-flash-title">
    <header className="flash-storefront-header">
      <div className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-sale text-white"><Zap size={22} fill="currentColor" /></span>
        <div>
          <div className="flex flex-wrap items-center gap-3"><h2 id="home-flash-title" className="text-xl font-extrabold uppercase tracking-tight text-sale">Flash Sale</h2>
            {!loading && <span className="rounded-full border border-sale/25 bg-card px-2.5 py-1 text-[10px] font-bold uppercase text-sale">{status}</span>}
          </div>
          {loading ? <div className="mt-2 h-3 w-40 animate-pulse rounded bg-muted" /> : <p className="mt-1 text-xs text-muted-foreground">{sale?.name || upcoming?.name} · Ưu đãi theo suất, số lượng có hạn</p>}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-5">
        {sale && <div><p className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase text-muted-foreground"><Clock size={12} />{active ? "Kết thúc trong" : status}</p><FlashSaleCountdown msLeft={endsInMs} tone="sale" size="sm" /></div>}
        {!loading && !sale && upcoming && <p className="text-xs font-semibold text-sale">Mở bán sau {formatTimeLeft(startsInMs)}</p>}
        <Link to="/products?sort=discount" className={cn(buttonVariants({ variant: "outline", size: "sm" }), "border-sale/30 text-sale hover:bg-sale/10 hover:text-sale")}>Xem ưu đãi <ArrowUpRight size={14} /></Link>
      </div>
    </header>
    {loading ? <div className="flash-storefront-products">{[0,1,2,3].map((key) => <div key={key} className="overflow-hidden rounded-xl border border-border bg-card"><div className="aspect-square animate-pulse bg-muted" /><div className="space-y-2 p-4"><div className="h-3 animate-pulse rounded bg-muted" /><div className="h-5 w-1/2 animate-pulse rounded bg-muted" /></div></div>)}</div>
      : visible.length ? <FlashSaleRail key={sale?.id || "current"} items={visible} ended={ended} />
      : <p className="px-6 py-10 text-center text-sm text-muted-foreground">{upcoming ? "Sản phẩm ưu đãi sẽ xuất hiện khi đợt mở bán bắt đầu." : "Các suất ưu đãi hiện đã hết. Khám phá những sản phẩm khác tại Chronos."}</p>}
  </section>;
}
