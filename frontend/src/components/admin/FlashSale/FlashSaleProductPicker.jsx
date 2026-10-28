import { useCallback, useEffect, useState } from "react";
import { ImageOff, Search } from "lucide-react";
import { toast } from "sonner";
import productApi from "../../../api/product.api";
import useDebounce from "../../../hooks/useDebounce";
import AdminPagination from "../Common/AdminPagination";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogCloseButton,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Input } from "../../ui/input";
import { cn } from "@/lib/utils";
import { FLASH_PRODUCT_PAGE_SIZE } from "../../../constants/flashSale";
import { formatCurrency } from "../../../utils/formatCurrency";

// /products (public) chỉ trả sản phẩm status='active' — đúng ràng buộc backend
// chặn đưa sản phẩm ngừng bán vào đợt, nên ô chọn không cần lọc lại.
const ProductOption = ({ product, chosen, onPick }) => (
  <li>
    <button
      type="button"
      disabled={chosen}
      onClick={() => onPick(product)}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg border border-transparent px-2.5 py-2 text-left transition-colors",
        chosen
          ? "cursor-not-allowed bg-muted/60 text-muted-foreground"
          : "hover:border-navy-200 hover:bg-navy-50/70 dark:hover:bg-navy-500/10",
      )}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-muted">
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
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13px] font-semibold text-card-foreground">
          {product.name}
        </span>
        <span className="block truncate text-[11px] text-muted-foreground">
          {product.sku ? (
            <span className="font-mono uppercase">{product.sku}</span>
          ) : (
            (product.brand?.name ?? "Chưa có mã")
          )}
          {` · kho ${Number(product.stock) || 0}`}
        </span>
      </span>
      <span className="shrink-0 text-right">
        <span className="block text-[13px] font-bold tabular-nums text-foreground">
          {formatCurrency(product.price)}
        </span>
        {chosen && (
          <span className="block text-[11px] font-semibold text-muted-foreground">
            Đã có trong đợt
          </span>
        )}
      </span>
    </button>
  </li>
);

// Hộp tìm/chọn sản phẩm cho MỘT dòng ưu đãi — tách khỏi FlashSaleItemsEditor để
// mỗi file ở dưới ngưỡng 300 dòng (Rule 1).
const FlashSaleProductPicker = ({ open, selectedIds = [], onPick, onClose }) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const debouncedSearch = useDebounce(search, 400);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await productApi.getAll({
        search: debouncedSearch,
        page,
        limit: FLASH_PRODUCT_PAGE_SIZE,
      });
      setRows(data.rows || []);
      setCount(data.count || 0);
    } catch (err) {
      toast.error(err?.message || "Không tải được sản phẩm");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, page]);

  useEffect(() => {
    if (open) load();
  }, [open, load]);

  const chosen = new Set(selectedIds.map((id) => String(id)));

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose?.()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <DialogTitle>Chọn sản phẩm cho ưu đãi</DialogTitle>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                Danh sách chỉ có sản phẩm đang bán — giá niêm yết là mốc để backend
                chặn giá Flash bằng hoặc cao hơn.
              </p>
            </div>
            <DialogCloseButton onClick={onClose} />
          </div>
        </DialogHeader>

        <div className="space-y-2 px-5 pt-4">
          <div className="relative">
            <Input
              icon={Search}
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Tìm theo tên hoặc mã SKU..."
              className="h-10 rounded-lg text-sm"
            />
          </div>

          <ul className="max-h-[46vh] space-y-0.5 overflow-y-auto">
            {loading ? (
              <li className="py-10 text-center text-[13px] text-muted-foreground">
                Đang tải sản phẩm...
              </li>
            ) : rows.length === 0 ? (
              <li className="py-10 text-center text-[13px] text-muted-foreground">
                Không tìm thấy sản phẩm nào khớp từ khóa
              </li>
            ) : (
              rows.map((product) => (
                <ProductOption
                  key={product.id}
                  product={product}
                  chosen={chosen.has(String(product.id))}
                  onPick={onPick}
                />
              ))
            )}
          </ul>
        </div>

        <AdminPagination
          currentPage={page}
          totalPages={Math.max(1, Math.ceil(count / FLASH_PRODUCT_PAGE_SIZE))}
          totalCount={count}
          countLabel="sản phẩm"
          onPageChange={setPage}
        />

        <div className="flex justify-end px-5 py-3">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FlashSaleProductPicker;
