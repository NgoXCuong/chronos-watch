import React, { useState, useEffect, useRef } from 'react';
import { Plus, Layout } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import bannerApi from '../../../api/banner.api';
import { toast } from 'sonner';

import AdminHeader from '../../../components/admin/Common/AdminHeader';
import SearchBanner from '../../../components/admin/Common/SearchBanner';
import BannerTable from '../../../components/admin/Banner/BannerTable';
import BannerFormModal from '../../../components/admin/Banner/BannerFormModal';

const EMPTY_FORM = { 
    title: '', 
    link_url: '', 
    position: 'home_main', 
    sort_order: 0, 
    is_active: 1 
};

const BannerListPage = () => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [saving, setSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const fileRef = useRef();

    const fetchBanners = async () => {
        setLoading(true);
        try {
            const data = await bannerApi.getAll();
            setBanners(Array.isArray(data) ? data : []);
        } catch {
            toast.error('Không thể tải danh sách banner');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBanners(); }, []);

    const openCreate = () => {
        setEditingBanner(null);
        setForm(EMPTY_FORM);
        setImageFile(null); 
        setImagePreview(null);
        setModalOpen(true);
    };

    const openEdit = (banner) => {
        setEditingBanner(banner);
        setForm({ 
            title: banner.title || '', 
            link_url: banner.link_url || '', 
            position: banner.position || 'home_main', 
            sort_order: banner.sort_order || 0, 
            is_active: banner.is_active 
        });
        setImageFile(null); 
        setImagePreview(banner.image_url || null);
        setModalOpen(true);
    };

    const closeModal = () => { 
        setModalOpen(false); 
        setEditingBanner(null); 
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!editingBanner && !imageFile) {
            return toast.error('Vui lòng chọn hình ảnh cho banner mới');
        }

        setSaving(true);
        try {
            const fd = new FormData();
            Object.entries(form).forEach(([k, v]) => fd.append(k, v));
            if (imageFile) fd.append('image', imageFile);

            if (editingBanner) {
                await bannerApi.update(editingBanner.id, fd);
                toast.success('Cập nhật banner thành công!');
            } else {
                await bannerApi.create(fd);
                toast.success('Thêm banner thành công!');
            }
            closeModal();
            fetchBanners();
        } catch (err) {
            toast.error(err?.response?.data?.message || err?.message || 'Có lỗi xảy ra');
        } finally {
            setSaving(false);
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            await bannerApi.toggleStatus(id);
            toast.success('Đã cập nhật trạng thái banner');
            fetchBanners();
        } catch {
            toast.error('Không thể thay đổi trạng thái');
        }
    };

    const handleDelete = async (banner) => {
        if (!window.confirm(`Bạn có chắc muốn xóa banner này không?`)) return;
        try {
            await bannerApi.delete(banner.id);
            toast.success('Đã xóa banner');
            fetchBanners();
        } catch {
            toast.error('Không thể xóa banner');
        }
    };

    const filtered = banners.filter(b => 
        (b.title || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 pb-10 font-roboto">
            <AdminHeader
                title="Quản lý Banner"
                subtitle="Cấu hình slider và các vị trí quảng cáo trên website"
                actions={
                    <Button 
                        onClick={openCreate} 
                        className="bg-amber-600 hover:bg-amber-700 text-white gap-2 h-11 px-6 rounded-xl font-bold shadow-lg shadow-amber-600/20 transition-all active:scale-95"
                    >
                        <Plus className="h-4 w-4" /> Thêm Banner mới
                    </Button>
                }
            />

            <SearchBanner
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                placeholder="Tìm kiếm tiêu đề banner..."
                onRefresh={fetchBanners}
                loading={loading}
                count={filtered.length}
                countLabel="Banner"
            />

            <BannerTable
                banners={filtered}
                loading={loading}
                onEdit={openEdit}
                onDelete={handleDelete}
                onToggleStatus={handleToggleStatus}
            />

            <BannerFormModal
                isOpen={modalOpen}
                onClose={closeModal}
                onSubmit={handleSubmit}
                form={form}
                setForm={setForm}
                imagePreview={imagePreview}
                setImageFile={setImageFile}
                setImagePreview={setImagePreview}
                fileRef={fileRef}
                saving={saving}
                editingBanner={editingBanner}
            />
        </div>
    );
};

export default BannerListPage;
