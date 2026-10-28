import { TAXONOMY_MAX } from "../constants/taxonomyForm";
import { SLUG_PATTERN, slugify } from "./slugify";

/**
 * Validate phần trùng nhau giữa danh mục và thương hiệu: name NOT NULL UNIQUE,
 * slug NOT NULL UNIQUE (backend không tự sinh), country STRING(100).
 * Field riêng (parent_id, sort_order) do từng trang kiểm.
 */
export const validateTaxonomy = (form, { nameLabel = "Tên" } = {}) => {
  const errors = {};
  const name = (form.name || "").trim();
  const slug = ((form.slug || "").trim() || slugify(name)).toLowerCase();

  if (!name) errors.name = `${nameLabel} là bắt buộc.`;
  else if (name.length > TAXONOMY_MAX.name)
    errors.name = `Tối đa ${TAXONOMY_MAX.name} ký tự.`;

  if (!slug) errors.slug = "Đường dẫn không tự sinh được — hãy nhập tay.";
  else if (slug.length > TAXONOMY_MAX.slug)
    errors.slug = `Tối đa ${TAXONOMY_MAX.slug} ký tự.`;
  else if (!SLUG_PATTERN.test(slug))
    errors.slug = "Chỉ dùng chữ thường, số và dấu gạch nối.";

  if ((form.country || "").length > TAXONOMY_MAX.country)
    errors.country = `Tối đa ${TAXONOMY_MAX.country} ký tự.`;

  return errors;
};

// is_active là BOOLEAN nhưng select/FormData chỉ mang chuỗi
export const resolveSlug = (form) =>
  ((form.slug || "").trim() || slugify(form.name || "")).toLowerCase();

/**
 * FormData chung cho brand (fileField=logo, extras={country}) và category
 * (fileField=image, extras={parent_id, sort_order}). Gửi đủ field kể cả rỗng
 * để xóa giá trị trong DB có tác dụng. is_active KHÔNG nằm ở đây — đổi trạng
 * thái qua endpoint toggle-status riêng.
 */
export const buildTaxonomyPayload = (form, { file, fileField, extras = {} }) => {
  const fd = new FormData();
  fd.append("name", (form.name || "").trim());
  fd.append("slug", resolveSlug(form));
  fd.append("description", form.description || "");
  Object.entries(extras).forEach(([key, value]) => fd.append(key, value ?? ""));
  if (file) fd.append(fileField, file);
  return fd;
};

// Cây danh mục → danh sách phẳng {id, name, level, node} cho select "danh mục cha"
export const flattenTree = (nodes = [], level = 0, out = []) => {
  nodes.forEach((node) => {
    out.push({ id: node.id, name: node.name, level, node });
    if (node.children?.length) flattenTree(node.children, level + 1, out);
  });
  return out;
};
