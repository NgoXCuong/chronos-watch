import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import categoryApi from "../api/category.api";
import {
  countNodes,
  findNode,
  filterTree,
  filterTreeByStatus,
} from "../utils/categoryTree";

/**
 * Toàn bộ trạng thái trang Danh mục (chế độ master–detail): tải cây một lần
 * (API /categories trả nguyên cây, không phân trang) rồi giữ selection,
 * bộ lọc client và modal ở một chỗ để trang chỉ còn là khung dựng.
 */
export const useCategoryManager = () => {
  const [tree, setTree] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("");
  const [modal, setModal] = useState({ open: false, category: null, parentId: null });

  const fetchTree = useCallback(async () => {
    setLoading(true);
    try {
      const data = await categoryApi.getAll({ all: true });
      setTree(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Không tải được cây danh mục");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTree();
  }, [fetchTree]);

  // Panel phải không được để trống: selection hợp lệ, nếu không thì chọn danh mục gốc đầu
  useEffect(() => {
    if (!tree.length) return;
    if (findNode(tree, selectedId)) return;
    setSelectedId(tree[0].id);
  }, [tree, selectedId]);

  const visibleTree = useMemo(() => {
    const byStatus = status ? filterTreeByStatus(tree, status === "true") : tree;
    return filterTree(byStatus, searchTerm);
  }, [tree, status, searchTerm]);

  const selected = useMemo(() => findNode(tree, selectedId), [tree, selectedId]);

  const openCreate = useCallback(
    (parentId = null) => setModal({ open: true, category: null, parentId }),
    [],
  );

  const openEdit = useCallback(
    (category) =>
      setModal({ open: true, category, parentId: category.parent_id ?? null }),
    [],
  );

  const closeModal = useCallback(
    () => setModal((prev) => ({ ...prev, open: false })),
    [],
  );

  const submit = useCallback(
    async (formData) => {
      setSaving(true);
      try {
        if (modal.category) {
          await categoryApi.update(modal.category.id, formData);
          toast.success("Cập nhật danh mục thành công!");
        } else {
          const created = await categoryApi.create(formData);
          toast.success("Thêm danh mục thành công!");
          if (created?.id) setSelectedId(created.id);
        }
        closeModal();
        await fetchTree();
      } catch (err) {
        toast.error(err?.message || "Không lưu được (kiểm tra tên/đường dẫn trùng nhau)");
      } finally {
        setSaving(false);
      }
    },
    [modal.category, closeModal, fetchTree],
  );

  const toggleStatus = useCallback(
    async (category) => {
      try {
        await categoryApi.toggleStatus(category.id);
        toast.success(category.is_active ? "Đã ẩn danh mục" : "Đã cho hiển thị lại");
        await fetchTree();
      } catch (err) {
        toast.error(err?.message || "Không đổi được trạng thái");
      }
    },
    [fetchTree],
  );

  const remove = useCallback(
    async (category) => {
      const childNote = category.child_count
        ? ` Danh mục này còn ${category.child_count} danh mục con.`
        : "";
      if (!window.confirm(`Xóa danh mục "${category.name}"? Hành động này không hoàn tác.${childNote}`))
        return;
      try {
        await categoryApi.delete(category.id);
        toast.success("Đã xóa danh mục");
        await fetchTree();
      } catch (err) {
        toast.error(err?.message || "Không xóa được — còn danh mục con hoặc sản phẩm");
      }
    },
    [fetchTree],
  );

  return {
    tree,
    visibleTree,
    matchedCount: useMemo(() => countNodes(visibleTree), [visibleTree]),
    totalCategories: useMemo(() => countNodes(tree), [tree]),
    loading,
    saving,
    selected,
    selectedId,
    setSelectedId,
    searchTerm,
    setSearchTerm,
    status,
    setStatus,
    isFiltering: !!searchTerm.trim() || !!status,
    modal,
    openCreate,
    openEdit,
    closeModal,
    submit,
    toggleStatus,
    remove,
    fetchTree,
  };
};

export default useCategoryManager;
