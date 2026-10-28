import { useNavigate } from "react-router-dom";
import { AlertTriangle, ArrowRight, PackageCheck, Boxes } from "lucide-react";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { cn } from "../../../lib/utils";

const CRITICAL_STOCK = 3;

const StockRow = ({ product }) => {
  const critical = product.stock <= CRITICAL_STOCK;
  return (
    <div
      className={cn(
        "group relative flex items-center gap-3 overflow-hidden rounded-lg border border-border bg-card p-2.5 transition-all hover:shadow-card",
        critical && "border-l-2 border-l-sale",
      )}
    >
      <span className="h-10 w-10 shrink-0 overflow-hidden rounded-md border border-border bg-navy-50 dark:bg-navy-500/10">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <Boxes className="m-2 h-6 w-6 text-navy-300" strokeWidth={2} />
        )}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-[12px] font-semibold text-card-foreground">
            {product.name}
          </p>
          <Badge
            variant={critical ? "destructive-soft" : "warning"}
            className="tabular-nums"
          >
            còn {product.stock}
          </Badge>
        </div>
        <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-muted">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-700",
              critical ? "bg-sale" : "bg-warning",
            )}
            style={{ width: `${Math.min(100, (product.stock / 15) * 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};

const OperationBrief = ({ lowStockProducts, stats }) => {
  const navigate = useNavigate();
  const count = stats?.low_stock_count ?? lowStockProducts?.length ?? 0;

  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-warning-soft text-warning">
            <AlertTriangle className="h-5 w-5" strokeWidth={2} />
          </span>
          <h3 className="text-base font-bold text-foreground">
            Cảnh báo tồn kho
          </h3>
        </div>
        {count > 0 && <Badge variant="warning">{count} sản phẩm</Badge>}
      </div>

      {lowStockProducts?.length > 0 ? (
        <>
          <div className="max-h-96 flex-1 space-y-2 overflow-y-auto pr-1">
            {lowStockProducts.map((product, idx) => (
              <StockRow key={product.id ?? idx} product={product} />
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="mt-4 w-full"
            onClick={() => navigate("/admin/products")}
          >
            Quản lý kho hàng
            <ArrowRight className="h-4 w-4" />
          </Button>
        </>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-success-soft bg-success-soft/40 py-10 text-center dark:border-success/30 dark:bg-success/10">
          <PackageCheck className="h-8 w-8 text-success" strokeWidth={2} />
          <p className="text-sm font-bold text-foreground">Kho hàng an toàn</p>
          <p className="text-[11px] uppercase tracking-[0.06em] text-muted-foreground">
            Tất cả sản phẩm đều đủ hàng
          </p>
        </div>
      )}
    </div>
  );
};

export default OperationBrief;
