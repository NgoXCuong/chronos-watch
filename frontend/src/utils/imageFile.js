import { IMAGE_MAX_MB } from "../constants/upload";

// Kiểm tra ảnh ngay ở client trước khi gửi lên server (multer cùng giới hạn 5MB).
// Trả về chuỗi lỗi hoặc null nếu hợp lệ.
export const rejectImage = (file, maxMb = IMAGE_MAX_MB) => {
  if (!file) return "Chưa chọn file ảnh.";
  if (!file.type?.startsWith("image/")) return `${file.name} không phải ảnh.`;
  if (file.size > maxMb * 1024 * 1024)
    return `${file.name} vượt ${maxMb}MB (giới hạn upload của backend).`;
  return null;
};
