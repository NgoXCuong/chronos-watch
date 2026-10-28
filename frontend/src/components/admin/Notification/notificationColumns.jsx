import {
  NotificationContentCell,
  NotificationOpenAction,
  NotificationStatusCell,
  NotificationTimeCell,
  NotificationTypeCell,
} from "./NotificationCells";

/**
 * Cột bảng thông báo admin — mọi cột có width (Rule 3). Nội dung là ô nhiều dòng
 * nên width lớn, các cột phụ cố định để bảng không bị co giãn lệch.
 */
export const getNotificationColumns = ({ onOpen } = {}) => [
  {
    id: "content",
    header: "Nội dung",
    width: "46%",
    cell: ({ row }) => <NotificationContentCell notification={row} />,
  },
  {
    id: "type",
    header: "Loại",
    width: "120px",
    cell: ({ row }) => <NotificationTypeCell type={row.type} />,
  },
  {
    id: "created_at",
    header: "Thời gian",
    width: "150px",
    cell: ({ row }) => <NotificationTimeCell value={row.created_at} />,
  },
  {
    id: "status",
    header: "Trạng thái",
    width: "110px",
    cell: ({ row }) => <NotificationStatusCell readAt={row.read_at} />,
  },
  {
    id: "actions",
    header: "Thao tác",
    align: "right",
    width: "90px",
    stopRowClick: true,
    cell: ({ row }) => (
      <NotificationOpenAction notification={row} onOpen={onOpen} />
    ),
  },
];
