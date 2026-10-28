import { useState } from "react";
import { MessageSquareReply, Send } from "lucide-react";
import {
  Dialog,
  DialogCloseButton,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Textarea } from "../../ui/textarea";
import { Button } from "../../ui/button";
import FormField from "../Common/FormField";
import { cn } from "@/lib/utils";
import {
  WARRANTY_REQUEST_STATUS,
  warrantyStateLabel,
} from "../../../constants/warrantyStatus";

const REPLY_MAX = 2000;
// 'pending' không phải nút: chuyển ngược về chờ xử lý không có nghiệp vụ ở đây
const REPLY_STATUSES = ["processing", "done", "rejected"];

const StatusChip = ({ status, active, onClick }) => {
  const cfg = WARRANTY_REQUEST_STATUS[status];
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[12px] font-semibold uppercase tracking-[0.02em] transition-colors",
        active
          ? "border-navy-600 bg-navy-600 text-primary-foreground shadow-card dark:border-navy-400 dark:bg-navy-400 dark:text-navy-900"
          : "border-border bg-card text-navy-700 hover:bg-navy-50 dark:text-navy-100 dark:hover:bg-navy-500/15",
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          active ? "bg-primary-foreground/80" : cfg.dot,
        )}
      />
      {cfg.label}
    </button>
  );
};

// State seed theo request.id (Dialog unmount lúc đóng) — backend chặn admin_reply rỗng
// bằng 400, UI chặn trước để admin không bấm nhầm nút Gửi
const WarrantyReplyBody = ({ request, saving, onSubmit, onClose }) => {
  const [status, setStatus] = useState("processing");
  const [reply, setReply] = useState("");
  const [touched, setTouched] = useState(false);

  const emptyReply = reply.trim().length === 0;

  const handleSubmit = (event) => {
    event.preventDefault();
    setTouched(true);
    if (emptyReply) return;
    onSubmit({ status, admin_reply: reply.trim() });
  };

  return (
    <>
      <DialogHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <DialogTitle className="flex items-center gap-2">
              <MessageSquareReply className="h-4 w-4 text-navy-600 dark:text-navy-200" strokeWidth={2} />
              Trả lời yêu cầu bảo hành
            </DialogTitle>
            <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
              {request.warranty?.code} · {request.warranty?.product_name} ·{" "}
              phiếu {warrantyStateLabel(request.warranty_state)}
            </p>
          </div>
          <DialogCloseButton onClick={onClose} />
        </div>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4 p-5">
        <div className="rounded-lg border border-border bg-muted/40 px-3 py-2.5">
          <p className="text-xs font-bold uppercase tracking-[0.02em] text-muted-foreground">
            Khách mô tả
          </p>
          <p className="mt-1 max-h-32 overflow-y-auto text-[13px] leading-relaxed text-card-foreground">
            {request.issue || "Không có mô tả"}
          </p>
        </div>

        <FormField
          label="Hướng xử lý"
          required
          hint="Tiếp nhận sẽ chuyển phiếu sang Đang bảo hành; Hoàn tất/Từ chối trả phiếu về Còn hạn."
        >
          <div className="flex flex-wrap gap-2">
            {REPLY_STATUSES.map((value) => (
              <StatusChip
                key={value}
                status={value}
                active={status === value}
                onClick={() => setStatus(value)}
              />
            ))}
          </div>
        </FormField>

        <FormField
          label="Nội dung phản hồi"
          htmlFor="request-reply"
          required
          error={touched && emptyReply ? "Cần nội dung phản hồi trước khi chuyển trạng thái." : undefined}
          hint={`${reply.length}/${REPLY_MAX} ký tự — khách hàng thấy được nội dung này.`}
        >
          <Textarea
            id="request-reply"
            rows={5}
            value={reply}
            maxLength={REPLY_MAX}
            onChange={(event) => setReply(event.target.value)}
            placeholder="VD: Trung tâm đã tiếp nhận, khách mang đồng hồ tới chi nhánh Hà Nội trong 7 ngày kèm phiếu."
            error={touched && emptyReply}
          />
        </FormField>

        <DialogFooter className="border-t-0 px-0 pb-0 pt-1">
          <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
            Hủy
          </Button>
          <Button type="submit" loading={saving} className="min-w-[150px] gap-1.5">
            {!saving && <Send className="h-4 w-4" strokeWidth={2} />}
            Gửi phản hồi
          </Button>
        </DialogFooter>
      </form>
    </>
  );
};

const WarrantyReplyDialog = ({ open, request, saving = false, onSubmit, onClose }) => {
  if (!open || !request) return null;

  return (
    <Dialog open onOpenChange={(next) => !next && onClose?.()}>
      <DialogContent className="max-w-xl">
        <WarrantyReplyBody
          key={request.id}
          request={request}
          saving={saving}
          onSubmit={onSubmit}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default WarrantyReplyDialog;
