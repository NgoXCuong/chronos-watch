import { useMemo, useState } from "react";
import { FolderTree, Save } from "lucide-react";
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
import FormSelect from "../Common/FormSelect";
import ImagePickerField from "../Common/ImagePickerField";
import useImagePicker from "../../../hooks/useImagePicker";
import useSlugField from "../../../hooks/useSlugField";
import { TAXONOMY_MAX } from "../../../constants/taxonomyForm";
import { IMAGE_MAX_MB } from "../../../constants/upload";
import {
  buildTaxonomyPayload,
  flattenTree,
  validateTaxonomy,
} from "../../../utils/taxonomyForm";
import { collectSelfAndDescendantIds } from "../../../utils/categoryTree";

// categories: name(100) UNIQUE · slug(100) UNIQUE · description TEXT · image_url
// · parent_id (FK tự tham chiếu, NULL = gốc) · sort_order INT · is_active (toggle riêng)
const ROOT_VALUE = "0"; // DropdownMenu không nhận value rỗng

const EMPTY_FORM = { name: "", slug: "", description: "", parent_id: ROOT_VALUE, sort_order: 0 };

const formOf = (category, parentId) =>
  category
    ? {
        name: category.name || "",
        slug: category.slug || "",
        description: category.description || "",
        parent_id: String(category.parent_id ?? ROOT_VALUE),
        sort_order: category.sort_order ?? 0,
      }
    : { ...EMPTY_FORM, parent_id: String(parentId ?? ROOT_VALUE) };

const validateSortOrder = (value) => {
  if (value === "" || value === null || value === undefined) return "";
  const n = Number(value);
  if (!Number.isInteger(n)) return "Thứ tự phải là số nguyên.";
  if (n < 0 || n > 999999) return "Thứ tự từ 0 đến 999999.";
  return "";
};

// Tách thân form ra component riêng: Dialog unmount khi đóng nên state seeding từ props
// là đủ — không cần effect reset lại mỗi lần mở (tránh cascading render).
const CategoryFormBody = ({ category, parentId, tree, saving, onSubmit, onClose }) => {
  const [form, setForm] = useState(() => formOf(category, parentId));
  const [errors, setErrors] = useState({});
  const { setName, setSlug, slugTouched } = useSlugField(setForm);
  const cover = useImagePicker(category?.image_url);
  const {
    file: coverFile,
    preview: coverPreview,
    isNew: coverIsNew,
    open: openCover,
    clear: clearCover,
    pick: pickCover,
    inputRef: coverInputRef,
  } = cover;

  // Không cho chọn chính mình hoặc con/cháu của mình làm cha (tạo vòng lặp)
  const parentOptions = useMemo(() => {
    const blocked = category ? collectSelfAndDescendantIds(category) : [];
    const children = flattenTree(tree)
      .filter((entry) => !blocked.includes(Number(entry.id)))
      .map((entry) => ({
        value: String(entry.id),
        label: entry.level === 0 ? entry.name : `${"› ".repeat(entry.level)}${entry.name}`,
      }));
    return [{ value: ROOT_VALUE, label: "— Danh mục gốc —" }, ...children];
  }, [tree, category]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validateTaxonomy(form, { nameLabel: "Tên danh mục" });
    const sortError = validateSortOrder(form.sort_order);
    if (sortError) nextErrors.sort_order = sortError;
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onSubmit(
      buildTaxonomyPayload(form, {
        file: coverFile,
        fileField: "image",
        extras: {
          parent_id: form.parent_id === ROOT_VALUE ? "" : form.parent_id,
          sort_order: form.sort_order === "" ? 0 : Number(form.sort_order),
        },
      }),
    );
  };

  return (
    <>
      <DialogHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <DialogTitle className="flex items-center gap-2">
              <FolderTree className="h-4 w-4 text-navy-600 dark:text-navy-200" strokeWidth={2} />
              {category ? "Cập nhật danh mục" : "Thêm danh mục mới"}
            </DialogTitle>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Tên và đường dẫn phải duy nhất; slug tự sinh từ tên nếu để trống.
            </p>
          </div>
          <DialogCloseButton onClick={onClose} />
        </div>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="max-h-[65vh] space-y-4 overflow-y-auto p-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Tên danh mục" htmlFor="category-name" required error={errors.name}>
            <Input
              id="category-name"
              value={form.name}
              maxLength={TAXONOMY_MAX.name}
              onChange={(event) => setName(event.target.value)}
              placeholder="VD: Đồng hồ nam"
              error={errors.name}
            />
          </FormField>

          <FormField
            label="Đường dẫn (slug)"
            htmlFor="category-slug"
            hint={slugTouched ? "Đang dùng slug nhập tay." : "Tự sinh từ tên."}
            error={errors.slug}
          >
            <Input
              id="category-slug"
              value={form.slug}
              maxLength={TAXONOMY_MAX.slug}
              onChange={(event) => setSlug(event.target.value)}
              placeholder="vd: dong-ho-nam"
              className="font-mono text-[13px]"
              error={errors.slug}
            />
          </FormField>

          <FormField
            label="Danh mục cha"
            htmlFor="category-parent"
            hint="Chọn “— Danh mục gốc —” nếu không có cha."
          >
            <FormSelect
              id="category-parent"
              value={form.parent_id}
              onChange={(next) => setForm((prev) => ({ ...prev, parent_id: next }))}
              options={parentOptions}
              placeholder="— Danh mục gốc —"
            />
          </FormField>

          <FormField
            label="Thứ tự hiển thị"
            htmlFor="category-sort"
            hint="Số nhỏ hơn hiển thị trước."
            error={errors.sort_order}
          >
            <Input
              id="category-sort"
              type="number"
              min={0}
              step={1}
              value={form.sort_order}
              onChange={(event) => setForm((prev) => ({ ...prev, sort_order: event.target.value }))}
              placeholder="0"
              className="tabular-nums"
              error={errors.sort_order}
            />
          </FormField>

          <ImagePickerField
            className="sm:col-span-2"
            label="Hình đại diện"
            alt="Ảnh danh mục"
            hint={`jpg/png/webp, tối đa ${IMAGE_MAX_MB}MB · 800×500. Ảnh đã lưu chỉ thay được bằng ảnh mới.`}
            preview={coverPreview}
            isNew={coverIsNew}
            onOpen={openCover}
            onClear={clearCover}
            onSelect={pickCover}
            inputRef={coverInputRef}
          />
        </div>

        <FormField
          label="Mô tả"
          htmlFor="category-description"
          hint="Hiển thị ở đầu trang danh mục phía khách."
        >
          <Textarea
            id="category-description"
            rows={4}
            value={form.description}
            onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
            placeholder="VD: Đồng hồ nam với bộ máy cơ, pin và nhiều phong cách..."
          />
        </FormField>

        <DialogFooter className="border-t-0 px-0 pb-0 pt-1">
          <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
            Hủy
          </Button>
          <Button type="submit" loading={saving} className="min-w-[132px] gap-1.5">
            {!saving && <Save className="h-4 w-4" strokeWidth={2} />}
            {category ? "Lưu thay đổi" : "Tạo danh mục"}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
};

const CategoryFormModal = ({
  open,
  category,
  parentId,
  tree = [],
  saving = false,
  onSubmit,
  onClose,
}) => {
  if (!open) return null;

  return (
    <Dialog open onOpenChange={(next) => !next && onClose?.()}>
      <DialogContent className="max-w-xl">
        <CategoryFormBody
          key={`${category?.id ?? "new"}-${parentId ?? "root"}`}
          category={category}
          parentId={parentId}
          tree={tree}
          saving={saving}
          onSubmit={onSubmit}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CategoryFormModal;
