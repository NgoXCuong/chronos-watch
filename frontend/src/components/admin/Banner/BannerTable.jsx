import { useMemo } from "react";
import { ImageIcon } from "lucide-react";
import DataTable from "../../ui/data-table";
import { getBannerColumns } from "./bannerColumns";

// Bảng banner: chỉ là DataTable đã cấu hình (Rule 3 — AGENTS.md)
const BannerTable = ({
  banners = [],
  now,
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
    () => getBannerColumns({ now, onEdit, onToggle, onDelete }),
    [now, onEdit, onToggle, onDelete],
  );

  return (
    <DataTable
      columns={columns}
      data={banners}
      loading={loading}
      onRowClick={(row) => onEdit?.(row)}
      emptyMessage="Không tìm thấy banner nào"
      emptyIcon={ImageIcon}
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

export default BannerTable;
