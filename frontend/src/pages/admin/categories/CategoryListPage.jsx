import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import categoryApi from '../../../api/category.api';
import { toast } from 'sonner';

import AdminHeader from '../../../components/admin/Common/AdminHeader';
import SearchBanner from '../../../components/admin/Common/SearchBanner';
import CategoryTable from '../../../components/admin/Category/CategoryTable';
import CategoryFormModal from '../../../components/admin/Category/CategoryFormModal';

const EMPTY_FORM = { name: '', slug: '', description: '', parent_id: '', sort_order: 0 };

const flattenCategories = (categories, level = 0) => {
    const result = [];
    for (const cat of categories) {
        result.push({ ...cat, level });
        if (cat.children?.length) result.push(...flattenCategories(cat.children, level + 1));
    }
    return result;
};

const CategoryListPage = () => {
    const [categories, setCategories] = useState([]);
    const [flat, setFlat] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingCat, setEditingCat] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const data = await categoryApi.getAll({ all: true });
            const list = Array.isArray(data) ? data : [];
            setCategories(list);
            setFlat(flattenCategories(list));
        } catch {
            toast.error('Không thể tải danh sách danh mục');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCategories(); }, []);

    const openCreate = () => { setEditingCat(null); setForm(EMPTY_FORM); setModalOpen(true); };
    const openEdit = (cat) => {
        setEditingCat(cat);
        setForm({
            name: cat.name || '',
            slug: cat.slug || '',
            description: cat.description || '',
            parent_id: cat.parent_id || '',
            sort_order: cat.sort_order || 0
        });
        setModalOpen(true);
    };
    const closeModal = () => { setModalOpen(false); setEditingCat(null); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name.trim()) return toast.error('Tên danh mục không được để trống');
        setSaving(true);
        try {
            const payload = {
                name: form.name,
                slug: form.slug,
                description: form.description,
                sort_order: Number(form.sort_order) || 0,
                parent_id: form.parent_id ? Number(form.parent_id) : null,
            };
            if (editingCat) {
                await categoryApi.update(editingCat.id, payload);
                toast.success('Cập nhật danh mục thành công!');
            } else {
                await categoryApi.create(payload);
                toast.success('Thêm danh mục thành công!');
            }
            closeModal(); fetchCategories();
        } catch (err) {
            toast.error(err?.message || 'Có lỗi xảy ra');
        } finally {
            setSaving(false);
        }
    };

    const handleToggle = async (cat) => {
        try {
            await categoryApi.toggleStatus(cat.id);
            toast.success('Đã cập nhật trạng thái');
            fetchCategories();
        } catch {
            toast.error('Không thể thay đổi trạng thái');
        }
    };

    const handleDelete = async (cat) => {
        if (!window.confirm(`Xóa danh mục "${cat.name}"?`)) return;
        try {
            await categoryApi.delete(cat.id);
            toast.success('Đã xóa danh mục');
            fetchCategories();
        } catch {
            toast.error('Không thể xóa (có thể có danh mục con hoặc sản phẩm)');
        }
    };

    const filtered = flat.filter(c => c.name?.toLowerCase().includes(searchTerm.toLowerCase()));
    const rootCats = flat.filter(c => !c.parent_id);

    return (
        <div className="space-y-6 pb-10 font-roboto">
            <AdminHeader
                title="Quản lý danh mục"
                subtitle="Cấu trúc phân cấp sản phẩm toàn hệ thống"
                actions={
                    <Button onClick={openCreate} className="bg-amber-600 hover:bg-amber-700 text-white gap-2 h-11 px-6 rounded-xl font-bold shadow-lg shadow-amber-600/20 transition-all active:scale-95">
                        <Plus className="h-4 w-4" /> Thêm danh mục mới
                    </Button>
                }
            />

            <SearchBanner
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                placeholder="Tìm kiếm danh mục..."
                onRefresh={fetchCategories}
                loading={loading}
                count={filtered.length}
                countLabel="Danh mục"
            />

            <CategoryTable
                categories={filtered}
                loading={loading}
                onEdit={openEdit}
                onDelete={handleDelete}
                onToggle={handleToggle}
            />

            <CategoryFormModal
                isOpen={modalOpen}
                onClose={closeModal}
                onSubmit={handleSubmit}
                form={form}
                setForm={setForm}
                rootCats={rootCats}
                saving={saving}
                editingCat={editingCat}
            />
        </div>
    );
};

export default CategoryListPage;
