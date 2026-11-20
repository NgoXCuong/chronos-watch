import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTitle, SheetDescription, SheetClose } from "../ui/sheet";

export default function FilterDrawer({ open, onClose, title = "Lọc sản phẩm", resultCount, children }) {
  return <Sheet open={open} onOpenChange={(next) => { if (!next) onClose(); }}>
    <SheetContent className="w-[min(380px,94vw)]">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div><SheetTitle className="text-base">{title}</SheetTitle><SheetDescription className="mt-1 text-xs">Chọn tiêu chí phù hợp với bạn.</SheetDescription></div>
        <SheetClose aria-label="Đóng bộ lọc" />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
      <div className="border-t border-border p-4"><Button onClick={onClose} className="w-full">Xem {resultCount} sản phẩm</Button></div>
    </SheetContent>
  </Sheet>;
}
