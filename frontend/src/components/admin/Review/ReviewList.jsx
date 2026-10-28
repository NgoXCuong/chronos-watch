import { MessagesSquare } from "lucide-react";
import ReviewCard from "./ReviewCard";

/**
 * Rule 3 (AGENTS.md) cho phép dựng danh sách riêng khi bố cục không phải table,
 * với lý do ghi rõ: một đánh giá là comment dài + chuỗi phản hồi lồng bên dưới,
 * và admin soạn phản hồi ngay trong thẻ — ô textarea không sống vừa trong một dòng bảng.
 * Toolbar/find/sort/pagination vẫn dùng SearchBanner + FilterSelect + AdminPagination ở trang.
 */
const ReviewSkeleton = () => (
  <div className="space-y-3">
    {[1, 2, 3].map((item) => (
      <div
        key={item}
        className="h-28 animate-pulse rounded-xl border border-border bg-card shadow-card"
      />
    ))}
  </div>
);

const ReviewEmpty = ({ filtered }) => (
  <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-card py-14 shadow-card">
    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
      <MessagesSquare className="h-5 w-5" strokeWidth={2} />
    </span>
    <p className="text-sm font-medium text-muted-foreground">
      {filtered
        ? "Không có đánh giá nào khớp bộ lọc"
        : "Chưa có đánh giá nào từ khách hàng"}
    </p>
  </div>
);

const ReviewList = ({
  reviews = [],
  loading = false,
  hasFilters = false,
  savingReplyId = null,
  onReply,
  onToggleVisible,
  onDelete,
}) => {
  if (loading) return <ReviewSkeleton />;
  if (reviews.length === 0) return <ReviewEmpty filtered={hasFilters} />;

  return (
    <div className="space-y-3">
      {reviews.map((review) => (
        <ReviewCard
          key={review.id}
          review={review}
          savingReplyId={savingReplyId}
          onReply={onReply}
          onToggleVisible={onToggleVisible}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ReviewList;
