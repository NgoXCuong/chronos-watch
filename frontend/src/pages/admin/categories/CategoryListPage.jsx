import { useMemo } from "react";
import { Plus } from "lucide-react";
import AdminHeader from "../../../components/admin/Common/AdminHeader";
import SearchBanner from "../../../components/admin/Common/SearchBanner";
import FilterSelect from "../../../components/admin/Common/FilterSelect";
import CategoryTreePanel from "../../../components/admin/Category/CategoryTreePanel";
import CategoryDetailPanel from "../../../components/admin/Category/CategoryDetailPanel";
import CategoryFormModal from "../../../components/admin/Category/CategoryFormModal";
import { Button } from "../../../components/ui/button";
import useCategoryManager from "../../../hooks/useCategoryManager";
import { getPath } from "../../../utils/categoryTree";
import { VISIBILITY_FILTER_OPTIONS } from "../../../constants/taxonomyForm";

// Master–detail: cây phân cấp không phải layout dạng bảng nên không đi qua DataTable (Rule 3)
const CategoryListPage = () => {
  const {
    tree,
    visibleTree,
    matchedCount,
    totalCategories,
    loading,
    saving,
    selected,
    selectedId,
    setSelectedId,
    searchTerm,
    setSearchTerm,
    status,
    setStatus,
    isFiltering,
    modal,
    openCreate,
    openEdit,
    closeModal,
    submit,
    toggleStatus,
    remove,
    fetchTree,
  } = useCategoryManager();

  const path = useMemo(
    () => (selected ? getPath(tree, selected.id) : []),
    [tree, selected],
  );

  return (
    <div className="space-y-3 pb-8">
      <AdminHeader
        title="Quản lý danh mục"
        subtitle="Phân loại sản phẩm theo cây phân cấp hệ thống"
        actions={
          <Button
            onClick={() => openCreate(null)}
            className="h-9 gap-2 rounded-lg px-4 text-[13px] font-semibold"
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
            Thêm danh mục gốc
          </Button>
        }
      />

      <SearchBanner
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        placeholder="Tìm theo tên hoặc đường dẫn..."
        onRefresh={fetchTree}
        loading={loading}
        count={matchedCount}
        countLabel="danh mục"
      >
        <FilterSelect
          label="Trạng thái"
          value={status}
          onChange={setStatus}
          options={VISIBILITY_FILTER_OPTIONS}
        />
      </SearchBanner>

      <div className="grid grid-cols-1 items-start gap-3 xl:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
        <CategoryTreePanel
          nodes={visibleTree}
          loading={loading}
          isFiltering={isFiltering}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onCreateRoot={() => openCreate(null)}
          totalCategories={totalCategories}
        />

        <CategoryDetailPanel
          category={selected}
          path={path}
          onEdit={openEdit}
          onCreateChild={(category) => openCreate(category.id)}
          onToggle={toggleStatus}
          onDelete={remove}
        />
      </div>

      <CategoryFormModal
        open={modal.open}
        category={modal.category}
        parentId={modal.parentId}
        tree={tree}
        saving={saving}
        onSubmit={submit}
        onClose={closeModal}
      />
    </div>
  );
};

export default CategoryListPage;
