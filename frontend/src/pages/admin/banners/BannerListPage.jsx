import { useEffect, useMemo, useRef, useState } from "react";
import { Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import bannerApi from "../../../api/banner.api";
import useDebounce from "../../../hooks/useDebounce";
import useBulkSelection from "../../../hooks/useBulkSelection";
import AdminHeader from "../../../components/admin/Common/AdminHeader";
import SearchBanner from "../../../components/admin/Common/SearchBanner";
import SelectionActions from "../../../components/admin/Common/SelectionActions";
import FilterSelect from "../../../components/admin/Common/FilterSelect";
import BannerTable from "../../../components/admin/Banner/BannerTable";
import BannerFormModal from "../../../components/admin/Banner/BannerFormModal";
import { Button } from "../../../components/ui/button";
import {
  SCHEDULE_FILTER_OPTIONS,
  VISIBILITY_FILTER_OPTIONS,
} from "../../../constants/bannerForm";

const PAGE_SIZE = 10;
const DEFAULT_SORT = { key: "sort_order", dir: "asc" };
const BULK_ICON = "h-3.5 w-3.5";

const BannerListPage = () => {
  const [banners, setBanners] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibility, setVisibility] = useState("");
  const [schedule, setSchedule] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState(DEFAULT_SORT);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [saving, setSaving] = useState(false);
  const debouncedSearch = useDebounce(searchTerm, 400);
  // Mốc "bây giờ" tính một lần cho cả trang: badge lịch trong bảng và ô lọc phải
  // khớp nhau, không lệch nhau vì re-render
  const [now] = useState(() => new Date());
  const isFirstQuery = useRef(true);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const data = await bannerApi.getAll({
        search: debouncedSearch,
        is_active: visibility,
        schedule,
        page: currentPage,
        limit: PAGE_SIZE,
        sort: sort.key,
        dir: sort.dir,
      });
      setBanners(data.rows || []);
      setCount(data.count || 0);
    } catch {
      toast.error("Không thể tải danh sách banner");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, [currentPage, debouncedSearch, visibility, schedule, sort]);

  useEffect(() => {
    if (isFirstQuery.current) {
      isFirstQuery.current = false;
      return;
    }
    setCurrentPage(1);
  }, [debouncedSearch, visibility, schedule, sort]);

  const openCreate = () => {
    setEditingBanner(null);
    setModalOpen(true);
  };

  const openEdit = (banner) => {
    setEditingBanner(banner);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingBanner(null);
  };

  const handleSubmit = async (formData) => {
    setSaving(true);
    try {
      if (editingBanner) {
        await bannerApi.update(editingBanner.id, formData);
        toast.success("Cập nhật banner thành công!");
      } else {
        await bannerApi.create(formData);
        toast.success("Thêm banner thành công!");
      }
      closeModal();
      fetchBanners();
    } catch (err) {
      toast.error(err?.message || "Có lỗi xảy ra khi lưu banner");
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (banner) => {
    try {
      await bannerApi.toggleStatus(banner.id);
      toast.success(
        banner.is_active === false
          ? "Đã bật banner"
          : "Đã ẩn banner khỏi trang chủ",
      );
      fetchBanners();
    } catch (err) {
      toast.error(err?.message || "Không đổi được trạng thái");
    }
  };

  const handleDelete = async (banner) => {
    if (
      !window.confirm(
        `Xóa banner "${banner.title}"? Hành động này không hoàn tác.`,
      )
    )
      return;
    try {
      await bannerApi.delete(banner.id);
      toast.success("Đã xóa banner");
      // Xóa dòng cuối của trang thì lùi về trang trước để không thành trang trống
      if (banners.length === 1 && currentPage > 1)
        setCurrentPage((page) => page - 1);
      else fetchBanners();
    } catch (err) {
      toast.error(err?.message || "Không xóa được banner");
    }
  };

  const bulk = useBulkSelection({
    rows: banners,
    label: "banner",
    onDone: fetchBanners,
  });

  const bulkActions = [
    {
      key: "show",
      label: "Bật đã chọn",
      icon: <Eye className={BULK_ICON} strokeWidth={2} />,
      onClick: () => bulk.run((ids) => bannerApi.bulkSetVisibility(ids, true)),
    },
    {
      key: "hide",
      label: "Tắt đã chọn",
      icon: <EyeOff className={BULK_ICON} strokeWidth={2} />,
      onClick: () => bulk.run((ids) => bannerApi.bulkSetVisibility(ids, false)),
    },
    {
      key: "delete",
      label: "Xóa đã chọn",
      variant: "destructive",
      icon: <Trash2 className={BULK_ICON} strokeWidth={2} />,
      onClick: () =>
        bulk.run(
          (ids) => bannerApi.bulkDelete(ids),
          `Xóa vĩnh viễn ${bulk.selectedIds.length} banner? Hành động này không hoàn tác.`,
        ),
    },
  ];

  const upcomingCount = useMemo(
    () =>
      banners.filter(
        (banner) => banner.start_date && new Date(banner.start_date) > now,
      ).length,
    [banners, now],
  );

  return (
    <div className="space-y-3 pb-8">
      <AdminHeader
        title="Quản lý banner trang chủ"
        subtitle="Hình ảnh quảng cáo và slider hiển thị tại trang chủ"
        actions={
          <Button
            onClick={openCreate}
            className="h-9 gap-2 rounded-lg px-4 text-[13px] font-semibold"
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
            Thêm banner mới
          </Button>
        }
      />

      <SearchBanner
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        placeholder="Tìm theo tiêu đề, nhãn hoặc link CTA..."
        onRefresh={fetchBanners}
        loading={loading}
        count={count}
        countLabel="banner"
      >
        <FilterSelect
          label="Trạng thái"
          value={visibility}
          onChange={setVisibility}
          options={VISIBILITY_FILTER_OPTIONS}
        />
        <FilterSelect
          label="Lịch hiển thị"
          value={schedule}
          onChange={setSchedule}
          options={SCHEDULE_FILTER_OPTIONS}
        />
      </SearchBanner>

      <BannerTable
        banners={banners}
        now={now}
        loading={loading}
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
          countLabel: "banner",
          onPageChange: (page) => setCurrentPage(page),
        }}
      />

      {upcomingCount > 0 && (
        <p className="text-[11px] text-muted-foreground">
          {upcomingCount} banner trong trang này sẽ tự chạy từ mốc thời gian đã
          đặt — chưa tới lịch nên hero slider chưa hiển thị.
        </p>
      )}

      <BannerFormModal
        open={modalOpen}
        banner={editingBanner}
        saving={saving}
        onSubmit={handleSubmit}
        onClose={closeModal}
      />
    </div>
  );
};

export default BannerListPage;
