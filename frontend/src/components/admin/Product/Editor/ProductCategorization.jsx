import { Check, Tag } from "lucide-react";
import { Badge } from "../../../ui/badge";
import FormField from "../../Common/FormField";
import FormSelect from "../../Common/FormSelect";
import FormSection from "../../Common/FormSection";
import { PRODUCT_STATUS_OPTIONS } from "../../../../constants/productForm";
import { cn } from "@/lib/utils";

// products.brand_id (NOT NULL) · products.status ENUM · products_categories (N-N)
const ProductCategorization = ({
  form,
  setField,
  errors,
  brands,
  categories,
}) => {
  const toggleCategory = (catId) =>
    setField(
      "category_ids",
      form.category_ids.includes(catId)
        ? form.category_ids.filter((id) => id !== catId)
        : [...form.category_ids, catId],
    );

  return (
    <FormSection
      title="Phân loại & Hiển thị"
      hint="Thương hiệu bắt buộc; danh mục chọn được nhiều"
      icon={Tag}
      actions={
        form.category_ids.length > 0 ? (
          <Badge variant="brand" className="shrink-0">
            {form.category_ids.length} danh mục
          </Badge>
        ) : null
      }
    >
      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Thương hiệu"
          htmlFor="field-brand"
          required
          error={errors.brand_id}
        >
          <FormSelect
            id="field-brand"
            value={form.brand_id}
            onChange={(value) => setField("brand_id", value)}
            options={brands.map((brand) => ({
              value: String(brand.id),
              label: brand.name,
            }))}
            placeholder="— Chọn thương hiệu —"
            invalid={!!errors.brand_id}
          />
        </FormField>

        <FormField label="Trạng thái" htmlFor="field-status">
          <FormSelect
            id="field-status"
            value={form.status}
            onChange={(value) => setField("status", value)}
            options={PRODUCT_STATUS_OPTIONS}
          />
        </FormField>
      </div>

      <FormField label="Danh mục">
        {categories.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border px-4 py-5 text-center text-[13px] text-muted-foreground">
            Chưa có danh mục nào — tạo trong mục Danh mục.
          </p>
        ) : (
          <div className="max-h-52 space-y-0.5 overflow-y-auto rounded-lg border border-border bg-navy-50/50 p-1.5 dark:bg-navy-500/8">
            {categories.map((cat) => {
              const selected = form.category_ids.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  style={{ paddingLeft: `${6 + cat.level * 14}px` }}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md py-1.5 pr-2 text-left text-[13px] font-medium transition-colors",
                    selected
                      ? "bg-navy-600 text-white"
                      : "text-navy-700 hover:bg-navy-100/80 dark:text-navy-100 dark:hover:bg-navy-500/20",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                      selected
                        ? "border-white/60 bg-white/25"
                        : "border-border bg-card",
                    )}
                  >
                    {selected && <Check className="h-3 w-3" strokeWidth={3} />}
                  </span>
                  <span className="truncate">{cat.name}</span>
                </button>
              );
            })}
          </div>
        )}
      </FormField>
    </FormSection>
  );
};

export default ProductCategorization;
