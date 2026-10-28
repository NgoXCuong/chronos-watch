import { useMemo } from "react";
import { Watch } from "lucide-react";
import DataTable from "../../ui/data-table";
import { getProductColumns } from "./productColumns";

// Bảng sản phẩm: chỉ là DataTable đã cấu hình (Rule 3 — AGENTS.md)
const ProductTable = ({
  products = [],
  loading = false,
  onView,
  onEdit,
  onDelete,
  pagination,
  sort,
  onSortChange,
  selectedRowKeys,
  onSelectionChange,
  selectionActions,
}) => {
  const columns = useMemo(
    () => getProductColumns({ onView, onEdit, onDelete }),
    [onView, onEdit, onDelete],
  );

  return (
    <DataTable
      columns={columns}
      data={products}
      loading={loading}
      onRowClick={(row) => onEdit?.(row.id)}
      emptyMessage="Không tìm thấy sản phẩm nào"
      emptyIcon={Watch}
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

export default ProductTable;
