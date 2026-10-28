import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

const ALLOWED_FORMATS = ['jpg', 'png', 'jpeg', 'webp'];
const FILE_LIMITS = {
  fileSize: 5 * 1024 * 1024, // 5MB limit
  files: 10,                 // Max 10 files
};

// Cùng một cấu hình upload, chỉ khác transformation đầu ra.
const createUpload = (transformation) =>
  multer({
    storage: new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: 'chronos-watch',
        allowed_formats: ALLOWED_FORMATS,
        transformation,
      },
    }),
    limits: FILE_LIMITS,
  });

// Ảnh sản phẩm/logo/avatar: giữ mức 1000px để nhẹ và đủ dùng.
const upload = createUpload([{ width: 1000, height: 1000, crop: 'limit' }]);

// Banner hero hiển thị rộng ~1450px nên cần file gốc lớn hơn hẳn.
// 2400×1200 là tỷ lệ 2:1, đủ nét cho desktop lẫn màn hình retina;
// crop: 'limit' chỉ thu nhỏ ảnh lớn, không tự phóng ảnh nhỏ (tránh làm mờ thêm).
export const bannerUpload = createUpload([
  { width: 2400, height: 1200, crop: 'limit', quality: 'auto:good' },
]);

export default upload;
