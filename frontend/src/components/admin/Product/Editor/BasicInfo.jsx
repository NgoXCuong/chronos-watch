import { Fingerprint } from "lucide-react";
import { Input } from "../../../ui/input";
import FormField from "../../Common/FormField";
import FormSection from "../../Common/FormSection";
import { FIELD_MAX } from "../../../../constants/productForm";

// products.name / slug / sku — ba cột định danh, slug và sku đều UNIQUE
const BasicInfo = ({ form, setField, setSlug, errors, slugTouched }) => (
  <FormSection
    title="Nhận diện sản phẩm"
    hint="Tên hiển thị, đường dẫn URL và mã kho"
    icon={Fingerprint}
    actions={
      <span className="shrink-0 text-[11px] font-semibold tabular-nums text-muted-foreground">
        {form.name.length}/{FIELD_MAX.name}
      </span>
    }
  >
    <FormField label="Tên sản phẩm" htmlFor="field-name" required error={errors.name}>
      <Input
        id="field-name"
        value={form.name}
        maxLength={FIELD_MAX.name}
        onChange={(e) => setField("name", e.target.value)}
        placeholder="VD: Casio MTP-137PD - Đồng hồ kim nam công sở"
        error={errors.name}
      />
    </FormField>

    <div className="grid gap-4 sm:grid-cols-2">
      <FormField
        label="Đường dẫn (slug)"
        htmlFor="field-slug"
        hint={
          slugTouched
            ? "Đang dùng slug nhập tay."
            : "Tự sinh từ tên — nhập tay nếu muốn đặt URL riêng."
        }
        error={errors.slug}
      >
        <Input
          id="field-slug"
          value={form.slug}
          maxLength={FIELD_MAX.slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="vd: casio-mtp-137pd"
          className="font-mono text-[13px]"
          error={errors.slug}
        />
      </FormField>

      <FormField
        label="Mã sản phẩm (SKU)"
        htmlFor="field-sku"
        hint="Để trống nếu chưa cấp mã — dùng để tìm kiếm trong kho."
        error={errors.sku}
      >
        <Input
          id="field-sku"
          value={form.sku}
          maxLength={FIELD_MAX.sku}
          onChange={(e) => setField("sku", e.target.value.toUpperCase())}
          placeholder="VD: CAS-MTP-137PD-7B2UF"
          className="font-mono text-[13px] uppercase"
          error={errors.sku}
        />
      </FormField>
    </div>
  </FormSection>
);

export default BasicInfo;
