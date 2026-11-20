import { ImageOff } from "lucide-react";
import { Badge } from "../../ui/badge";
import { ReviewStars } from "./ReviewStars";
import { formatDateTime, formatRelativeTime } from "../../../utils/formatCurrency";

export const ReviewIdentity = ({ review }) => (
  <div className="flex min-w-0 items-center gap-3">
    <span className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted">
      <ImageOff size={16} className="text-muted-foreground" aria-hidden="true" />
      {review.product?.image_url && <img src={review.product.image_url} alt="" loading="lazy" className="absolute inset-0 size-full bg-card object-contain p-1" onError={(event) => { event.currentTarget.hidden = true; }} />}
    </span>
    <div className="min-w-0 space-y-1">
      <p className="truncate text-[13px] font-semibold text-foreground">{review.user?.username || "Khách hàng"}</p>
      <p className="truncate text-xs text-muted-foreground" title={review.product?.name}>{review.product?.name || "Sản phẩm đã gỡ"}</p>
    </div>
  </div>
);

export const ReviewPreview = ({ review, onOpen }) => (
  <button type="button" onClick={() => onOpen(review)} className="block w-full min-w-0 space-y-1.5 rounded text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label={`Đọc đánh giá của ${review.user?.username || "khách hàng"}`}>
    <ReviewStars rating={review.rating} size={13} />
    <p className="line-clamp-2 whitespace-normal break-words text-[13px] leading-5 text-foreground">{review.comment || "Không có nội dung bình luận"}</p>
  </button>
);

export const ReviewState = ({ review }) => (
  <div className="flex flex-wrap gap-1.5">
    <Badge variant={review.admin_reply ? "success" : "outline"}>{review.admin_reply ? "Đã phản hồi" : "Chưa phản hồi"}</Badge>
    {review.is_active === false && <Badge variant="muted">Đã ẩn</Badge>}
  </div>
);

export const ReviewDate = ({ review }) => (
  <span className="text-xs tabular-nums text-muted-foreground" title={formatDateTime(review.created_at)}>{formatRelativeTime(review.created_at)}</span>
);
