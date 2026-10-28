import { StickyNote } from "lucide-react";
import DetailSection from "./DetailSection";
import { Badge } from "../../../ui/badge";

// Ghi chú nội bộ: chỉ có tác dụng khi bấm một hành động chuyển trạng thái
const OrderProcessNote = ({ note, onNoteChange }) => (
  <DetailSection title="Lưu ý xử lý" icon={StickyNote}>
    <div className="flex items-center justify-between gap-2">
      <label
        htmlFor="order-note"
        className="text-xs font-bold uppercase tracking-[0.02em] text-navy-700 dark:text-navy-100"
      >
        Nội dung ghi vào lịch sử
      </label>
      <Badge variant="muted">Chỉ quản trị viên thấy</Badge>
    </div>
    <textarea
      id="order-note"
      value={note}
      onChange={(event) => onNoteChange(event.target.value)}
      rows={4}
      placeholder="Mã vận đơn, tình trạng đóng gói, lý do đổi trạng thái…"
      className="mt-2.5 w-full resize-y rounded-lg border border-input bg-card px-3.5 py-2.5 text-[13px] leading-relaxed text-card-foreground outline-none transition-shadow placeholder:text-muted-foreground focus:border-navy-500 focus:shadow-[0_0_0_3px_rgba(15,42,74,.18)]"
    />
  </DetailSection>
);

export default OrderProcessNote;
