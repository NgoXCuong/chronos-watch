// Constants cho trang quản đánh giá — bám backend/src/models/review.model.js
// (user_id/product_id NOT NULL · rating INT 1..5 NOT NULL · comment TEXT ·
//  is_active BOOL · admin_reply TEXT · replied_at DATE)
// Giá trị filter khớp buildReviewWhere() trong backend/src/services/admin-review.service.js
export const REVIEW_STARS = [1, 2, 3, 4, 5];

export const REVIEW_VISIBILITY_FILTER_OPTIONS = [
  { value: "", label: "Mọi trạng thái kiểm duyệt" },
  { value: "true", label: "Đang hiển thị", dot: "bg-success" },
  { value: "false", label: "Đã ẩn", dot: "bg-muted-foreground" },
];

export const REVIEW_RATING_FILTER_OPTIONS = [
  { value: "", label: "Mọi mức sao" },
  { value: "5", label: "5 sao" },
  { value: "4", label: "4 sao" },
  { value: "3", label: "3 sao" },
  { value: "2", label: "2 sao" },
  { value: "1", label: "1 sao" },
];

export const REVIEW_REPLY_FILTER_OPTIONS = [
  { value: "", label: "Mọi phản hồi" },
  { value: "unreplied", label: "Chưa phản hồi", dot: "bg-info" },
  { value: "replied", label: "Đã trả lời", dot: "bg-success" },
];

// comment/admin_reply là TEXT trong DB — chặn ở 1000 ký tự để nội dung hiển thị gọn
export const REVIEW_REPLY_MAX = 1000;

// value = "<sortKey>:<dir>" — key nằm trong SORTABLE_REVIEW_COLUMNS của backend
export const REVIEW_SORT_OPTIONS = [
  { value: "created_at:desc", label: "Mới nhất" },
  { value: "created_at:asc", label: "Cũ nhất" },
  { value: "rating:desc", label: "Nhiều sao nhất" },
  { value: "rating:asc", label: "Ít sao nhất" },
];
