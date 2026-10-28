import {
  formatCurrency,
  formatDate,
} from "../../../utils/formatCurrency";
import {
  ProductBrandCell,
  ProductCategoriesCell,
  ProductInfoCell,
  ProductStatusBadge,
  ProductStockCell,
} from "./ProductCells";
import { ProductRowActions } from "./ProductRowActions";

// Định nghĩa cột sản phẩm — trang dùng lại mảng này cho menu "Cột" (Rule 3)
export const getProductColumns = ({
  onView,
  onEdit,
  onDelete,
} = {}) => [
  {
    id: "name",
    header: "Sản phẩm",
    sortKey: "name",
    width: "320px",
    cell: ({ row }) => <ProductInfoCell product={row} />,
  },
  {
    id: "brand",
    header: "Thương hiệu",
    width: "150px",
    cell: ({ row }) => <ProductBrandCell brand={row.brand} />,
  },
  {
    id: "categories",
    header: "Danh mục",
    width: "220px",
    cell: ({ row }) => <ProductCategoriesCell categories={row.categories} />,
  },
  {
    id: "price",
    header: "Giá bán",
    sortKey: "price",
    align: "right",
    width: "150px",
    className:
      "text-[13px] font-bold text-navy-700 tabular-nums dark:text-navy-100",
    cell: ({ row }) => formatCurrency(row.price),
  },
  {
    id: "stock",
    header: "Kho",
    sortKey: "stock",
    align: "center",
    width: "100px",
    cell: ({ row }) => <ProductStockCell stock={row.stock} />,
  },
  {
    id: "status",
    header: "Trạng thái",
    sortKey: "status",
    width: "150px",
    cell: ({ row }) => <ProductStatusBadge status={row.status} />,
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
    width: "110px",
    stopRowClick: true,
    cell: ({ row }) => (
      <ProductRowActions
        product={row}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    ),
  },
];
