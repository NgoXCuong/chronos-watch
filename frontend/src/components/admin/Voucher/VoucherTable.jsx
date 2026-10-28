import { useMemo } from "react";
import { Ticket } from "lucide-react";
import DataTable from "../../ui/data-table";
import { getVoucherColumns } from "./voucherColumns";
import { voucherRowClass } from "../../../utils/voucherStatus";

// Bảng voucher: chỉ là DataTable đã cấu hình (Rule 3 — AGENTS.md)
const VoucherTable = ({
  vouchers = [],
  now,
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
    () => getVoucherColumns({ now, onEdit, onToggle, onDelete }),
    [now, onEdit, onToggle, onDelete],
  );

  return (
    <DataTable
      columns={columns}
      data={vouchers}
      loading={loading}
      onRowClick={(row) => onEdit?.(row)}
      rowClassName={(row) => voucherRowClass(row, now)}
      emptyMessage={
        searchTerm
          ? "Không tìm thấy voucher nào phù hợp"
          : "Chưa có mã giảm giá nào"
      }
      emptyIcon={Ticket}
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

export default VoucherTable;
