import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, CheckCheck } from "lucide-react";
import { toast } from "sonner";
import notificationApi from "../../../api/notification.api";
import useDebounce from "../../../hooks/useDebounce";
import AdminHeader from "../../../components/admin/Common/AdminHeader";
import SearchBanner from "../../../components/admin/Common/SearchBanner";
import FilterSelect from "../../../components/admin/Common/FilterSelect";
import DataTable from "../../../components/ui/data-table";
import { Button } from "../../../components/ui/button";
import { getNotificationColumns } from "../../../components/admin/Notification/notificationColumns";
import {
  NOTIFICATION_READ_FILTER_OPTIONS,
  NOTIFICATION_TYPE_FILTER_OPTIONS,
} from "../../../constants/notificationTypes";
import { emitNotificationsChanged } from "../../../utils/notifications";

const PAGE_SIZE = 15;

// Hộp thư admin: xem toàn bộ thông báo (không giới hạn 15 mục như dropdown chuông),
// lọc theo loại/trạng thái, tìm kiếm và phân trang server-side.
const AdminNotificationsPage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [count, setCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [type, setType] = useState("");
  const [readState, setReadState] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 400);
  const isFirstQuery = useRef(true);

  const fetchList = useCallback(async () => {
    setLoading(true);
    try {
      const data = await notificationApi.list({
        page,
        limit: PAGE_SIZE,
        search: debouncedSearch || undefined,
        type: type || undefined,
        unread: readState === "unread" ? "1" : undefined,
        read: readState === "read" ? "1" : undefined,
      });
      setItems(Array.isArray(data?.items) ? data.items : []);
      setCount(Number(data?.total) || 0);
      setUnreadCount(Number(data?.unreadCount) || 0);
    } catch {
      toast.error("Không thể tải danh sách thông báo");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, type, readState]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  // Đổi bộ lọc/từ khóa → quay về trang 1 (bỏ qua lần chạy đầu tiên)
  useEffect(() => {
    if (isFirstQuery.current) {
      isFirstQuery.current = false;
      return;
    }
    setPage(1);
  }, [debouncedSearch, type, readState]);

  const markOneRead = async (notification) => {
    if (!notification?.read_at) {
      const now = new Date().toISOString();
      setItems((prev) =>
        prev.map((item) =>
          item.id === notification.id ? { ...item, read_at: now } : item,
        ),
      );
      setUnreadCount((value) => Math.max(0, value - 1));
    }
    try {
      if (!notification?.read_at) {
        await notificationApi.markRead(notification.id);
        emitNotificationsChanged();
      }
    } catch {
      toast.error("Không đánh dấu được thông báo đã đọc");
      fetchList();
    }
  };

  const openNotification = (notification) => {
    markOneRead(notification);
    if (notification?.link) navigate(notification.link);
  };

  const markAllRead = async () => {
    setMarkingAll(true);
    try {
      await notificationApi.markAllRead();
      const now = new Date().toISOString();
      setItems((prev) =>
        prev.map((item) => ({ ...item, read_at: item.read_at || now })),
      );
      setUnreadCount(0);
      emitNotificationsChanged();
      toast.success("Đã đánh dấu tất cả thông báo là đã đọc");
      // Đang lọc "Chưa đọc" thì danh sách phải trống sau khi đọc hết
      if (readState === "unread") {
        if (page === 1) fetchList();
        else setPage(1);
      }
    } catch {
      toast.error("Không đánh dấu được tất cả thông báo");
    } finally {
      setMarkingAll(false);
    }
  };

  const columns = getNotificationColumns({ onOpen: openNotification });
  const totalPages = Math.ceil(count / PAGE_SIZE);

  return (
    <div className="space-y-3 pb-8">
      <AdminHeader
        title="Thông báo"
        subtitle="Toàn bộ thông báo của tài khoản quản trị — tìm kiếm, lọc và đánh dấu đã đọc tại đây."
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={markAllRead}
            disabled={unreadCount === 0}
            loading={markingAll}
            className="h-9 gap-2"
          >
            <CheckCheck className="h-4 w-4" strokeWidth={2} />
            Đánh dấu tất cả đã đọc
          </Button>
        }
      />

      <SearchBanner
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        placeholder="Tìm theo tiêu đề hoặc nội dung thông báo..."
        onRefresh={fetchList}
        loading={loading}
        count={count}
        countLabel="thông báo"
      >
        <FilterSelect
          label="Loại"
          value={type}
          onChange={setType}
          options={NOTIFICATION_TYPE_FILTER_OPTIONS}
        />
        <FilterSelect
          label="Trạng thái"
          value={readState}
          onChange={setReadState}
          options={NOTIFICATION_READ_FILTER_OPTIONS}
        />
      </SearchBanner>

      <DataTable
        columns={columns}
        data={items}
        loading={loading}
        onRowClick={openNotification}
        emptyMessage="Không có thông báo phù hợp với bộ lọc"
        emptyIcon={Bell}
        pagination={{
          currentPage: page,
          totalPages,
          totalCount: count,
          countLabel: "thông báo",
          onPageChange: setPage,
        }}
      />
    </div>
  );
};

export default AdminNotificationsPage;
