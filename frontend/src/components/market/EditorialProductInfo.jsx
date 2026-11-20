import { Link } from "react-router-dom";
import { ArrowUpRight, Star } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { formatCurrency } from "../../utils/formatCurrency";
import { productCardFacts } from "../../utils/productCardFacts";

export default function EditorialProductInfo({ product, name, slug, price, originalPrice }) {
  const count = Number(product.review_count) || 0;
  const rating = Number(product.average_rating) || 0;
  const facts = productCardFacts(product);
  const discounted = Number(originalPrice) > Number(price);
  return <div className="editorial-product-info">
    <div className="editorial-product-meta">
      <span>{product.brand?.name || "Chronos"}</span>
      {count > 0 ? <span className="inline-flex items-center gap-1"><Star size={12} className="fill-current" />{rating.toFixed(1)} ({count})</span> : <span>Chưa có đánh giá</span>}
    </div>
    <Link to={`/products/${slug}`} className="editorial-product-title"><h3>{name}</h3></Link>
    <dl className="editorial-product-facts">{facts.map(({ label, value }) => <div key={label}><dt>{label}</dt><dd title={value}>{value}</dd></div>)}</dl>
    <div className="editorial-product-price">
      <span className="text-[10px] text-muted-foreground">Giá bán</span>
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1"><strong className={cn("tabular-nums", discounted ? "text-sale" : "text-primary")}>{formatCurrency(price)}</strong>
        {discounted && <del className="text-xs tabular-nums text-muted-foreground">{formatCurrency(originalPrice)}</del>}
      </div>
    </div>
    <Link to={`/products/${slug}`} className={cn(buttonVariants({ variant: "default" }), "mt-3 w-full text-xs")}>Xem sản phẩm <ArrowUpRight size={15} /></Link>
  </div>;
}
