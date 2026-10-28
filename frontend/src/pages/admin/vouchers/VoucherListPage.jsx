import { useEffect, useRef, useState } from "react";
import { Plus, Power, PowerOff, Trash2 } from "lucide-react";
import { toast } from "sonner";
import voucherApi from "../../../api/voucher.api";
import useDebounce from "../../../hooks/useDebounce";
import useBulkSelection from "../../../hooks/useBulkSelection";
import AdminHeader from "../../../components/admin/Common/AdminHeader";
import SearchBanner from "../../../components/admin/Common/SearchBanner";
import SelectionActions from "../../../components/admin/Common/SelectionActions";
import FilterSelect from "../../../components/admin/Common/FilterSelect";
import VoucherTable from "../../../components/admin/Voucher/VoucherTable";
import VoucherFormModal from "../../../components/admin/Voucher/VoucherFormModal";
import { Button } from "../../../components/ui/button";
import {
  STATUS_FILTER_OPTIONS,
  TYPE_FILTER_OPTIONS,
  WINDOW_FILTER_OPTIONS,
} from "../../../constants/voucherForm";

const PAGE_SIZE = 10;
const DEFAULT_SORT = { key: "created_at", dir: "desc" };
const BULK_ICON = "h-3.5 w-3.5";

const VoucherListPage = () => {
  const [vouchers, setVouchers] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [timeWindow, setTimeWindow] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState(DEFAULT_SORT);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState(null);
  const [saving, setSaving] = useState(false);
  const debouncedSearch = useDebounce(searchTerm, 400);
  // Mốc "bây giờ" tính một lần cho cả trang: badge trạng thái và ô lọc khớp nhau
  const [now] = useState(() => new Date());
  const isFirstQuery = useRef(true);

  const fetchVouchers = async () => {
    setLoading(true);
    try {
      const data = await voucherApi.getAll({
        search: debouncedSearch,
        discount_type: type,
        status,
        window: timeWindow,
        page: currentPage,
        limit: PAGE_SIZE,
        sort: sort.key,
        dir: sort.dir,
      });
      setVouchers(data.rows || []);
      setCount(data.count || 0);
    } catch {
      toast.error("Không thể tải danh sách mã giảm giá");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, [currentPage, debouncedSearch, type, status, timeWindow, sort]);

  useEffect(() => {
    if (isFirstQuery.current) {
      isFirstQuery.current = false;
      return;
    }
    setCurrentPage(1);
  }, [debouncedSearch, type, status, timeWindow, sort]);

  const openCreate = () => {
    setEditingVoucher(null);
    setModalOpen(true);
  };

  const openEdit = (voucher) => {
    setEditingVoucher(voucher);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingVoucher(null);
  };

  const handleSubmit = async (payload) => {
    setSaving(true);
    try {
      if (editingVoucher) {
        await voucherApi.update(editingVoucher.id, payload);
        toast.success("Cập nhật voucher thành công!");
      } else {
        await voucherApi.create(payload);
        toast.success("Tạo voucher thành công!");
      }
      closeModal();
      fetchVouchers();
    } catch (err) {
      toast.error(err?.message || "Có lỗi xảy ra khi lưu voucher");
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (voucher) => {
    const next = voucher.status === "active" ? "inactive" : "active";
    try {
      await voucherApi.toggleStatus(voucher.id, next);
      toast.success(
        next === "active" ? "Đã bật mã giảm giá" : "Đã tạm ngưng mã giảm giá",
      );
      fetchVouchers();
    } catch (err) {
      toast.error(err?.message || "Không đổi được trạng thái");
    }
  };

  const handleDelete = async (voucher) => {
    if (
      !window.confirm(
        `Xóa mã voucher "${voucher.code}"? Lịch sử đã dùng vẫn còn, nhưng khách sẽ không nhập lại mã này được.`,
      )
    )
      return;
    try {
      await voucherApi.delete(voucher.id);
      toast.success("Đã xóa voucher");
      // Xóa dòng cuối của trang thì lùi về trang trước để không thành trang trống
      if (vouchers.length === 1 && currentPage > 1)
        setCurrentPage((page) => page - 1);
      else fetchVouchers();
    } catch (err) {
      toast.error(err?.message || "Không xóa được voucher");
    }
  };

  const bulk = useBulkSelection({
    rows: vouchers,
    label: "mã giảm giá",
    onDone: fetchVouchers,
  });

  const bulkActions = [
    {
      key: "active",
      label: "Cho dùng lại",
      icon: <Power className={BULK_ICON} strokeWidth={2} />,
      onClick: () => bulk.run((ids) => voucherApi.bulkSetStatus(ids, "active")),
    },
    {
      key: "inactive",
      label: "Tạm ngưng",
      icon: <PowerOff className={BULK_ICON} strokeWidth={2} />,
      onClick: () =>
        bulk.run((ids) => voucherApi.bulkSetStatus(ids, "inactive")),
    },
    {
      key: "delete",
      label: "Xóa đã chọn",
      variant: "destructive",
      icon: <Trash2 className={BULK_ICON} strokeWidth={2} />,
      onClick: () =>
        bulk.run(
          (ids) => voucherApi.bulkDelete(ids),
          `Xóa vĩnh viễn ${bulk.selectedIds.length} mã giảm giá? Mã đã dùng vẫn còn lịch sử trong đơn hàng.`,
        ),
    },
  ];

  return (
    <div className="space-y-3 pb-8">
      <AdminHeader
        title="Quản lý mã giảm giá"
        subtitle="Chương trình ưu đãi và voucher khuyến mãi"
        actions={
          <Button
            onClick={openCreate}
            className="h-9 gap-2 rounded-lg px-4 text-[13px] font-semibold"
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
            Tạo voucher mới
          </Button>
        }
      />

      <SearchBanner
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        placeholder="Tìm theo mã voucher..."
        onRefresh={fetchVouchers}
        loading={loading}
        count={count}
        countLabel="voucher"
      >
        <FilterSelect
          label="Loại"
          value={type}
          onChange={setType}
          options={TYPE_FILTER_OPTIONS}
        />
        <FilterSelect
          label="Hiệu lực"
          value={timeWindow}
          onChange={setTimeWindow}
          options={WINDOW_FILTER_OPTIONS}
        />
        <FilterSelect
          label="Trạng thái"
          value={status}
          onChange={setStatus}
          options={STATUS_FILTER_OPTIONS}
        />
      </SearchBanner>

      <VoucherTable
        vouchers={vouchers}
        now={now}
        loading={loading}
        searchTerm={searchTerm}
        sort={sort}
        onSortChange={setSort}
        onEdit={openEdit}
        onToggle={handleToggle}
        onDelete={handleDelete}
        selectedRowKeys={bulk.selectedIds}
        onSelectionChange={bulk.setSelectedIds}
        selectionActions={
          <SelectionActions busy={bulk.busy} actions={bulkActions} />
        }
        pagination={{
          currentPage,
          totalPages: Math.ceil(count / PAGE_SIZE),
          totalCount: count,
          countLabel: "voucher",
          onPageChange: (page) => setCurrentPage(page),
        }}
      />

      <VoucherFormModal
        open={modalOpen}
        voucher={editingVoucher}
        saving={saving}
        onSubmit={handleSubmit}
        onClose={closeModal}
      />
    </div>
  );
};

export default VoucherListPage;
