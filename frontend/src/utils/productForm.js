import { FIELD_MAX } from "../constants/productForm";
import { SLUG_PATTERN, slugify } from "./slugify";

// products.specifications là JSON {key: value}; form giữ dạng mảng để thêm/xóa dòng
export const specsToObj = (rows = []) =>
  rows.reduce((acc, { key, value }) => {
    if (key.trim()) acc[key.trim()] = value;
    return acc;
  }, {});

export const objToSpecs = (obj) =>
  Object.entries(obj || {}).map(([key, value]) => ({ key, value }));

// products.image_gallery là JSON — có thể nhận về chuỗi tùy driver
export const toGalleryArray = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value !== "string" || !value.trim()) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const EMPTY_FORM = {
  name: "",
  slug: "",
  sku: "",
  brand_id: "",
  price: "",
  old_price: "",
  stock: "",
  warranty_months: "",
  description: "",
  status: "active",
  specifications: [],
  category_ids: [],
};

// Số từ CSDL (DECIMAL trả về chuỗi) → giá trị string cho input
// DECIMAL trả về chuỗi ("3500000.00") — đưa về số nguyên dương dạng chuỗi cho input
const toNumStr = (value) => {
  if (value === null || value === undefined || value === "") return "";
  const num = Number(value);
  return Number.isNaN(num) ? "" : String(num);
};

const toPositiveNumStr = (value) => {
  const str = toNumStr(value);
  return str && Number(str) > 0 ? str : "";
};

export const toFormShape = (product) => ({
  ...EMPTY_FORM,
  name: product.name || "",
  slug: product.slug || "",
  sku: product.sku || "",
  brand_id: product.brand_id ? String(product.brand_id) : "",
  price: toNumStr(product.price),
  old_price: toPositiveNumStr(product.old_price),
  stock: toNumStr(product.stock),
  warranty_months: toNumStr(product.warranty_months),
  description: product.description || "",
  status: product.status || "active",
  specifications: objToSpecs(product.specifications),
  category_ids: (product.categories || []).map((cat) => cat.id),
});

const isInt = (value) => Number.isInteger(Number(value)) && Number(value) >= 0;

// Ràng buộc client = ràng buộc CSDL; phần còn lại (unique slug/sku) do backend trả lỗi
export const validateForm = (form) => {
  const errors = {};
  const name = form.name.trim();
  const slug = (form.slug.trim() || slugify(name)).toLowerCase();

  if (!name) errors.name = "Tên sản phẩm là bắt buộc.";
  else if (name.length > FIELD_MAX.name)
    errors.name = `Tên tối đa ${FIELD_MAX.name} ký tự.`;

  if (!slug) errors.slug = "Đường dẫn không thể tự sinh, hãy nhập tay.";
  else if (!SLUG_PATTERN.test(slug))
    errors.slug = "Chỉ dùng chữ thường, số và dấu gạch nối.";

  if (form.sku.trim().length > FIELD_MAX.sku)
    errors.sku = `SKU tối đa ${FIELD_MAX.sku} ký tự.`;

  if (!form.brand_id) errors.brand_id = "Thương hiệu là bắt buộc (brand_id NOT NULL).";

  const price = Number(form.price);
  if (form.price === "" || Number.isNaN(price)) errors.price = "Giá bán là bắt buộc.";
  else if (price <= 0) errors.price = "Giá bán phải lớn hơn 0.";

  if (form.old_price !== "") {
    const old = Number(form.old_price);
    if (Number.isNaN(old) || old < 0) errors.old_price = "Giá gốc không hợp lệ.";
    else if (price > 0 && old <= price)
      errors.old_price = "Giá gốc phải lớn hơn giá bán mới hiện được giảm giá.";
  }

  if (form.stock !== "" && !isInt(form.stock))
    errors.stock = "Tồn kho phải là số nguyên từ 0.";

  if (form.warranty_months !== "") {
    const months = Number(form.warranty_months);
    if (!isInt(form.warranty_months) || months > FIELD_MAX.warranty)
      errors.warranty_months = `Bảo hành từ 0 đến ${FIELD_MAX.warranty} tháng.`;
  }

  const seen = new Set();
  const badRow = form.specifications.findIndex((row) => {
    const key = row.key.trim();
    if (!key) return !!row.value.trim();
    if (!row.value.trim()) return true;
    if (seen.has(key)) return true;
    seen.add(key);
    return false;
  });
  if (badRow >= 0) {
    const row = form.specifications[badRow];
    errors.specifications = row.key.trim()
      ? `Thông số "${row.key.trim()}" bị trùng hoặc thiếu giá trị.`
      : "Dòng thông số trống — điền tên hoặc xóa dòng này.";
  }

  return errors;
};

// Gửi ĐỦ mọi cột (kể cả giá trị rỗng) để xóa field trong DB có tác dụng:
// - sku / warranty_months: "" → controller chuyển thành NULL
// - old_price / stock: rỗng nghĩa là "không giảm giá / chưa nhập" → 0 theo NUMERIC NOT NULL
export const buildPayload = (form, images = {}) => {
  const fd = new FormData();
  const slug = (form.slug.trim() || slugify(form.name)).toLowerCase();

  fd.append("name", form.name.trim());
  fd.append("slug", slug);
  fd.append("sku", form.sku.trim());
  fd.append("brand_id", String(form.brand_id));
  fd.append("price", String(form.price).trim());
  fd.append("old_price", String(form.old_price).trim() || "0");
  fd.append("stock", String(form.stock).trim() || "0");
  fd.append("warranty_months", String(form.warranty_months).trim());
  fd.append("description", form.description || "");
  fd.append("status", form.status || "active");

  fd.append("specifications", JSON.stringify(specsToObj(form.specifications)));
  fd.append("category_ids", JSON.stringify(form.category_ids));

  if (images.existingGallery)
    fd.append("existing_gallery", JSON.stringify(images.existingGallery));
  if (images.imageFile) fd.append("image", images.imageFile);
  (images.newGalleryFiles || []).forEach((file) => fd.append("gallery", file));

  return fd;
};

// Các endpoint danh mục/brand trả {count, rows} hoặc mảng thẳng — chuẩn hóa về mảng
export const toRows = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.rows)) return payload.rows;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

// Cây danh mục → danh sách phẳng kèm level để thụt lề trong form
export const flattenCategories = (list = [], level = 0, out = []) => {
  list.forEach((cat) => {
    out.push({ id: cat.id, name: cat.name, level });
    if (cat.children?.length) flattenCategories(cat.children, level + 1, out);
  });
  return out;
};
