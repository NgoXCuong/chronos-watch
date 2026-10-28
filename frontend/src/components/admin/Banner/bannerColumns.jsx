import { formatDate } from "../../../utils/formatCurrency";
import {
  BannerInfoCell,
  BannerLinkCell,
  BannerOrderCell,
  BannerScheduleCell,
  BannerStatusBadge,
} from "./BannerCells";
import { BannerRowActions } from "./BannerRowActions";

// Cột bảng banner — mọi cột khai báo width (Rule 3); sortKey là cột backend nhận
// trong SORTABLE_BANNER_COLUMNS. now do trang tính một lần để badge lịch ổn định.
export const getBannerColumns = ({ now, onEdit, onToggle, onDelete } = {}) => [
  {
    id: "title",
    header: "Banner",
    sortKey: "title",
    width: "320px",
    cell: ({ row }) => <BannerInfoCell banner={row} />,
  },
  {
    id: "link_url",
    header: "Link CTA",
    width: "160px",
    cell: ({ row }) => <BannerLinkCell value={row.link_url} />,
  },
  {
    id: "sort_order",
    header: "Thứ tự",
    sortKey: "sort_order",
    align: "center",
    width: "100px",
    cell: ({ row }) => <BannerOrderCell value={row.sort_order} />,
  },
  {
    id: "schedule",
    header: "Hiệu lực",
    sortKey: "start_date",
    width: "190px",
    cell: ({ row }) => <BannerScheduleCell banner={row} now={now} />,
  },
  {
    id: "is_active",
    header: "Trạng thái",
    width: "130px",
    cell: ({ row }) => <BannerStatusBadge isActive={row.is_active !== false} />,
  },
  {
    id: "created_at",
    header: "Ngày tạo",
    sortKey: "created_at",
    width: "120px",
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
      <BannerRowActions
        banner={row}
        onEdit={onEdit}
        onToggle={onToggle}
        onDelete={onDelete}
      />
    ),
  },
];
