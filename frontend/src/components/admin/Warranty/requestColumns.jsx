import { MessageSquareReply } from "lucide-react";
import { Button } from "../../ui/button";
import { cn } from "@/lib/utils";
import {
  RequestCustomerCell,
  RequestDateCell,
  RequestIssueCell,
  RequestStatusBadge,
  RequestWarrantyCell,
} from "./RequestCells";

/**
 * Cột bảng yêu cầu bảo hành — width cho mọi cột (Rule 3), sortKey theo
 * SORTABLE_REQUEST_COLUMNS (created_at, status, replied_at): cột của phiếu
 * cha không sort ở đây vì JOIN one-to-many làm lệch phân trang.
 */
export const getRequestColumns = ({ onReply } = {}) => [
  {
    id: "warranty",
    header: "Phiếu / sản phẩm",
    width: "230px",
    cell: ({ row }) => <RequestWarrantyCell row={row} />,
  },
  {
    id: "customer",
    header: "Khách hàng",
    width: "190px",
    cell: ({ row }) => <RequestCustomerCell row={row} />,
  },
  {
    id: "issue",
    header: "Mô tả yêu cầu",
    width: "300px",
    cell: ({ row }) => <RequestIssueCell row={row} />,
  },
  {
    id: "status",
    header: "Trạng thái",
    sortKey: "status",
    width: "150px",
    cell: ({ row }) => <RequestStatusBadge status={row.status} />,
  },
  {
    id: "created_at",
    header: "Ngày gửi",
    sortKey: "created_at",
    width: "150px",
    cell: ({ row }) => <RequestDateCell row={row} />,
  },
  {
    id: "actions",
    header: "Thao tác",
    align: "right",
    width: "120px",
    stopRowClick: true,
    cell: ({ row }) => (
      <Button
        variant="outline"
        size="sm"
        onClick={() => onReply?.(row)}
        aria-label={`Trả lời yêu cầu ${row.id}`}
        className={cn(
          "h-8 gap-1.5 rounded-lg border-border text-[11px] font-semibold",
          "text-navy-700 hover:bg-navy-50 hover:text-navy-800 dark:text-navy-100 dark:hover:bg-navy-500/15",
        )}
      >
        <MessageSquareReply className="h-3.5 w-3.5" strokeWidth={2} />
        Trả lời
      </Button>
    ),
  },
];
