import { useMemo } from "react";
import { ShieldOff } from "lucide-react";
import DataTable from "../../ui/data-table";
import { getWarrantyColumns } from "./warrantyColumns";

// Bảng phiếu bảo hành: chỉ là DataTable đã cấu hình (Rule 3 — AGENTS.md)
const WarrantyTable = ({
  warranties = [],
  loading = false,
  searchTerm = "",
  sort,
  onSortChange,
  onView,
  onEdit,
  onDelete,
  pagination,
  selectedRowKeys,
  onSelectionChange,
  selectionActions,
}) => {
  const columns = useMemo(
    () => getWarrantyColumns({ onView, onEdit, onDelete }),
    [onView, onEdit, onDelete],
  );

  return (
    <DataTable
      columns={columns}
      data={warranties}
      loading={loading}
      onRowClick={(row) => onView?.(row)}
      // Phiếu vô hiệu không còn giá trị xử lý nên làm mờ, không ẩn
      rowClassName={(row) => row.state === "void" && "opacity-70"}
      emptyMessage={
        searchTerm
          ? "Không tìm thấy phiếu bảo hành nào phù hợp"
          : "Chưa có phiếu bảo hành nào (phiếu sinh ra khi đơn chuyển sang Đã giao)"
      }
      emptyIcon={ShieldOff}
      pagination={pagination}
      sort={sort}
      onSortChange={onSortChange}
      selectable
      selectedRowKeys={selectedRowKeys}
      onSelectionChange={onSelectionChange}
      selectionActions={selectionActions}
    />
  );
};

export default WarrantyTable;
