import {
  UserContactCell,
  UserIdentityCell,
  UserJoinedCell,
  UserOrdersCell,
  UserRoleBadge,
  UserSpentCell,
  UserStatusBadge,
} from "./UserCells";
import { UserRowActions } from "./UserRowActions";
import { isSelfAccount } from "../../../utils/userManage";

// Cột bảng thành viên — mọi cột khai báo width (Rule 3). sortKey khớp
// SORTABLE_USER_COLUMNS trong backend/src/services/admin-user.service.js
// (order_count/total_spent là alias của subquery, sort ngay trên DB chứ không sort 10 dòng đang hiển thị).
export const getUserColumns = ({
  currentUserId,
  busyId,
  onView,
  onToggleRole,
  onToggleStatus,
  onResetPassword,
} = {}) => [
  {
    id: "username",
    header: "Thành viên",
    sortKey: "username",
    width: "300px",
    cell: ({ row }) => (
      <UserIdentityCell user={row} isSelf={isSelfAccount(row, currentUserId)} />
    ),
  },
  {
    id: "email",
    header: "Liên hệ",
    sortKey: "email",
    width: "230px",
    cell: ({ row }) => <UserContactCell user={row} />,
  },
  {
    id: "role",
    header: "Vai trò",
    width: "140px",
    cell: ({ row }) => <UserRoleBadge role={row.role} />,
  },
  {
    id: "status",
    header: "Trạng thái",
    width: "150px",
    cell: ({ row }) => <UserStatusBadge status={row.status} />,
  },
  {
    id: "order_count",
    header: "Đơn hàng",
    align: "right",
    sortKey: "order_count",
    width: "110px",
    cell: ({ row }) => <UserOrdersCell user={row} />,
  },
  {
    id: "total_spent",
    header: "Chi tiêu",
    align: "right",
    sortKey: "total_spent",
    width: "130px",
    cell: ({ row }) => <UserSpentCell user={row} />,
  },
  {
    id: "created_at",
    header: "Gia nhập",
    sortKey: "created_at",
    width: "120px",
    cell: ({ row }) => <UserJoinedCell user={row} />,
  },
  {
    id: "actions",
    header: "Thao tác",
    align: "right",
    width: "170px",
    stopRowClick: true,
    cell: ({ row }) => (
      <UserRowActions
        user={row}
        currentUserId={currentUserId}
        busyId={busyId}
        onView={onView}
        onToggleRole={onToggleRole}
        onToggleStatus={onToggleStatus}
        onResetPassword={onResetPassword}
      />
    ),
  },
];
