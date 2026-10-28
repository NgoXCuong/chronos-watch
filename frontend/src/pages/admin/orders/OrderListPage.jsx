import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { Download, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../../../components/ui/button";
import adminApi from "../../../api/admin.api";
import useDebounce from "../../../hooks/useDebounce";
import AdminHeader from "../../../components/admin/Common/AdminHeader";
import SearchBanner from "../../../components/admin/Common/SearchBanner";
import OrderTable from "../../../components/admin/Order/OrderTable";
import OrderStatusFilter from "../../../components/admin/Order/OrderStatusFilter";
import { statusLabel } from "../../../constants/orderStatus";

const PAGE_SIZE = 10;
const DEFAULT_SORT = { key: "created_at", dir: "desc" };

const toExportRow = (order) => ({
  "Mã đơn": order.order_code || `#${order.id}`,
  "Khách hàng":
    order.full_name ||
    order.user?.full_name ||
    order.user?.username ||
    "Khách vãng lai",
  Email: order.user?.email || "N/A",
  "Số điện thoại": order.phone_number || "N/A",
  "Ngày đặt": new Date(order.created_at).toLocaleString("vi-VN"),
  "Tổng tiền": order.total_amount,
  "Phương thức": (order.payment_method || "cod").toUpperCase(),
  "Trạng thái": statusLabel(order.status),
});

const writeExcel = (orders, label) => {
  if (orders.length === 0) {
    toast.error("Không có dữ liệu để xuất");
    return;
  }
  const sheet = XLSX.utils.json_to_sheet(orders.map(toExportRow));
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, "Orders");
  XLSX.writeFile(
    workbook,
    `Chronos_Orders_${new Date().toISOString().split("T")[0]}.xlsx`,
  );
  toast.success(`Đã xuất ${orders.length} ${label} ra file Excel`);
};

const OrderListPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [sort, setSort] = useState(DEFAULT_SORT);
  const [selectedIds, setSelectedIds] = useState([]);
  const debouncedSearch = useDebounce(searchTerm, 400);

  // Bản ghi đã thấy — xuất đúng danh sách chọn dù đơn nằm ở trang khác
  const rowsById = useRef(new Map());
  const isFirstQuery = useRef(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getAllOrders({
        search: debouncedSearch,
        status: filterStatus,
        page: currentPage,
        limit: PAGE_SIZE,
        sort: sort.key,
        dir: sort.dir,
      });
      const rows = data.rows || [];
      rows.forEach((row) => rowsById.current.set(row.id, row));
      setOrders(rows);
      setTotalCount(data.count || 0);
    } catch {
      toast.error("Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFirstQuery.current) {
      isFirstQuery.current = false;
      return;
    }
    setCurrentPage(1);
  }, [debouncedSearch, filterStatus, sort]);

  useEffect(() => {
    fetchOrders();
  }, [currentPage, debouncedSearch, filterStatus, sort]);

  const handleStatusUpdate = async (orderId, status) => {
    setUpdatingId(orderId);
    try {
      await adminApi.updateOrderStatus(orderId, status);
      toast.success(`Đã cập nhật trạng thái: ${statusLabel(status)}`);
      fetchOrders();
    } catch (error) {
      toast.error(error?.message || "Không thể cập nhật trạng thái");
    } finally {
      setUpdatingId(null);
    }
  };

  const selectedRows = selectedIds
    .map((id) => rowsById.current.get(id))
    .filter(Boolean);

  return (
    <div className="space-y-3 pb-8">
      <AdminHeader
        title="Quản lý Đơn hàng"
        subtitle="Theo dõi và xử lý vận hành giao hàng"
        actions={
          <Button
            onClick={() => writeExcel(orders, "đơn trong trang")}
            className="h-9 gap-2 rounded-lg px-4 text-[13px]"
          >
            <FileSpreadsheet className="h-4 w-4" strokeWidth={2} />
            Xuất Excel
          </Button>
        }
      />

      <SearchBanner
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        placeholder="Tìm theo mã đơn, khách hàng, email..."
        onRefresh={fetchOrders}
        loading={loading}
        count={totalCount}
        countLabel="đơn hàng"
      >
        <OrderStatusFilter
          activeStatus={filterStatus}
          onStatusChange={setFilterStatus}
        />
      </SearchBanner>

      <OrderTable
        orders={orders}
        loading={loading}
        onStatusUpdate={handleStatusUpdate}
        onView={(id) => navigate(`/admin/orders/${id}`)}
        updatingId={updatingId}
        sort={sort}
        onSortChange={setSort}
        selectedRowKeys={selectedIds}
        onSelectionChange={setSelectedIds}
        selectionActions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => writeExcel(selectedRows, "đơn đã chọn")}
            className="h-7 gap-1.5 rounded-md border-border text-[11px] font-semibold text-navy-700 hover:bg-navy-50 dark:text-navy-100 dark:hover:bg-navy-500/15"
          >
            <Download className="h-3.5 w-3.5" strokeWidth={2} />
            Xuất {selectedRows.length} đơn đã chọn
          </Button>
        }
        pagination={{
          currentPage,
          totalPages: Math.ceil(totalCount / PAGE_SIZE),
          totalCount,
          countLabel: "đơn hàng",
          onPageChange: (page) => setCurrentPage(page),
        }}
      />
    </div>
  );
};

export default OrderListPage;
