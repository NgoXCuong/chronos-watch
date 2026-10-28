import {
  FlashSaleItemCountCell,
  FlashSaleNameCell,
  FlashSaleSoldCell,
  FlashSaleStateBadge,
  FlashSaleWindowCell,
} from "./FlashSaleCells";
import { FlashSaleRowActions } from "./FlashSaleRowActions";

// Cột bảng Flash Sale — mọi cột khai báo width (Rule 3). sortKey chỉ được lấy trong
// SORTABLE_FLASH_COLUMNS: name, start_date, end_date, created_at, item_count, sold_units
// (backend/src/services/admin-flash-sale.service.js). Cột ngoài whitelist KHÔNG gắn
// sortKey — backend sẽ âm thầm trả về created_at DESC và người dùng tưởng đang sort cột đó.
export const getFlashSaleColumns = ({ onEdit, onToggle, onDelete } = {}) => [
  {
    id: "name",
    header: "Tên đợt",
    sortKey: "name",
    width: "250px",
    cell: ({ row }) => <FlashSaleNameCell sale={row} />,
  },
  {
    id: "item_count",
    header: "Sản phẩm",
    sortKey: "item_count",
    width: "120px",
    cell: ({ row }) => <FlashSaleItemCountCell count={row.item_count} />,
  },
  {
    id: "sold_units",
    header: "Đã bán",
    sortKey: "sold_units",
    width: "170px",
    cell: ({ row }) => <FlashSaleSoldCell sale={row} />,
  },
  {
    id: "start_date",
    header: "Lịch chạy",
    sortKey: "start_date",
    width: "190px",
    cell: ({ row }) => <FlashSaleWindowCell sale={row} />,
  },
  {
    // state là giá trị SUY RA do backend tính sẵn — không có cột DB nào để sort
    id: "state",
    header: "Trạng thái",
    width: "140px",
    cell: ({ row }) => <FlashSaleStateBadge state={row.state} />,
  },
  {
    id: "actions",
    header: "Thao tác",
    align: "right",
    width: "128px",
    stopRowClick: true,
    cell: ({ row }) => (
      <FlashSaleRowActions
        sale={row}
        onEdit={onEdit}
        onToggle={onToggle}
        onDelete={onDelete}
      />
    ),
  },
];
