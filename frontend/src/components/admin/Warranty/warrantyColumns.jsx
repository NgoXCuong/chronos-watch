import {
  WarrantyCustomerCell,
  WarrantyMonoCell,
  WarrantyOrderCell,
  WarrantyProductCell,
  WarrantyProgressCell,
  WarrantyStateBadge,
  WarrantyTermCell,
} from "./WarrantyCells";
import { WarrantyRowActions } from "./WarrantyRowActions";

/**
 * Cột bảng phiếu bảo hành — mọi cột khai báo `width` (Rule 3).
 * `sortKey` chỉ đặt ở cột có trong SORTABLE_WARRANTY_COLUMNS của backend
 * (code, product_name, sku, serial, start_date, end_date, created_at);
 * cột suy ra (state, tiến trình) và cột JOIN (khách hàng, mã đơn) không sort được.
 */
export const getWarrantyColumns = ({ onView, onEdit, onDelete } = {}) => [
  {
    id: "code",
    header: "Mã phiếu",
    sortKey: "code",
    width: "190px",
    cell: ({ row }) => <WarrantyMonoCell value={row.code} />,
  },
  {
    id: "product",
    header: "Sản phẩm",
    sortKey: "product_name",
    width: "200px",
    cell: ({ row }) => <WarrantyProductCell row={row} />,
  },
  {
    id: "customer",
    header: "Khách hàng",
    width: "190px",
    cell: ({ row }) => <WarrantyCustomerCell row={row} />,
  },
  {
    id: "serial",
    header: "Serial",
    sortKey: "serial",
    width: "160px",
    cell: ({ row }) => <WarrantyMonoCell value={row.serial} empty="Chưa cập nhật" />,
  },
  {
    id: "term",
    header: "Thời hạn",
    sortKey: "start_date",
    width: "140px",
    cell: ({ row }) => <WarrantyTermCell row={row} />,
  },
  {
    id: "progress",
    header: "Tiến trình",
    width: "150px",
    cell: ({ row }) => <WarrantyProgressCell row={row} />,
  },
  {
    id: "state",
    header: "Trạng thái",
    width: "150px",
    cell: ({ row }) => <WarrantyStateBadge state={row.state} />,
  },
  {
    id: "order",
    header: "Đơn hàng",
    width: "180px",
    cell: ({ row }) => <WarrantyOrderCell row={row} />,
  },
  {
    id: "actions",
    header: "Thao tác",
    align: "right",
    width: "130px",
    stopRowClick: true,
    cell: ({ row }) => (
      <WarrantyRowActions warranty={row} onView={onView} onEdit={onEdit} onDelete={onDelete} />
    ),
  },
];
