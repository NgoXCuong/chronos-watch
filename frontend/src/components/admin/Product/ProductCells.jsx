import { ImageOff } from "lucide-react";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Popover, PopoverContent, PopoverTitle, PopoverTrigger } from "../../ui/popover";
import { cn } from "@/lib/utils";
import { PRODUCT_STATUS, LOW_STOCK_THRESHOLD } from "../../../constants/productStatus";

// Ô "Sản phẩm": ảnh 40px + tên + SKU (mono) — spec §6 design system
export const ProductInfoCell = ({ product }) => (
  <div className="flex min-w-0 items-center gap-3">
    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-muted">
      {product.image_url ? (
        <img
          src={product.image_url}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      ) : (
        <ImageOff className="h-4 w-4 text-muted-foreground" strokeWidth={2} />
      )}
    </div>
    <div className="min-w-0">
      <p title={product.name} className="line-clamp-2 text-[13px] font-semibold leading-snug text-card-foreground">
        {product.name}
      </p>
      <p className="truncate text-[11px] text-muted-foreground">
        {product.sku ? (
          <span className="font-mono uppercase">{product.sku}</span>
        ) : (
          product.brand?.name || "Chưa có mã"
        )}
      </p>
    </div>
  </div>
);

export const ProductBrandCell = ({ brand }) => (
  <span className="text-[13px] font-medium text-card-foreground">
    {brand?.name || "—"}
  </span>
);

export const ProductCategoriesCell = ({ categories = [] }) =>
  categories.length === 0 ? (
    <span className="text-[13px] text-muted-foreground">—</span>
  ) : (
    <div className="flex max-w-[188px] items-center gap-1.5 whitespace-nowrap">
      <Badge variant="brand" className="min-w-0" title={categories[0].name}>
        <span className="truncate">{categories[0].name}</span>
      </Badge>
      {categories.length > 1 && (
        <Popover>
          <PopoverTrigger render={
            <Button variant="secondary" size="sm"
              className="h-7 shrink-0 px-2 text-[11px] tabular-nums normal-case"
              aria-label={`Xem tất cả ${categories.length} danh mục`}
            />
          }>
            +{categories.length - 1}
          </PopoverTrigger>
          <PopoverContent>
            <PopoverTitle>Danh mục sản phẩm ({categories.length})</PopoverTitle>
            <ul className="mt-2 space-y-1.5">
              {categories.map(cat => (
                <li key={cat.id} className="text-xs leading-relaxed text-popover-foreground break-words">
                  {cat.name}
                </li>
              ))}
            </ul>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );

const stockTone = (stock) =>
  stock === 0
    ? "text-sale"
    : stock <= LOW_STOCK_THRESHOLD
      ? "text-warning"
      : "text-card-foreground";

export const ProductStockCell = ({ stock = 0 }) => (
  <span
    className={cn(
      "inline-flex items-center gap-1.5 text-[13px] font-bold tabular-nums",
      stockTone(stock),
    )}
  >
    {stock}
    {stock <= LOW_STOCK_THRESHOLD && (
      <span
        aria-hidden="true"
        className="h-1.5 w-1.5 animate-pulse rounded-full bg-warning"
      />
    )}
  </span>
);

export const ProductStatusBadge = ({ status }) => {
  const config = PRODUCT_STATUS[status];
  return (
    <Badge variant={config?.badge ?? "muted"}>
      <span className={cn("h-1.5 w-1.5 rounded-full", config?.dot)} />
      {config?.label ?? status}
    </Badge>
  );
};
