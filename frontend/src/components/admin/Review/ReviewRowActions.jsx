import { Eye, EyeOff, MoreVertical, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../../ui/dropdown-menu";
import { Button } from "../../ui/button";

export const ReviewRowActions = ({ review, disabled, onOpen, onToggleVisible, onDelete }) => (
  <DropdownMenu>
    <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="size-8" />} disabled={disabled} aria-label={`Thao tác đánh giá #${review.id}`}>
      <MoreVertical size={16} aria-hidden="true" />
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-56">
      {onOpen && <DropdownMenuItem onClick={() => onOpen(review)}><Eye />Đọc và phản hồi</DropdownMenuItem>}
      <DropdownMenuItem onClick={() => onToggleVisible(review)}>
        {review.is_active === false ? <Eye /> : <EyeOff />}
        {review.is_active === false ? "Hiện lại đánh giá" : "Ẩn khỏi trang sản phẩm"}
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem variant="destructive" onClick={() => onDelete(review)}><Trash2 />Xóa đánh giá</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);
