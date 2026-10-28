import { Layers, ListChecks, Plus, X } from "lucide-react";
import { Input } from "../../../ui/input";
import { Button } from "../../../ui/button";
import FormSelect from "../../Common/FormSelect";
import FormSection from "../../Common/FormSection";
import { SPEC_KEYS } from "../../../../utils/specKeys";
import { SPEC_CUSTOM } from "../../../../constants/productForm";

// products.specifications là JSON {key: value}. Key chuẩn (SPEC_KEYS) giúp bộ lọc
// trang khách dùng được; key tự đặt vẫn lưu nhưng chỉ hiển thị dạng danh sách.
const isCanonical = (key) => SPEC_KEYS.some((spec) => spec.key === key);

// `Input` bọc <input> trong một div `w-full` riêng, nên class `flex-1` truyền vào
// chỉ xuống thẻ input con mà không tới flex item thật -> ô bị ép về 0.
// Dòng thông số vì thế dùng grid: mỗi ô là một track, không phụ thuộc basis của con.
const ROW_GRID = "grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] items-center gap-2";
const ICON_BTN = "h-11 w-9 shrink-0 rounded-lg border border-border bg-card";

const ProductSpecifications = ({ form, setForm, errors }) => {
  const rows = form.specifications;

  const patchRow = (index, patch) =>
    setForm((f) => ({
      ...f,
      specifications: f.specifications.map((row, i) =>
        i === index ? { ...row, ...patch } : row,
      ),
    }));

  const addRow = () =>
    setForm((f) => ({
      ...f,
      specifications: [...f.specifications, { key: "", value: "" }],
    }));

  const removeRow = (index) =>
    setForm((f) => ({
      ...f,
      specifications: f.specifications.filter((_, i) => i !== index),
    }));

  // Key của chính dòng này phải còn trong danh sách chọn, nếu không trigger
  // không tra được label và hiện placeholder thay vì tên thông số đang có.
  const optionsFor = (index) => {
    const takenByOthers = new Set(
      rows.filter((_, i) => i !== index).map((row) => row.key),
    );
    return [
      ...SPEC_KEYS.filter((spec) => !takenByOthers.has(spec.key)).map((spec) => ({
        value: spec.key,
        label: spec.label,
      })),
      { value: SPEC_CUSTOM, label: "Tự đặt tên khác..." },
    ];
  };

  return (
    <FormSection
      title="Thông số kỹ thuật"
      hint="Bộ key chuẩn để trang khách lọc được theo máy, kính, chống nước..."
      icon={Layers}
      actions={
        <Button
          type="button"
          variant="buy"
          size="sm"
          onClick={addRow}
          className="gap-1.5 px-3"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
          Thêm thông số
        </Button>
      }
    >
      {rows.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border bg-navy-50/50 px-4 py-6 text-center text-[13px] text-muted-foreground dark:bg-navy-500/8">
          Chưa có thông số nào. Người mua sẽ chỉ thấy mô tả.
        </p>
      ) : (
        <div className="space-y-2.5">
          <div className={`${ROW_GRID} px-1`}>
            {["Thông số", ""].map((label, i) => (
              <p
                key={i}
                className="text-[12px] font-bold uppercase tracking-[0.02em] text-navy-700 dark:text-navy-100"
              >
                {label}
              </p>
            ))}
            <span />
          </div>

          {rows.map((row, index) => {
            const custom = row.isCustom || (row.key && !isCanonical(row.key));

            return (
              <div key={index} className={ROW_GRID}>
                {custom ? (
                  <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-1">
                    <Input
                      value={row.key}
                      onChange={(e) => patchRow(index, { key: e.target.value })}
                      placeholder="VD: Khả năng sạc"
                      className="h-11"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      title="Chọn lại từ danh sách chuẩn"
                      aria-label="Chọn lại từ danh sách chuẩn"
                      onClick={() => patchRow(index, { key: "", isCustom: false })}
                      className={`${ICON_BTN} hover:border-navy-300 hover:bg-navy-50 hover:text-navy-600 dark:hover:bg-navy-500/15`}
                    >
                      <ListChecks className="h-4 w-4" strokeWidth={2} />
                    </Button>
                  </div>
                ) : (
                  <FormSelect
                    value={row.key}
                    options={optionsFor(index)}
                    placeholder="— Chọn thông số —"
                    onChange={(value) =>
                      patchRow(
                        index,
                        value === SPEC_CUSTOM
                          ? { key: "", isCustom: true }
                          : { key: value, isCustom: false },
                      )
                    }
                  />
                )}

                <Input
                  value={row.value}
                  onChange={(e) => patchRow(index, { value: e.target.value })}
                  placeholder="Giá trị, VD: Automatic (Japan Movt)"
                  error={!!errors.specifications}
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Xóa thông số"
                  title="Xóa thông số"
                  onClick={() => removeRow(index)}
                  className={`${ICON_BTN} hover:border-sale hover:bg-sale-soft hover:text-sale dark:hover:bg-sale/15`}
                >
                  <X className="h-4 w-4" strokeWidth={2} />
                </Button>
              </div>
            );
          })}
        </div>
      )}

      {errors.specifications && (
        <p className="text-[11px] font-semibold text-sale">{errors.specifications}</p>
      )}
    </FormSection>
  );
};

export default ProductSpecifications;
