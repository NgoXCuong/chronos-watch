import { useState } from "react";
import {
  CornerDownLeft,
  Eye,
  EyeOff,
  MessageSquare,
  MessagesSquare,
  Trash2,
} from "lucide-react";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Textarea } from "../../ui/textarea";
import { cn } from "@/lib/utils";
import { ReviewStars } from "./ReviewStars";
import { formatDateTime, formatRelativeTime } from "../../../utils/formatCurrency";
import { REVIEW_REPLY_MAX } from "../../../constants/reviewFilter";

// reviews là dòng kiểm duyệt nội dung (comment dài, phản hồi lồng dưới comment)
// nên không đưa vào DataTable được — xem chú thích ở ReviewList.jsx (Rule 3, AGENTS.md)
const ReplyThread = ({ review }) => (
  <div className="mt-3 rounded-r-lg border-l-2 border-navy-600 bg-navy-50/70 px-3 py-2.5 dark:border-navy-300 dark:bg-navy-500/10">
    <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.02em] text-navy-600 dark:text-navy-200">
      <CornerDownLeft className="h-3 w-3" strokeWidth={2.5} />
      Phản hồi từ shop
      <span className="font-medium normal-case tracking-normal text-muted-foreground">
        {formatDateTime(review.replied_at)}
      </span>
    </p>
    <p className="mt-1 text-[13px] leading-relaxed text-foreground">
      {review.admin_reply}
    </p>
  </div>
);

const ReplyComposer = ({ review, sending, onSend, onCancel }) => {
  const [text, setText] = useState(review.admin_reply || "");

  return (
    <form
      className="mt-3 space-y-2 rounded-lg border border-border bg-muted/40 p-3"
      onSubmit={async (event) => {
        event.preventDefault();
        if (!text.trim()) return;
        // Trang trả về true khi gửi xong → đóng khung soạn, khỏi hiện lại ô đã gửi
        if (await onSend(review, text.trim())) onCancel();
      }}
    >
      <label
        htmlFor={`reply-${review.id}`}
        className="block text-[11px] font-bold uppercase tracking-[0.02em] text-navy-700 dark:text-navy-100"
      >
        {review.admin_reply ? "Sửa phản hồi" : "Phản hồi công khai"}
      </label>
      <Textarea
        id={`reply-${review.id}`}
        rows={3}
        value={text}
        maxLength={REVIEW_REPLY_MAX}
        onChange={(event) => setText(event.target.value)}
        placeholder="Ví dụ: Cảm ơn anh/chị đã tin chọn Chronos Watch..."
      />
      <div className="flex items-center gap-2">
        <Button type="submit" size="sm" loading={sending} disabled={!text.trim()}>
          {!sending && <MessageSquare className="h-4 w-4" strokeWidth={2} />}
          Gửi phản hồi
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          Hủy
        </Button>
        <span className="ml-auto text-[11px] tabular-nums text-muted-foreground">
          {text.length}/{REVIEW_REPLY_MAX}
        </span>
      </div>
    </form>
  );
};

const ReviewCard = ({ review, savingReplyId, onReply, onToggleVisible, onDelete }) => {
  const [composerOpen, setComposerOpen] = useState(false);
  const isSaving = savingReplyId === review.id;
  const visible = review.is_active !== false;
  const replied = Boolean(review.admin_reply);

  const closeComposer = () => {
    setComposerOpen(false);
  };

  return (
    <article
      className={cn(
        "rounded-xl border border-border bg-card p-4 shadow-card transition-all duration-200 hover:border-navy-200 hover:shadow-hover dark:hover:border-navy-500/40",
        !visible && "bg-muted/30",
      )}
    >
      <div className="flex gap-3">
        <span className="h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-border bg-navy-50 dark:bg-navy-500/10">
          {review.product?.image_url ? (
            <img
              src={review.product.image_url}
              alt={review.product?.name || "Sản phẩm"}
              loading="lazy"
              className="h-full w-full object-contain p-1"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-[11px] font-bold text-muted-foreground">
              {(review.product?.name || "?").charAt(0)}
            </span>
          )}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-[13px] font-bold text-foreground">
              {review.user?.username || "Khách vãng lai"}
            </span>
            {review.user?.email && (
              <span className="truncate text-[11px] text-muted-foreground">
                {review.user.email}
              </span>
            )}
            <ReviewStars rating={review.rating} size={14} className="shrink-0" />
            {!visible && <Badge variant="muted">Đã ẩn</Badge>}
            {visible && replied && <Badge variant="success">Đã phản hồi</Badge>}
            {visible && !replied && <Badge variant="info">Chờ phản hồi</Badge>}
            <span
              className="ml-auto shrink-0 text-[11px] tabular-nums text-muted-foreground"
              title={formatDateTime(review.created_at)}
            >
              {formatRelativeTime(review.created_at)}
            </span>
          </div>

          <p className="mt-1 truncate text-[11px] text-navy-600 dark:text-navy-200">
            {review.product?.name || "Sản phẩm đã gỡ"}
          </p>

          <p className="mt-2 text-[13px] leading-relaxed text-foreground">
            {review.comment || "—"}
          </p>

          {!composerOpen && replied && <ReplyThread review={review} />}

          {composerOpen && (
            <ReplyComposer
              review={review}
              sending={isSaving}
              onSend={onReply}
              onCancel={closeComposer}
            />
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border pt-3">
        <Button
          size="sm"
          variant={composerOpen ? "outline" : "default"}
          onClick={() => setComposerOpen((open) => !open)}
          className="gap-1.5"
        >
          <MessagesSquare className="h-4 w-4" strokeWidth={2} />
          {replied ? "Sửa phản hồi" : "Trả lời"}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onToggleVisible(review)}
          className="gap-1.5"
        >
          {visible ? (
            <EyeOff className="h-4 w-4" strokeWidth={2} />
          ) : (
            <Eye className="h-4 w-4" strokeWidth={2} />
          )}
          {visible ? "Ẩn khỏi trang sản phẩm" : "Hiện lại đánh giá"}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onDelete(review)}
          className="ml-auto gap-1.5 text-muted-foreground hover:bg-sale-soft hover:text-sale"
        >
          <Trash2 className="h-4 w-4" strokeWidth={2} />
          Xóa hẳn
        </Button>
      </div>
    </article>
  );
};

export default ReviewCard;
