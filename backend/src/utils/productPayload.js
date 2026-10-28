import AppError from "./AppError.js";

// Admin gửi sản phẩm qua FormData (vì có ảnh), nên mọi field đều đến tay server dạng
// chuỗi và JSON phải parse ở tầng controller. Gom lại một chỗ để controller mỏng và
// create/update dùng đúng một quy tắc chuyển đổi.

const toTrimmedOrNull = (value) => {
    if (value === undefined) return undefined;
    const text = String(value ?? "").trim();
    return text === "" ? null : text;
};

const toIntOrNull = (value) => {
    if (value === undefined) return undefined;
    const text = String(value).trim();
    return text === "" ? null : parseInt(text, 10);
};

const parseJsonField = (value, field, { arrayOnly = false } = {}) => {
    if (typeof value !== "string" || value.trim() === "") return value;
    let parsed;
    try {
        parsed = JSON.parse(value);
    } catch {
        throw new AppError(
            400,
            arrayOnly
                ? `Định dạng ${field} không hợp lệ. Phải là một mảng JSON (vd: [1, 2])`
                : `Định dạng ${field} không hợp lệ. Phải là JSON (vd: {"key": "value"})`
        );
    }
    if (arrayOnly && !Array.isArray(parsed)) {
        throw new AppError(400, `Định dạng ${field} không hợp lệ. Phải là một mảng JSON.`);
    }
    return parsed;
};

const firstImagePath = (files, field) => files?.[field]?.[0]?.path;

const imagePaths = (files, field) => (files?.[field] || []).map((file) => file.path);

/** Dữ liệu tạo sản phẩm từ req (body + files). */
export const buildCreateData = (req) => {
    const data = { ...req.body };
    data.sku = toTrimmedOrNull(data.sku);
    data.warranty_months = toIntOrNull(data.warranty_months);
    const image = firstImagePath(req.files, "image");
    if (image) data.image_url = image;
    const gallery = imagePaths(req.files, "gallery");
    if (gallery.length) data.image_gallery = gallery;
    data.category_ids = parseJsonField(data.category_ids, "category_ids", { arrayOnly: true });
    data.specifications = parseJsonField(data.specifications, "specifications");
    return data;
};

/**
 * Dữ liệu cập nhật. Gallery là TRƯỜNG HỢP ĐẶC BIỆT: ảnh mới upload chỉ được GHÉP vào
 * ảnh cũ mà client còn giữ (existing_gallery), không thay thế — nếu không, sửa một field
 * bất kỳ sẽ xóa sạch bộ sưu tập ảnh.
 */
export const buildUpdateData = (req) => {
    const data = { ...req.body };
    data.sku = toTrimmedOrNull(data.sku);
    data.warranty_months = toIntOrNull(data.warranty_months);
    const image = firstImagePath(req.files, "image");
    if (image) data.image_url = image;

    const hasExisting = data.existing_gallery !== undefined;
    let existingGallery = hasExisting ? [] : null;
    if (hasExisting) {
        const parsed = parseJsonField(data.existing_gallery, "existing_gallery", { arrayOnly: true });
        existingGallery = Array.isArray(parsed) ? parsed : [];
    }
    const newImages = imagePaths(req.files, "gallery");
    if (existingGallery !== null || newImages.length > 0) {
        data.image_gallery = [...(existingGallery || []), ...newImages];
    }

    data.category_ids = parseJsonField(data.category_ids, "category_ids", { arrayOnly: true });
    data.specifications = parseJsonField(data.specifications, "specifications");
    return data;
};
