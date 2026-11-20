import { ReviewIdentity, ReviewPreview, ReviewState, ReviewDate } from "./ReviewCells";
import { ReviewRowActions } from "./ReviewRowActions";

export const getReviewColumns = ({ onOpen, onToggleVisible, onDelete, busyId }) => [
  { id: "customer", header: "Khách hàng / sản phẩm", width: "26%", render: (review) => <ReviewIdentity review={review} /> },
  { id: "content", header: "Đánh giá", width: "35%", stopRowClick: true, render: (review) => <ReviewPreview review={review} onOpen={onOpen} /> },
  { id: "state", header: "Trạng thái", width: "18%", render: (review) => <ReviewState review={review} /> },
  { id: "created_at", header: "Thời gian", width: "13%", sortKey: "created_at", render: (review) => <ReviewDate review={review} /> },
  { id: "actions", header: "", width: "8%", align: "right", stopRowClick: true, render: (review) => <ReviewRowActions review={review} disabled={busyId === review.id} onOpen={onOpen} onToggleVisible={onToggleVisible} onDelete={onDelete} /> },
];
