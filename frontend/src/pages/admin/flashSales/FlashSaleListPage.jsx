import { useState } from "react";
import { Plus, Power, PowerOff, Trash2 } from "lucide-react";
import { toast } from "sonner";
import flashSaleApi from "../../../api/flashSale.api";
import useFlashSales from "../../../hooks/useFlashSales";
import useBulkSelection from "../../../hooks/useBulkSelection";
import AdminHeader from "../../../components/admin/Common/AdminHeader";
import SearchBanner from "../../../components/admin/Common/SearchBanner";
import SelectionActions from "../../../components/admin/Common/SelectionActions";
import FilterSelect from "../../../components/admin/Common/FilterSelect";
import FlashSaleTable from "../../../components/admin/FlashSale/FlashSaleTable";
import FlashSaleKpis from "../../../components/admin/FlashSale/FlashSaleKpis";
import FlashSaleFormModal from "../../../components/admin/FlashSale/FlashSaleFormModal";
import { Button } from "../../../components/ui/button";
import {
  STATE_FILTER_OPTIONS,
  STATUS_FILTER_OPTIONS,
} from "../../../constants/flashSale";

const BULK_ICON = "h-3.5 w-3.5";

const FlashSaleListPage = () => {
  // Search/lọc/sort/phân trang + /stats đều đi qua hook (state để ở backend)
  const {
    flashSales,
    total,
    stats,
    loading,
    search,
    setSearch,
    state,
    setState,
    status,
    setStatus,
    page,
    setPage,
    sort,
    setSort,
    totalPages,
    refresh,
    afterDelete,
  } = useFlashSales();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingSale, setEditingSale] = useState(null);
  const [saving, setSaving] = useState(false);

  const openCreate = () => {
    setEditingSale(null);
    setModalOpen(true);
  };

  const openEdit = (sale) => {
    setEditingSale(sale);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingSale(null);
  };

  const handleSubmit = async (payload) => {
    setSaving(true);
    try {
      const data = editingSale
        ? await flashSaleApi.update(editingSale.id, payload)
        : await flashSaleApi.create(payload);
      toast.success(data?.message || "Đã lưu đợt Flash Sale");
      closeModal();
      refresh();
    } catch (err) {
      toast.error(err?.message || "Có lỗi xảy ra khi lưu đợt Flash Sale");
    } finally {
      setSaving(false);
    }
  };

  // PATCH /admin/flash-sales/:id/status là SET giá trị, không phải toggle ở backend
  const handleToggle = async (sale) => {
    const next = sale.status === "active" ? "inactive" : "active";
    try {
      const data = await flashSaleApi.setStatus(sale.id, next);
      toast.success(
        data?.message || (next === "active" ? "Đã bật đợt" : "Đã tắt đợt"),
      );
      refresh();
    } catch (err) {
      toast.error(err?.message || "Không đổi được trạng thái đợt");
    }
  };

  const handleDelete = async (sale) => {
    if (
      !window.confirm(
        `Xóa đợt "${sale.name}"? Toàn bộ dòng ưu đãi của đợt bị gỡ; giá Flash đã áp trong đơn hàng cũ vẫn còn snapshot. Hành động này không hoàn tác.`,
      )
    )
      return;
    try {
      const data = await flashSaleApi.delete(sale.id);
      toast.success(data?.message || "Đã xóa đợt Flash Sale");
      afterDelete();
    } catch (err) {
      toast.error(err?.message || "Không xóa được đợt Flash Sale");
    }
  };

  const bulk = useBulkSelection({
    rows: flashSales,
    label: "đợt Flash Sale",
    onDone: refresh,
  });

  // Mọi bulk là SET (PATCH /status/bulk), xóa hẳn qua DELETE /bulk có reason từng dòng
  const bulkActions = [
    {
      key: "active",
      label: "Bật đã chọn",
      icon: <Power className={BULK_ICON} strokeWidth={2} />,
      onClick: () =>
        bulk.run((ids) => flashSaleApi.bulkSetStatus(ids, "active")),
    },
    {
      key: "inactive",
      label: "Tắt đã chọn",
      icon: <PowerOff className={BULK_ICON} strokeWidth={2} />,
      onClick: () =>
        bulk.run((ids) => flashSaleApi.bulkSetStatus(ids, "inactive")),
    },
    {
      key: "delete",
      label: "Xóa đã chọn",
      variant: "destructive",
      icon: <Trash2 className={BULK_ICON} strokeWidth={2} />,
      onClick: () =>
        bulk.run(
          (ids) => flashSaleApi.bulkDelete(ids),
          `Xóa vĩnh viễn ${bulk.selectedIds.length} đợt Flash Sale? Danh sách sản phẩm ưu đãi của các đợt đó sẽ bị gỡ theo.`,
        ),
    },
  ];

  return (
    <div className="space-y-3 pb-8">
      <AdminHeader
        title="Quản lý Flash Sale"
        subtitle="Cấu hình đợt giảm giá chớp nhoáng và thời gian áp dụng"
        actions={
          <Button
            onClick={openCreate}
            className="h-9 gap-2 rounded-lg px-4 text-[13px] font-semibold"
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
            Tạo đợt Flash Sale
          </Button>
        }
      />

      <FlashSaleKpis stats={stats} loading={loading && !stats} />

      <SearchBanner
        searchTerm={search}
        setSearchTerm={setSearch}
        placeholder="Tìm theo tên đợt..."
        onRefresh={refresh}
        loading={loading}
        count={total}
        countLabel="đợt"
      >
        <FilterSelect
          label="Trạng thái"
          value={state}
          onChange={setState}
          options={STATE_FILTER_OPTIONS}
        />
        <FilterSelect
          label="Cấu hình"
          value={status}
          onChange={setStatus}
          options={STATUS_FILTER_OPTIONS}
        />
      </SearchBanner>

      <FlashSaleTable
        flashSales={flashSales}
        loading={loading}
        searchTerm={search}
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
          currentPage: page,
          totalPages,
          totalCount: total,
          countLabel: "đợt",
          onPageChange: setPage,
        }}
      />

      <p className="text-[11px] text-muted-foreground">
        Trạng thái trên bảng (Đang chạy / Sắp chạy / Hết hạn / Cháy hàng / Đang
        tắt) do server suy ra từ lịch và suất đã bán, không phải cột cấu hình —
        bật/tắt chỉ đổi <span className="font-mono">status</span>.
      </p>

      <FlashSaleFormModal
        open={modalOpen}
        sale={editingSale}
        saving={saving}
        onSubmit={handleSubmit}
        onClose={closeModal}
      />
    </div>
  );
};

export default FlashSaleListPage;
