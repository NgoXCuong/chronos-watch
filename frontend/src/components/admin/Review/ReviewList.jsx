import { MessagesSquare } from "lucide-react";
import { DataTable } from "../../ui/data-table";
import { getReviewColumns } from "./reviewColumns";

// Khi ô soạn phản hồi chuyển sang drawer, danh sách dùng DataTable chung (Rule 3).
const ReviewList = ({ reviews = [], loading, hasFilters, onOpen, onToggleVisible, onDelete, busyId, sort, onSortChange, pagination }) => (
  <DataTable
    columns={getReviewColumns({ onOpen, onToggleVisible, onDelete, busyId })}
    data={reviews}
    loading={loading}
    emptyIcon={MessagesSquare}
    emptyMessage={hasFilters ? "Không có đánh giá nào khớp bộ lọc" : "Chưa có đánh giá nào từ khách hàng"}
    onRowClick={onOpen}
    sort={sort}
    onSortChange={onSortChange}
    pagination={pagination}
    className="min-w-[800px] table-fixed"
  />
);

export default ReviewList;
