import { AlertDialog, AlertDialogContent, AlertDialogTitle, AlertDialogDescription } from "../../ui/alert-dialog";
import { Button } from "../../ui/button";

const ReviewDeleteDialog = ({ review, deleting, onClose, onConfirm }) => (
  <AlertDialog open={Boolean(review)} onOpenChange={(open) => { if (!open && !deleting) onClose(); }}>
    <AlertDialogContent>
      <AlertDialogTitle>Xóa đánh giá này?</AlertDialogTitle>
      <AlertDialogDescription>Đánh giá của {review?.user?.username || "khách hàng"} và phản hồi từ shop sẽ bị xóa vĩnh viễn. Điểm trung bình của sản phẩm sẽ được tính lại.</AlertDialogDescription>
      <div className="mt-5 flex justify-end gap-2">
        <Button variant="outline" disabled={deleting} onClick={onClose}>Giữ lại</Button>
        <Button variant="destructive" loading={deleting} onClick={onConfirm}>Xóa đánh giá</Button>
      </div>
    </AlertDialogContent>
  </AlertDialog>
);

export default ReviewDeleteDialog;
