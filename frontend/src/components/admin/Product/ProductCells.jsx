import { ImageOff } from "lucide-react";
import { Badge } from "../../ui/badge";
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
      <p className="truncate text-[13px] font-semibold text-card-foreground">
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
    <div className="flex flex-wrap gap-1">
      {categories.map((cat) => (
        <Badge key={cat.id} variant="brand">
          {cat.name}
        </Badge>
      ))}
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
