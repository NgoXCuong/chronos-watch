import { Users } from "lucide-react";
import DataTable from "../../ui/data-table";
import { getUserColumns } from "./userColumns";

// Bảng thành viên = DataTable dùng chung (Rule 3): sort + phân trang server-side,
// checkbox chọn nhiều cho hành động khóa/mở khóa hàng loạt.
const UserTable = ({
  users = [],
  loading = false,
  currentUserId,
  busyId,
  sort,
  onSortChange,
  selectedRowKeys,
  onSelectionChange,
  selectionActions,
  onView,
  onToggleRole,
  onToggleStatus,
  onResetPassword,
  pagination,
}) => (
  <DataTable
    columns={getUserColumns({
      currentUserId,
      busyId,
      onView,
      onToggleRole,
      onToggleStatus,
      onResetPassword,
    })}
    data={users}
    loading={loading}
    emptyIcon={Users}
    emptyMessage="Không tìm thấy thành viên nào khớp bộ lọc"
    selectable
    selectedRowKeys={selectedRowKeys}
    onSelectionChange={onSelectionChange}
    selectionActions={selectionActions}
    sort={sort}
    onSortChange={onSortChange}
    onRowClick={onView}
    pagination={pagination}
  />
);

export default UserTable;
