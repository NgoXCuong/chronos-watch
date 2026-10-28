import { Link } from "react-router-dom";
import { PackageX, ShoppingCart, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/formatCurrency";
import anhminhhoa from "@/assets/anh-minh-hoa.jpg";

/** Một món đã lưu: vào lại trang sản phẩm, thêm vào giỏ, hoặc bỏ lưu ngay tại thẻ. */
const WishlistCard = ({ product, onAddToCart, onRemove }) => {
  const price = Number(product?.price || 0);
  const oldPrice = Number(product?.old_price || 0);
  const discount = oldPrice > price ? Math.round((1 - price / oldPrice) * 100) : 0;
  const unavailable = product?.status === "inactive";
  const to = `/products/${product?.slug || ""}`;

  const image = (
    <img
      src={product?.image_url || anhminhhoa}
      alt={product?.name}
      loading="lazy"
      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
    />
  );

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-card transition-colors hover:border-navy-300">
      <div className="relative block aspect-square overflow-hidden bg-navy-50">
        {unavailable ? (
          <div aria-label={product?.name} className="block h-full w-full">
            {image}
          </div>
        ) : (
          <Link to={to} aria-label={product?.name} className="block h-full w-full">
            {image}
          </Link>
        )}

        {unavailable ? (
          <Badge variant="muted" className="absolute left-3 top-3">
            Ngừng bán
          </Badge>
        ) : (
          discount > 0 && (
            <span className="absolute left-3 top-3 rounded-md bg-sale-soft px-2 py-1 text-[11px] font-extrabold uppercase text-sale">
              -{discount}%
            </span>
          )
        )}

        <button
          type="button"
          onClick={() => onRemove(product)}
          aria-label="Bỏ khỏi danh sách yêu thích"
          className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full border border-border bg-card/90 text-navy-300 backdrop-blur-sm transition-colors hover:border-sale hover:text-sale"
        >
          <X size={14} strokeWidth={2} aria-hidden="true" />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="self-start rounded-md bg-navy-100 px-2 py-0.5 text-[11px] font-bold uppercase tracking-[0.05em] text-navy-700">
          {product?.brand?.name || "Chronos"}
        </span>

        {unavailable ? (
          <h3 className="line-clamp-2 text-sm font-medium leading-snug text-card-foreground">
            {product?.name}
          </h3>
        ) : (
          <Link to={to}>
            <h3 className="line-clamp-2 text-sm font-medium leading-snug text-card-foreground transition-colors hover:text-navy-600">
              {product?.name}
            </h3>
          </Link>
        )}

        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <div>
            <p className="text-[15px] font-extrabold tabular-nums text-navy-600">
              {formatCurrency(price)}
            </p>
            {!unavailable && oldPrice > price && (
              <p className="text-[11px] line-through tabular-nums text-muted-foreground">
                {formatCurrency(oldPrice)}
              </p>
            )}
          </div>
          <Button
            variant="buy"
            size="sm"
            disabled={unavailable}
            onClick={() => onAddToCart(product)}
            className="gap-1.5"
            title={unavailable ? "Sản phẩm đã ngừng bán" : undefined}
          >
            {unavailable ? (
              <PackageX size={14} strokeWidth={2} aria-hidden="true" />
            ) : (
              <ShoppingCart size={14} strokeWidth={2} aria-hidden="true" />
            )}
            {unavailable ? "Ngừng bán" : "Thêm giỏ"}
          </Button>
        </div>
      </div>
    </article>
  );
};

export default WishlistCard;
