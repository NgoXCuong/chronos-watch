import { useEffect, useRef, useState } from "react";
import { Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import brandApi from "../../../api/brand.api";
import useDebounce from "../../../hooks/useDebounce";
import useBulkSelection from "../../../hooks/useBulkSelection";
import AdminHeader from "../../../components/admin/Common/AdminHeader";
import SearchBanner from "../../../components/admin/Common/SearchBanner";
import SelectionActions from "../../../components/admin/Common/SelectionActions";
import FilterSelect from "../../../components/admin/Common/FilterSelect";
import BrandTable from "../../../components/admin/Brand/BrandTable";
import BrandFormModal from "../../../components/admin/Brand/BrandFormModal";
import { Button } from "../../../components/ui/button";
import { VISIBILITY_FILTER_OPTIONS } from "../../../constants/taxonomyForm";

const PAGE_SIZE = 10;
const DEFAULT_SORT = { key: "name", dir: "asc" };
const BULK_ICON = "h-3.5 w-3.5";

const BrandListPage = () => {
  const [brands, setBrands] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibility, setVisibility] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState(DEFAULT_SORT);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [saving, setSaving] = useState(false);
  const debouncedSearch = useDebounce(searchTerm, 400);
  const isFirstQuery = useRef(true);

  const fetchBrands = async () => {
    setLoading(true);
    try {
      // all=true: trang quản trị cần thấy cả thương hiệu đang ẩn để bật lại
      const data = await brandApi.getAll({
        all: true,
        search: debouncedSearch,
        is_active: visibility,
        page: currentPage,
        limit: PAGE_SIZE,
        sort: sort.key,
        dir: sort.dir,
      });
      setBrands(data.rows || []);
      setCount(data.count || 0);
    } catch {
      toast.error("Không thể tải danh sách thương hiệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, [currentPage, debouncedSearch, visibility, sort]);

  useEffect(() => {
    if (isFirstQuery.current) {
      isFirstQuery.current = false;
      return;
    }
    setCurrentPage(1);
  }, [debouncedSearch, visibility, sort]);

  const openCreate = () => {
    setEditingBrand(null);
    setModalOpen(true);
  };

  const openEdit = (brand) => {
    setEditingBrand(brand);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingBrand(null);
  };

  const handleSubmit = async (formData) => {
    setSaving(true);
    try {
      if (editingBrand) {
        await brandApi.update(editingBrand.id, formData);
        toast.success("Cập nhật thương hiệu thành công!");
      } else {
        await brandApi.create(formData);
        toast.success("Thêm thương hiệu thành công!");
      }
      closeModal();
      fetchBrands();
    } catch (err) {
      toast.error(err?.message || "Có lỗi xảy ra khi lưu thương hiệu");
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (brand) => {
    try {
      await brandApi.toggleStatus(brand.id);
      toast.success(
        brand.is_active ? "Đã ẩn thương hiệu" : "Đã cho hiển thị lại",
      );
      fetchBrands();
    } catch (err) {
      toast.error(err?.message || "Không đổi được trạng thái");
    }
  };

  const handleDelete = async (brand) => {
    if (
      !window.confirm(
        `Xóa thương hiệu "${brand.name}"? Hành động này không hoàn tác.`,
      )
    )
      return;
    try {
      await brandApi.delete(brand.id);
      toast.success("Đã xóa thương hiệu");
      // Xóa dòng cuối của trang thì lùi về trang trước để không thành trang trống
      if (brands.length === 1 && currentPage > 1)
        setCurrentPage((page) => page - 1);
      else fetchBrands();
    } catch (err) {
      toast.error(
        err?.message || "Không xóa được (thương hiệu đang có sản phẩm)",
      );
    }
  };

  const bulk = useBulkSelection({
    rows: brands,
    label: "thương hiệu",
    onDone: fetchBrands,
  });

  const bulkActions = [
    {
      key: "show",
      label: "Cho hiển thị",
      icon: <Eye className={BULK_ICON} strokeWidth={2} />,
      onClick: () => bulk.run((ids) => brandApi.bulkSetVisibility(ids, true)),
    },
    {
      key: "hide",
      label: "Ẩn",
      icon: <EyeOff className={BULK_ICON} strokeWidth={2} />,
      onClick: () => bulk.run((ids) => brandApi.bulkSetVisibility(ids, false)),
    },
    {
      key: "delete",
      label: "Xóa đã chọn",
      variant: "destructive",
      icon: <Trash2 className={BULK_ICON} strokeWidth={2} />,
      onClick: () =>
        bulk.run(
          (ids) => brandApi.bulkDelete(ids),
          `Xóa vĩnh viễn ${bulk.selectedIds.length} thương hiệu? Hành động này không hoàn tác.`,
        ),
    },
  ];

  return (
    <div className="space-y-3 pb-8">
      <AdminHeader
        title="Quản lý thương hiệu"
        subtitle="Thông tin và danh mục các hãng đồng hồ"
        actions={
          <Button
            onClick={openCreate}
            className="h-9 gap-2 rounded-lg px-4 text-[13px] font-semibold"
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
            Thêm thương hiệu mới
          </Button>
        }
      />

      <SearchBanner
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        placeholder="Tìm theo tên, đường dẫn hoặc quốc gia..."
        onRefresh={fetchBrands}
        loading={loading}
        count={count}
        countLabel="thương hiệu"
      >
        <FilterSelect
          label="Trạng thái"
          value={visibility}
          onChange={setVisibility}
          options={VISIBILITY_FILTER_OPTIONS}
        />
      </SearchBanner>

      <BrandTable
        brands={brands}
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
          countLabel: "thương hiệu",
          onPageChange: (page) => setCurrentPage(page),
        }}
      />

      <BrandFormModal
        open={modalOpen}
        brand={editingBrand}
        saving={saving}
        onSubmit={handleSubmit}
        onClose={closeModal}
      />
    </div>
  );
};

export default BrandListPage;
