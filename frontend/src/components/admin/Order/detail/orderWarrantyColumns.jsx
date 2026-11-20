import { Pencil } from "lucide-react";
import { Button } from "../../../ui/button";

export const getOrderWarrantyColumns = (onEdit) => [
  { id: "product", header: "Sản phẩm / SKU", width: "260px", cell: ({ row }) => (
    <div><p>{row.product_name}</p><p className="break-all font-mono text-xs text-muted-foreground">{row.sku || "Chưa cấp SKU"}</p></div>
  ) },
  { accessorKey: "code", header: "Mã phiếu", width: "200px" },
  { id: "actions", header: "Cập nhật", width: "80px", stopRowClick: true, cell: ({ row }) => (
    <Button variant="ghost" size="icon" aria-label={`Cập nhật phiếu ${row.code}`} onClick={() => onEdit(row)}>
      <Pencil className="h-4 w-4" />
    </Button>
  ) },
];
