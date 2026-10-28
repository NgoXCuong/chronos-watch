import { useState } from "react";
import {
  Dialog,
  DialogCloseButton,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

// 2000 ký tự = trần validation của backend (warranty.service.createRequest)
const MAX_LENGTH = 2000;

// Trang cha mount lại mỗi lần mở → nội dung luôn trắng, không cần effect reset
const WarrantyRequestDialog = ({ open, onOpenChange, submitting = false, onSubmit }) => {
  const [issue, setIssue] = useState("");

  const trimmed = issue.trim();
  const tooLong = issue.length > MAX_LENGTH;

  const close = () => {
    if (!submitting) onOpenChange?.(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!trimmed || tooLong || submitting) return;
    onSubmit?.(trimmed);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader className="flex-row items-start justify-between gap-3">
          <DialogTitle>Gửi yêu cầu bảo hành</DialogTitle>
          <DialogCloseButton onClick={close} />
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3 px-5 py-4">
          <label
            htmlFor="warranty-issue"
            className="text-xs font-semibold uppercase tracking-[0.02em] text-navy-700 dark:text-navy-100"
          >
            Mô tả tình trạng sản phẩm
          </label>
          <Textarea
            id="warranty-issue"
            value={issue}
            onChange={(event) => setIssue(event.target.value)}
            placeholder="Ví dụ: đồng hồ chạy chậm ~2 phút/ngày sau 3 tháng sử dụng, đã thử chỉnh núm nhưng không hết."
            rows={6}
            maxLength={MAX_LENGTH}
            error={tooLong}
            className="resize-y"
          />
          <p className="text-right text-[11px] font-semibold tabular-nums text-muted-foreground">
            {issue.length}/{MAX_LENGTH}
          </p>
          {!trimmed && (
            <p className="text-[11px] text-muted-foreground">
              Mô tả càng cụ thể (lỗi, thời điểm phát hiện, tình trạng máy) thì Chronos xử lý càng nhanh.
            </p>
          )}

          <DialogFooter className="-mx-5 -mb-4 border-x-0 border-b-0">
            <Button type="button" variant="outline" onClick={close} disabled={submitting}>
              Hủy
            </Button>
            <Button type="submit" disabled={!trimmed || tooLong} loading={submitting}>
              Gửi yêu cầu
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WarrantyRequestDialog;
