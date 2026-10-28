const CLOUDINARY_MARKER = "/image/upload/";
// Ảnh banner hiện có trong DB được upload ở mức 1000px; xin Cloudinary trả bản lớn hơn
// (từ file gốc nếu còn) và làm nét nhẹ để đỡ mờ khi phóng lên khung hero.
// Ảnh mới upload qua bannerUpload đã là 2400px nên chỉ bị thu về 1920px.
const BANNER_TRANSFORM = "w_1920,e_sharpen:60,q_auto:good,f_auto";

const hasTransformation = (segment) =>
  /(?:^|,)(?:w_|h_|c_|q_|f_|e_|dpr_|ar_|g_|t_)/.test(segment);

/**
 * Thêm transformation hiển thị cho URL Cloudinary. URL khác (asset nội bộ, domain ngoài)
 * giữ nguyên. Nếu URL đã có transformation thì thay bằng cấu hình banner hiện tại.
 */
export const bannerImageUrl = (url) => {
  if (!url || !url.includes("res.cloudinary.com") || !url.includes(CLOUDINARY_MARKER)) {
    return url;
  }

  const [base, rest] = url.split(CLOUDINARY_MARKER);
  const segments = rest.split("/");
  let firstPathIndex = 0;
  while (firstPathIndex < segments.length && hasTransformation(segments[firstPathIndex])) {
    firstPathIndex += 1;
  }
  const publicPath = segments.slice(firstPathIndex).join("/");

  return `${base}${CLOUDINARY_MARKER}${BANNER_TRANSFORM}/${publicPath}`;
};

export default bannerImageUrl;
