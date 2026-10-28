// Giới hạn upload ảnh — khớp `limits.fileSize` của multer
// (backend/src/middlewares/upload.middleware.js). Dùng cho mọi form có ảnh:
// sản phẩm, danh mục, thương hiệu, banner.
export const IMAGE_MAX_MB = 5;

export const IMAGE_ACCEPT = "image/*";
