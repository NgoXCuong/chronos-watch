import { BadgePercent, Coins } from "lucide-react";
import { Input } from "../../../ui/input";
import { Badge } from "../../../ui/badge";
import FormField from "../../Common/FormField";
import FormSection from "../../Common/FormSection";
import { formatCurrency } from "../../../../utils/formatCurrency";
import {
  LOW_STOCK_ALERT,
  WARRANTY_PRESETS,
} from "../../../../constants/productForm";
import { cn } from "@/lib/utils";

// products.price / old_price DECIMAL(15,0), stock INTEGER, warranty_months INTEGER
const ProductPricing = ({ form, setField, errors }) => {
  const price = Number(form.price) || 0;
  const oldPrice = Number(form.old_price) || 0;
  const discount =
    oldPrice > price && price > 0
      ? Math.round((1 - price / oldPrice) * 100)
      : 0;
  const stock = Number(form.stock);
  const lowStock =
    form.stock !== "" && Number.isFinite(stock) && stock <= LOW_STOCK_ALERT;

  return (
    <FormSection
      title="Giá & Tồn kho"
      hint="Giá trị tuyệt đối (VND), không cần dấu phân cách"
      icon={Coins}
      actions={
        discount > 0 ? (
          <Badge variant="sale" className="shrink-0 tabular-nums">
            -{discount}%
          </Badge>
        ) : null
      }
    >
      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Giá bán"
          htmlFor="field-price"
          required
          error={errors.price}
        >
          <Input
            id="field-price"
            type="number"
            min="0"
            step="1000"
            value={form.price}
            onChange={(e) => setField("price", e.target.value)}
            placeholder="0"
            className="h-11 font-bold tabular-nums text-navy-700 dark:text-navy-100"
            error={errors.price}
          />
        </FormField>

        <FormField
          label="Giá gốc (nếu giảm)"
          htmlFor="field-old-price"
          error={errors.old_price}
        >
          <Input
            id="field-old-price"
            type="number"
            min="0"
            step="1000"
            value={form.old_price}
            onChange={(e) => setField("old_price", e.target.value)}
            placeholder="0"
            className="h-11 tabular-nums text-muted-foreground"
            error={errors.old_price}
          />
        </FormField>
      </div>

      <FormField label="Tồn kho" htmlFor="field-stock" error={errors.stock}>
        <div className="flex items-center gap-2">
          <Input
            id="field-stock"
            type="number"
            min="0"
            step="1"
            value={form.stock}
            onChange={(e) => setField("stock", e.target.value)}
            placeholder="0"
            className="h-11 tabular-nums"
            error={errors.stock}
          />
          {lowStock && (
            <Badge variant="warning" className="shrink-0 whitespace-nowrap">
              Sắp hết hàng
            </Badge>
          )}
        </div>
      </FormField>

      <FormField
        label="Bảo hành"
        htmlFor="field-warranty"
        error={errors.warranty_months}
      >
        <div className="flex flex-wrap items-center gap-1.5">
          {WARRANTY_PRESETS.map((months) => {
            const active = String(form.warranty_months) === String(months);
            return (
              <button
                key={months}
                type="button"
                onClick={() =>
                  setField("warranty_months", active ? "" : String(months))
                }
                className={cn(
                  "h-8 rounded-lg border px-2.5 text-xs font-bold tabular-nums transition-colors",
                  active
                    ? "border-navy-600 bg-navy-600 text-white"
                    : "border-border bg-card text-navy-700 hover:border-navy-300 dark:text-navy-100",
                )}
              >
                {months}T
              </button>
            );
          })}
          <Input
            id="field-warranty"
            type="number"
            min="0"
            max="120"
            step="1"
            value={form.warranty_months}
            onChange={(e) => setField("warranty_months", e.target.value)}
            placeholder="Khác"
            className="h-8 w-[92px] rounded-lg text-xs tabular-nums"
            error={errors.warranty_months}
          />
        </div>
      </FormField>
    </FormSection>
  );
};

export default ProductPricing;
