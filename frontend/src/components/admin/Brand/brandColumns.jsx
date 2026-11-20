import {
  BrandCountryCell,
  BrandDescriptionCell,
  BrandAvailabilityCell,
  BrandStockCell,
  BrandInfoCell,
  BrandStatusBadge,
} from "./BrandCells";
import { BrandRowActions } from "./BrandRowActions";

// Cột bảng thương hiệu — mọi cột khai báo width (Rule 3), sortKey là cột backend
// nhận trong SORTABLE_BRAND_COLUMNS
export const getBrandColumns = ({ onEdit, onToggle, onDelete } = {}) => [
  {
    id: "name",
    header: "Thương hiệu",
    sortKey: "name",
    width: "220px",
    cell: ({ row }) => <BrandInfoCell brand={row} />,
  },
  {
    id: "country",
    header: "Quốc gia",
    sortKey: "country",
    width: "110px",
    cell: ({ row }) => <BrandCountryCell value={row.country} />,
  },
  {
    id: "description", header: "Mô tả", width: "280px",
    cell: ({ row }) => <BrandDescriptionCell value={row.description} />,
  },
  {
    id: "active_product_count", header: "Đang bán / Tổng mẫu", sortKey: "active_product_count", width: "160px", align: "center",
    cell: ({ row }) => <BrandAvailabilityCell active={row.active_product_count} total={row.product_count} />,
  },
  {
    id: "stock_total", header: "Tồn kho", sortKey: "stock_total", width: "120px", align: "right",
    cell: ({ row }) => <BrandStockCell value={row.stock_total} />,
  },
  {
    id: "is_active",
    header: "Trạng thái",
    width: "135px",
    cell: ({ row }) => <BrandStatusBadge isActive={row.is_active !== false} />,
  },
  {
    id: "actions",
    header: "Thao tác",
    align: "right",
    width: "120px",
    stopRowClick: true,
    cell: ({ row }) => (
      <BrandRowActions
        brand={row}
        onEdit={onEdit}
        onToggle={onToggle}
        onDelete={onDelete}
      />
    ),
  },
];
