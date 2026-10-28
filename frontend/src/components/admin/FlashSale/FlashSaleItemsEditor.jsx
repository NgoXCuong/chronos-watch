import { useState } from "react";
import { Boxes, ImageOff, Plus, Trash2 } from "lucide-react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { cn } from "@/lib/utils";
import FormSection from "../Common/FormSection";
import FlashSaleProductPicker from "./FlashSaleProductPicker";
import { FLASH_ITEM_DEFAULTS, FLASH_PRICE_STEP } from "../../../constants/flashSale";
import { emptyFlashItem } from "../../../utils/flashSaleForm";
import { formatCurrency } from "../../../utils/formatCurrency";

// Bố cục dòng ưu đãi là grid có ô soạn thảo, không phải bảng dữ liệu — dòng kiểm
// duyệt/chỉnh sửa inline được phép dựng riêng (Rule 3, AGENTS.md).
const GRID =
  "md:grid-cols-[minmax(0,1.5fr)_112px_96px_116px_72px_44px]";

const CELL_INPUT = "h-9 text-[13px] tabular-nums";

const FieldError = ({ message }) =>
  message ? (
    <p className="mt-1 text-[11px] font-semibold text-sale">{message}</p>
  ) : null;

const Thumb = ({ item }) => (
  <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-muted">
    {item.image_url ? (
      <img
        src={item.image_url}
        alt={item.name}
        loading="lazy"
        className="h-full w-full object-cover"
      />
    ) : (
      <ImageOff className="h-4 w-4 text-muted-foreground" strokeWidth={2} />
    )}
  </span>
);

const ProductCell = ({ item, error, onPick }) => {
  // Dòng đã bán thì không đổi sản phẩm được: backend upsert theo product_id nên
  // "đổi" = gỡ dòng cũ (bị chặn vì đã lũy kế sold_count) + tạo dòng mới.
  const sold = Number(item.sold_count) || 0;
  const locked = sold > 0;

  return (
    <div className="min-w-0">
      {item.product_id ? (
        <div className="flex items-center gap-2">
          <Thumb item={item} />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13px] font-semibold text-card-foreground">
              {item.name || `Sản phẩm #${item.product_id}`}
            </span>
            <span className="block truncate text-[11px] tabular-nums text-muted-foreground">
              {locked
                ? `đã bán ${sold} suất · giữ nguyên sản phẩm`
                : `niêm yết ${formatCurrency(item.list_price)}`}
            </span>
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={locked}
            title={
              locked
                ? `Đã bán ${sold} suất — không đổi sản phẩm của dòng này được`
                : "Chọn sản phẩm khác cho dòng"
            }
            onClick={onPick}
            className="h-8 shrink-0 rounded-md px-2 text-[11px] text-navy-600 hover:bg-navy-50 dark:text-navy-200"
          >
            Đổi
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onPick}
          className="h-9 w-full gap-1.5 rounded-lg border-dashed text-[12px]"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={2} />
          Chọn sản phẩm
        </Button>
      )}
      <FieldError message={error.product_id} />
    </div>
  );
};

const ItemRow = ({ item, index, error, onChange, onRemove, onPick }) => {
  const sold = Number(item.sold_count) || 0;
  const listPrice = Number(item.list_price) || 0;
  const flash = Number(item.flash_price) || 0;
  const off = listPrice > 0 && flash > 0 && flash < listPrice
    ? Math.round(((listPrice - flash) / listPrice) * 100)
    : 0;

  return (
    <div className={cn("grid gap-2 border-t border-border px-3 py-3", GRID)}>
      <ProductCell item={item} error={error} onPick={() => onPick(index)} />

      <div className="min-w-0">
        <Input
          type="number"
          min={FLASH_PRICE_STEP}
          step={FLASH_PRICE_STEP}
          value={item.flash_price}
          onChange={(event) => onChange(index, { flash_price: event.target.value })}
          placeholder="200000"
          aria-label={`Giá Flash dòng ${index + 1}`}
          className={CELL_INPUT}
          error={error.flash_price}
        />
        <FieldError message={error.flash_price} />
        {!error.flash_price && off > 0 && (
          <p className="mt-1 text-[11px] tabular-nums text-muted-foreground">
            giảm {off}% so với niêm yết
          </p>
        )}
      </div>

      <div className="min-w-0">
        <Input
          type="number"
          min={Math.max(1, sold)}
          step={1}
          value={item.quota}
          onChange={(event) => onChange(index, { quota: event.target.value })}
          aria-label={`Số suất dòng ${index + 1}`}
          className={CELL_INPUT}
          error={error.quota}
        />
        <FieldError message={error.quota} />
      </div>

      <div className="min-w-0">
        <Input
          type="number"
          min={0}
          step={1}
          value={item.per_user_limit}
          onChange={(event) => onChange(index, { per_user_limit: event.target.value })}
          aria-label={`Hạn mức mỗi khách dòng ${index + 1}`}
          className={CELL_INPUT}
          error={error.per_user_limit}
        />
        <FieldError message={error.per_user_limit} />
      </div>

      <p className="flex flex-col justify-center text-center leading-tight">
        <span className="text-[13px] font-bold tabular-nums text-foreground">{sold}</span>
        <span className="text-[11px] text-muted-foreground">đã bán</span>
      </p>

      <div className="flex items-center justify-end">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={sold > 0}
          aria-label={`Gỡ dòng ${index + 1}`}
          title={
            sold > 0
              ? `Đã bán ${sold} suất — không gỡ được dòng này`
              : "Gỡ dòng khỏi đợt"
          }
          onClick={() => onRemove(index)}
          className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-sale-soft hover:text-sale"
        >
          <Trash2 className="h-4 w-4" strokeWidth={2} />
        </Button>
      </div>
    </div>
  );
};

// Trình soạn danh sách sản phẩm flash: một dòng = một flash_sale_item (theo product_id).
// Validation đến từ validateFlashSale — errors là mảng song song với items.
const FlashSaleItemsEditor = ({ items = [], errors = [], onChangeItems }) => {
  const [pickingIndex, setPickingIndex] = useState(null);

  const patchItem = (index, patch) =>
    onChangeItems(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));

  const addItem = () =>
    onChangeItems([...items, { ...emptyFlashItem(), ...FLASH_ITEM_DEFAULTS }]);

  const removeItem = (index) =>
    onChangeItems(items.filter((_, i) => i !== index));

  // Giá Flash gợi ý = giảm 10% so với niêm yết, làm tròn xuống theo bước 1.000đ
  // (flash_price là DECIMAL(15,0), không nhận số thập phân).
  const pickProduct = (product) => {
    if (pickingIndex === null) return;
    const list = Number(product.price) || 0;
    const suggested = Math.max(
      FLASH_PRICE_STEP,
      Math.floor((list * 0.9) / FLASH_PRICE_STEP) * FLASH_PRICE_STEP,
    );
    patchItem(pickingIndex, {
      product_id: product.id,
      name: product.name,
      image_url: product.image_url ?? "",
      list_price: list,
      flash_price: list > 0 ? suggested : "",
    });
    setPickingIndex(null);
  };

  const selectedIds = items
    .filter((_, i) => i !== pickingIndex)
    .map((item) => item.product_id)
    .filter(Boolean);

  return (
    <FormSection
      title="Danh sách sản phẩm Flash"
      hint="Mỗi dòng một sản phẩm: giá Flash phải thấp hơn giá niêm yết, số suất không nhỏ hơn số đã bán."
      icon={Boxes}
      actions={
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addItem}
          className="h-8 gap-1.5 rounded-lg text-[12px] text-navy-700 hover:bg-navy-50 dark:text-navy-100"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={2} />
          Thêm sản phẩm
        </Button>
      }
      bodyClassName="space-y-2 p-3"
    >
      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <div
          className={cn(
            "hidden gap-2 bg-navy-50/60 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.02em] text-navy-700 md:grid dark:bg-navy-500/10 dark:text-navy-100",
            GRID,
          )}
        >
          <span>Sản phẩm</span>
          <span>Giá Flash (đ)</span>
          <span>Số suất</span>
          <span>Hạn mức/khách</span>
          <span className="text-center">Đã bán</span>
          <span />
        </div>

        {items.length === 0 ? (
          <p className="px-3 py-8 text-center text-[13px] text-muted-foreground">
            Chưa có sản phẩm nào — bấm "Thêm sản phẩm" để dựng danh sách ưu đãi.
          </p>
        ) : (
          items.map((item, index) => (
            <ItemRow
              key={`${item.product_id || "new"}-${index}`}
              item={item}
              index={index}
              error={errors[index] ?? {}}
              onChange={patchItem}
              onRemove={removeItem}
              onPick={setPickingIndex}
            />
          ))
        )}
      </div>

      <FlashSaleProductPicker
        open={pickingIndex !== null}
        selectedIds={selectedIds}
        onPick={pickProduct}
        onClose={() => setPickingIndex(null)}
      />
    </FormSection>
  );
};

export default FlashSaleItemsEditor;
