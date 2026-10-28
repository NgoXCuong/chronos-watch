import { useState } from "react";
import { Building2, Save } from "lucide-react";
import {
  Dialog,
  DialogCloseButton,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Button } from "../../ui/button";
import FormField from "../Common/FormField";
import ImagePickerField from "../Common/ImagePickerField";
import useImagePicker from "../../../hooks/useImagePicker";
import useSlugField from "../../../hooks/useSlugField";
import { TAXONOMY_MAX } from "../../../constants/taxonomyForm";
import { IMAGE_MAX_MB } from "../../../constants/upload";
import { buildTaxonomyPayload, validateTaxonomy } from "../../../utils/taxonomyForm";

// brands: name(100) UNIQUE · slug(100) UNIQUE · country(100) · description TEXT · logo_url
const EMPTY_FORM = { name: "", slug: "", country: "", description: "" };

const formOf = (brand) =>
  brand
    ? {
        name: brand.name || "",
        slug: brand.slug || "",
        country: brand.country || "",
        description: brand.description || "",
      }
    : EMPTY_FORM;

// Component riêng để state seed từ props khi mở modal (Dialog unmount lúc đóng, không cần effect reset)
const BrandFormBody = ({ brand, saving, onSubmit, onClose }) => {
  const [form, setForm] = useState(() => formOf(brand));
  const [errors, setErrors] = useState({});
  const { setName, setSlug, slugTouched } = useSlugField(setForm);
  const logo = useImagePicker(brand?.logo_url);
  const {
    file: logoFile,
    preview: logoPreview,
    isNew: logoIsNew,
    open: openLogo,
    clear: clearLogo,
    pick: pickLogo,
    inputRef: logoInputRef,
  } = logo;

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validateTaxonomy(form, { nameLabel: "Tên thương hiệu" });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    onSubmit(
      buildTaxonomyPayload(form, {
        file: logoFile,
        fileField: "logo",
        extras: { country: form.country.trim() },
      }),
    );
  };

  return (
    <>
      <DialogHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-navy-600 dark:text-navy-200" strokeWidth={2} />
              {brand ? "Cập nhật thương hiệu" : "Thêm thương hiệu mới"}
            </DialogTitle>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Tên và đường dẫn phải duy nhất trong hệ thống
            </p>
          </div>
          <DialogCloseButton onClick={onClose} />
        </div>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="max-h-[65vh] space-y-4 overflow-y-auto p-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Tên thương hiệu" htmlFor="brand-name" required error={errors.name}>
            <Input
              id="brand-name"
              value={form.name}
              maxLength={TAXONOMY_MAX.name}
              onChange={(event) => setName(event.target.value)}
              placeholder="VD: Casio"
              error={errors.name}
            />
          </FormField>

          <FormField
            label="Đường dẫn (slug)"
            htmlFor="brand-slug"
            hint={slugTouched ? "Đang dùng slug nhập tay." : "Tự sinh từ tên."}
            error={errors.slug}
          >
            <Input
              id="brand-slug"
              value={form.slug}
              maxLength={TAXONOMY_MAX.slug}
              onChange={(event) => setSlug(event.target.value)}
              placeholder="vd: casio"
              className="font-mono text-[13px]"
              error={errors.slug}
            />
          </FormField>

          <FormField
            label="Quốc gia"
            htmlFor="brand-country"
            hint="Để trống nếu chưa rõ."
            error={errors.country}
          >
            <Input
              id="brand-country"
              value={form.country}
              maxLength={TAXONOMY_MAX.country}
              onChange={(event) => setForm((prev) => ({ ...prev, country: event.target.value }))}
              placeholder="VD: Nhật Bản"
              error={errors.country}
            />
          </FormField>

          <ImagePickerField
            label="Logo"
            alt="Logo thương hiệu"
            contain
            hint={`PNG trong suốt, ≤${IMAGE_MAX_MB}MB · 400×400`}
            preview={logoPreview}
            isNew={logoIsNew}
            onOpen={openLogo}
            onClear={clearLogo}
            onSelect={pickLogo}
            inputRef={logoInputRef}
          />
        </div>

        <FormField
          label="Mô tả"
          htmlFor="brand-description"
          hint="Hiển thị ở trang danh sách thương hiệu và khối giới thiệu."
        >
          <Textarea
            id="brand-description"
            rows={4}
            value={form.description}
            onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
            placeholder="VD: Casio thành lập năm 1946 tại Tokyo, nổi bật với G-Shock chống va đập..."
          />
        </FormField>

        <DialogFooter className="border-t-0 px-0 pb-0 pt-1">
          <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
            Hủy
          </Button>
          <Button type="submit" loading={saving} className="min-w-[132px] gap-1.5">
            {!saving && <Save className="h-4 w-4" strokeWidth={2} />}
            {brand ? "Lưu thay đổi" : "Tạo thương hiệu"}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
};

const BrandFormModal = ({ open, brand, saving = false, onSubmit, onClose }) => {
  if (!open) return null;

  return (
    <Dialog open onOpenChange={(next) => !next && onClose?.()}>
      <DialogContent className="max-w-xl">
        <BrandFormBody
          key={brand?.id ?? "new"}
          brand={brand}
          saving={saving}
          onSubmit={onSubmit}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default BrandFormModal;
