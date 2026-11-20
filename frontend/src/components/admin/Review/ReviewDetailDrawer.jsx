import { MessageSquare, EyeOff } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetDescription, SheetClose } from "../../ui/sheet";
import { ReviewIdentity, ReviewState } from "./ReviewCells";
import { ReviewStars } from "./ReviewStars";
import { ReviewRowActions } from "./ReviewRowActions";
import ReviewReplyForm from "./ReviewReplyForm";
import { formatDateTime } from "../../../utils/formatCurrency";

const ReviewDetailDrawer = ({ review, saving, busy, onClose, onReply, onToggleVisible, onDelete }) => (
  <Sheet open={Boolean(review)} onOpenChange={(open) => { if (!open && !saving) onClose(); }}>
    <SheetContent>
      {review && <>
        <header className="flex items-start justify-between gap-3 border-b border-border bg-muted/40 px-5 py-4">
          <div className="space-y-1">
            <SheetTitle>Chi tiết đánh giá</SheetTitle>
            <SheetDescription>Đọc nội dung và phản hồi khách hàng.</SheetDescription>
          </div>
          <SheetClose disabled={saving} />
        </header>
        <div className="flex-1 space-y-6 overflow-y-auto overscroll-contain p-5">
          <section className="space-y-3 border-b border-border pb-5">
            <div className="flex items-center justify-between gap-3">
              <ReviewIdentity review={review} />
              <ReviewRowActions review={review} disabled={busy || saving} onToggleVisible={onToggleVisible} onDelete={onDelete} />
            </div>
            <p className="break-all text-xs text-muted-foreground">{review.user?.email}</p>
            <ReviewState review={review} />
          </section>
          <section className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <ReviewStars rating={review.rating} size={16} />
              <time className="text-xs tabular-nums text-muted-foreground">{formatDateTime(review.created_at)}</time>
            </div>
            <p className="whitespace-pre-wrap break-words text-sm leading-7 text-foreground">{review.comment || "Khách hàng không để lại nội dung bình luận."}</p>
            {review.is_active === false && <p className="flex items-center gap-2 rounded-lg bg-muted p-3 text-xs text-muted-foreground"><EyeOff size={15} />Đánh giá này đang được ẩn khỏi trang sản phẩm.</p>}
          </section>
          {review.admin_reply && <section className="space-y-2 rounded-lg border border-border bg-muted/40 p-4">
            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.02em] text-primary"><MessageSquare size={14} />Phản hồi từ shop</h3>
            <p className="whitespace-pre-wrap break-words text-sm leading-7">{review.admin_reply}</p>
            <p className="text-xs text-muted-foreground">{formatDateTime(review.replied_at)}</p>
          </section>}
          <section className="border-t border-border pt-5">
            <ReviewReplyForm key={`${review.id}:${review.replied_at || ''}`} review={review} sending={saving} onReply={onReply} />
          </section>
        </div>
      </>}
    </SheetContent>
  </Sheet>
);

export default ReviewDetailDrawer;
