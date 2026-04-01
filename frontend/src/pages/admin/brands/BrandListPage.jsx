import React, { useState, useEffect, useRef } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import brandApi from '../../../api/brand.api';
import { toast } from 'sonner';

import AdminHeader from '../../../components/admin/Common/AdminHeader';
import SearchBanner from '../../../components/admin/Common/SearchBanner';
import BrandTable from '../../../components/admin/Brand/BrandTable';
import BrandFormModal from '../../../components/admin/Brand/BrandFormModal';

const EMPTY_FORM = { name: '', slug: '', description: '', country: '' };

const BrandListPage = () => {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingBrand, setEditingBrand] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);
    const [saving, setSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const fileRef = useRef();

    const fetchBrands = async () => {
        setLoading(true);
        try {
            const data = await brandApi.getAll({ all: true });
            setBrands(Array.isArray(data) ? data : []);
        } catch {
            toast.error('Không thể tải danh sách thương hiệu');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBrands(); }, []);

    const openCreate = () => {
        setEditingBrand(null);
        setForm(EMPTY_FORM);
        setLogoFile(null); setLogoPreview(null);
        setModalOpen(true);
    };

    const openEdit = (brand) => {
        setEditingBrand(brand);
        setForm({ name: brand.name || '', slug: brand.slug || '', description: brand.description || '', country: brand.country || '' });
        setLogoFile(null); setLogoPreview(brand.logo_url || null);
        setModalOpen(true);
    };

    const closeModal = () => { setModalOpen(false); setEditingBrand(null); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name.trim()) return toast.error('Tên thương hiệu không được để trống');
        setSaving(true);
        try {
            const fd = new FormData();
            Object.entries(form).forEach(([k, v]) => fd.append(k, v));
            if (logoFile) fd.append('logo', logoFile);
            if (editingBrand) {
                await brandApi.update(editingBrand.id, fd);
                toast.success('Cập nhật thương hiệu thành công!');
            } else {
                await brandApi.create(fd);
                toast.success('Thêm thương hiệu thành công!');
            }
            closeModal();
            fetchBrands();
        } catch (err) {
            toast.error(err?.message || 'Có lỗi xảy ra');
        } finally {
            setSaving(false);
        }
    };

    const handleToggle = async (brand) => {
        try {
            await brandApi.toggleStatus(brand.id);
            toast.success('Đã cập nhật trạng thái');
            fetchBrands();
        } catch {
            toast.error('Không thể thay đổi trạng thái');
        }
    };

    const handleDelete = async (brand) => {
        if (!window.confirm(`Xóa thương hiệu "${brand.name}"?`)) return;
        try {
            await brandApi.delete(brand.id);
            toast.success('Đã xóa thương hiệu');
            fetchBrands();
        } catch {
            toast.error('Không thể xóa thương hiệu');
        }
    };

    const filtered = brands.filter(b => b.name?.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="space-y-6 pb-10 font-roboto">
            <AdminHeader 
                title="Quản lý thương hiệu"
                subtitle="Quản lý các thương hiệu đồng hồ"
                actions={
                    <Button onClick={openCreate} className="bg-amber-600 hover:bg-amber-700 text-white gap-2 h-11 px-6 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-amber-600/20 transition-all active:scale-95">
                        <Plus className="h-4 w-4" /> Thêm thương hiệu
                    </Button>
                }
            />

            <SearchBanner 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                placeholder="Tìm kiếm thương hiệu..."
                onRefresh={fetchBrands}
                loading={loading}
                count={filtered.length}
                countLabel="thương hiệu"
            />

            <BrandTable 
                brands={filtered}
                loading={loading}
                onEdit={openEdit}
                onDelete={handleDelete}
                onToggle={handleToggle}
            />

            <BrandFormModal 
                isOpen={modalOpen}
                onClose={closeModal}
                onSubmit={handleSubmit}
                form={form}
                setForm={setForm}
                logoPreview={logoPreview}
                setLogoFile={setLogoFile}
                setLogoPreview={setLogoPreview}
                fileRef={fileRef}
                saving={saving}
                editingBrand={editingBrand}
            />
        </div>
    );
};

export default BrandListPage;
