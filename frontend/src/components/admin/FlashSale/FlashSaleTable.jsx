import { useMemo } from "react";
import { Zap } from "lucide-react";
import DataTable from "../../ui/data-table";
import { getFlashSaleColumns } from "./flashSaleColumns";
import { flashRowClass } from "../../../utils/flashSale";

// Bảng Flash Sale: chỉ là DataTable đã cấu hình (Rule 3 — AGENTS.md).
// Sort/phân trang chạy ở backend qua useFlashSales — không array.sort() trên 10 dòng.
const FlashSaleTable = ({
  flashSales = [],
  loading = false,
  searchTerm = "",
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
    () => getFlashSaleColumns({ onEdit, onToggle, onDelete }),
    [onEdit, onToggle, onDelete],
  );

  return (
    <DataTable
      columns={columns}
      data={flashSales}
      loading={loading}
      onRowClick={(row) => onEdit?.(row)}
      rowClassName={(row) => flashRowClass(row)}
      emptyMessage={
        searchTerm
          ? "Không tìm thấy đợt Flash Sale nào phù hợp"
          : "Chưa có đợt Flash Sale nào"
      }
      emptyIcon={Zap}
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

export default FlashSaleTable;
