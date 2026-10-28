import { useMemo } from "react";
import { ShoppingBag } from "lucide-react";
import DataTable from "../../ui/data-table";
import { getOrderColumns } from "./orderColumns";

// Bảng đơn hàng: chỉ là DataTable đã cấu hình (Rule 3 — AGENTS.md)
const OrderTable = ({
  orders = [],
  loading = false,
  onStatusUpdate,
  onView,
  updatingId,
  pagination,
  sort,
  onSortChange,
  selectedRowKeys,
  onSelectionChange,
  selectionActions,
}) => {
  const columns = useMemo(
    () => getOrderColumns({ onView, onStatusUpdate, updatingId }),
    [onStatusUpdate, onView, updatingId],
  );

  return (
    <DataTable
      columns={columns}
      data={orders}
      loading={loading}
      onRowClick={(row) => onView(row.id)}
      emptyMessage="Không tìm thấy đơn hàng nào"
      emptyIcon={ShoppingBag}
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

export default OrderTable;
