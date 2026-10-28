import {
  VoucherCodeCell,
  VoucherMinOrderCell,
  VoucherStatusBadge,
  VoucherTypeBadge,
  VoucherUsageCell,
  VoucherValueCell,
  VoucherWindowCell,
} from "./VoucherCells";
import { VoucherRowActions } from "./VoucherRowActions";

// Cột bảng voucher — mọi cột khai báo width (Rule 3); sortKey là cột backend nhận
// trong SORTABLE_VOUCHER_COLUMNS (backend/src/services/voucher.service.js).
export const getVoucherColumns = ({ now, onEdit, onToggle, onDelete } = {}) => [
  {
    id: "code",
    header: "Mã voucher",
    sortKey: "code",
    width: "150px",
    cell: ({ row }) => <VoucherCodeCell code={row.code} />,
  },
  {
    id: "discount_type",
    header: "Loại",
    sortKey: "discount_type",
    width: "110px",
    cell: ({ row }) => <VoucherTypeBadge value={row.discount_type} />,
  },
  {
    id: "discount_value",
    header: "Giá trị giảm",
    sortKey: "discount_value",
    width: "130px",
    cell: ({ row }) => <VoucherValueCell row={row} />,
  },
  {
    id: "min_order_value",
    header: "Đơn tối thiểu",
    sortKey: "min_order_value",
    width: "130px",
    cell: ({ row }) => <VoucherMinOrderCell value={row.min_order_value} />,
  },
  {
    id: "used_count",
    header: "Lượt dùng",
    sortKey: "used_count",
    width: "130px",
    cell: ({ row }) => <VoucherUsageCell row={row} />,
  },
  {
    id: "start_date",
    header: "Hiệu lực",
    sortKey: "start_date",
    width: "120px",
    cell: ({ row }) => <VoucherWindowCell row={row} />,
  },
  {
    id: "status",
    header: "Trạng thái",
    width: "130px",
    cell: ({ row }) => <VoucherStatusBadge row={row} now={now} />,
  },
  {
    id: "actions",
    header: "Thao tác",
    align: "right",
    width: "120px",
    stopRowClick: true,
    cell: ({ row }) => (
      <VoucherRowActions
        voucher={row}
        onEdit={onEdit}
        onToggle={onToggle}
        onDelete={onDelete}
      />
    ),
  },
];
