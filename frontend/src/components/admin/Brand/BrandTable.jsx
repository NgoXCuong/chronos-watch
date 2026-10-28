import { useMemo } from "react";
import { Building2 } from "lucide-react";
import DataTable from "../../ui/data-table";
import { getBrandColumns } from "./brandColumns";

// Bảng thương hiệu: chỉ là DataTable đã cấu hình (Rule 3 — AGENTS.md)
const BrandTable = ({
  brands = [],
  loading = false,
  onEdit,
  onToggle,
  onDelete,
  pagination,
  sort,
  onSortChange,
  selectedRowKeys,
  onSelectionChange,
  selectionActions,
}) => {
  const columns = useMemo(
    () => getBrandColumns({ onEdit, onToggle, onDelete }),
    [onEdit, onToggle, onDelete],
  );

  return (
    <DataTable
      columns={columns}
      data={brands}
      loading={loading}
      onRowClick={(row) => onEdit?.(row)}
      emptyMessage="Không tìm thấy thương hiệu nào"
      emptyIcon={Building2}
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

export default BrandTable;
