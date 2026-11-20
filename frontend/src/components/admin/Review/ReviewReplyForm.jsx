import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "../../ui/button";
import { Textarea } from "../../ui/textarea";
import { REVIEW_REPLY_MAX } from "../../../constants/reviewFilter";

const ReviewReplyForm = ({ review, sending, onReply }) => {
  const [text, setText] = useState(review.admin_reply || "");
  return (
    <form className="space-y-3" onSubmit={async (event) => {
      event.preventDefault();
      if (!sending && text.trim()) await onReply(review, text.trim());
    }}>
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={`review-reply-${review.id}`} className="text-xs font-bold uppercase tracking-[0.02em] text-foreground">{review.admin_reply ? "Chỉnh sửa phản hồi" : "Trả lời khách hàng"}</label>
        <span className="text-xs tabular-nums text-muted-foreground">{text.length}/{REVIEW_REPLY_MAX}</span>
      </div>
      <Textarea id={`review-reply-${review.id}`} rows={6} value={text} onChange={(event) => setText(event.target.value)} disabled={sending} maxLength={REVIEW_REPLY_MAX} placeholder="Nhập phản hồi cho khách hàng..." className="min-h-36 resize-y" />
      <p className="text-xs leading-relaxed text-muted-foreground">Phản hồi sẽ hiển thị công khai cùng đánh giá trên trang sản phẩm.</p>
      <Button type="submit" loading={sending} disabled={!text.trim() || text.trim() === (review.admin_reply || "")} className="w-full gap-2">
        <Send size={15} aria-hidden="true" />{review.admin_reply ? "Cập nhật phản hồi" : "Gửi phản hồi"}
      </Button>
    </form>
  );
};

export default ReviewReplyForm;
