import { formatDate } from "../../../utils/formatCurrency";
import {
  BrandCountryCell,
  BrandCountCell,
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
    width: "300px",
    cell: ({ row }) => <BrandInfoCell brand={row} />,
  },
  {
    id: "country",
    header: "Quốc gia",
    sortKey: "country",
    width: "160px",
    cell: ({ row }) => <BrandCountryCell value={row.country} />,
  },
  {
    id: "product_count",
    header: "Sản phẩm",
    sortKey: "product_count",
    align: "center",
    width: "130px",
    cell: ({ row }) => <BrandCountCell count={row.product_count} />,
  },
  {
    id: "is_active",
    header: "Trạng thái",
    width: "170px",
    cell: ({ row }) => <BrandStatusBadge isActive={row.is_active !== false} />,
  },
  {
    id: "created_at",
    header: "Ngày tạo",
    sortKey: "created_at",
    width: "130px",
    className: "text-[13px] whitespace-nowrap text-muted-foreground tabular-nums",
    cell: ({ row }) => formatDate(row.created_at),
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
