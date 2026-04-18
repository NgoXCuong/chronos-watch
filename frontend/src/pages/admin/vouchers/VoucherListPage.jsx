import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import AdminHeader from '../../../components/admin/Common/AdminHeader';
import SearchBanner from '../../../components/admin/Common/SearchBanner';
import VoucherTable from '../../../components/admin/Voucher/VoucherTable';
import AdminPagination from '../../../components/admin/Common/AdminPagination';
import VoucherFormModal from '../../../components/admin/Voucher/VoucherFormModal';
import voucherApi from '../../../api/voucher.api';
import { toast } from 'sonner';

const EMPTY_FORM = {
    code: '', discount_type: 'percentage', discount_value: '',
    max_discount: '', min_order_value: '', start_date: '', end_date: '', usage_limit: ''
};

const VoucherListPage = () => {
    const [vouchers, setVouchers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingVoucher, setEditingVoucher] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const limit = 10;

    const formatCurrency = (amt) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amt || 0);

    const fetchVouchers = async () => {
        setLoading(true);
        try {
            const data = await voucherApi.getAll({ 
                search: searchTerm, 
                page: currentPage, 
                limit: limit 
            });
            setVouchers(data.rows || []);
            setTotalCount(data.count || 0);
        } catch {
            toast.error('Không thể tải mã giảm giá');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { 
        setCurrentPage(1); 
        fetchVouchers(); 
    }, [searchTerm]);

    useEffect(() => { 
        fetchVouchers(); 
    }, [currentPage]);

    const openCreate = () => { setEditingVoucher(null); setForm(EMPTY_FORM); setModalOpen(true); };
    const openEdit = (v) => {
        setEditingVoucher(v);
        setForm({
            code: v.code || '', discount_type: v.discount_type || 'percentage',
            discount_value: v.discount_value || '', max_discount: v.max_discount || '',
            min_order_value: v.min_order_value || '',
            start_date: v.start_date ? v.start_date.split('T')[0] : '',
            end_date: v.end_date ? v.end_date.split('T')[0] : '',
            usage_limit: v.usage_limit || ''
        });
        setModalOpen(true);
    };
    const closeModal = () => { setModalOpen(false); setEditingVoucher(null); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.code.trim()) return toast.error('Mã voucher không được để trống');
        if (!form.discount_value) return toast.error('Giá trị giảm không được để trống');
        setSaving(true);
        try {
            const payload = {
                code: form.code.trim().toUpperCase(),
                discount_type: form.discount_type,
                discount_value: Number(form.discount_value),
                max_discount: form.max_discount ? Number(form.max_discount) : null,
                min_order_value: form.min_order_value ? Number(form.min_order_value) : null,
                start_date: form.start_date || null,
                end_date: form.end_date || null,
                usage_limit: form.usage_limit ? Number(form.usage_limit) : null
            };
            if (editingVoucher) {
                await voucherApi.update(editingVoucher.id, payload);
                toast.success('Cập nhật voucher thành công!');
            } else {
                await voucherApi.create(payload);
                toast.success('Tạo voucher thành công!');
            }
            closeModal(); fetchVouchers();
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || 'Có lỗi xảy ra';
            toast.error(errorMsg);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (v) => {
        if (!window.confirm(`Xóa mã voucher "${v.code}"?`)) return;
        try {
            await voucherApi.delete(v.id);
            toast.success('Đã xóa voucher');
            fetchVouchers();
        } catch {
            toast.error('Không thể xóa voucher');
        }
    };

    const isExpired = (endDate) => endDate && new Date(endDate) < new Date();

    return (
        <div className="space-y-6 pb-10 font-roboto">
            <AdminHeader
                title="Quản lý mã giảm giá"
                subtitle="Tạo và quản lý các voucher khuyến mãi"
                actions={
                    <Button onClick={openCreate} className="bg-amber-600 hover:bg-amber-700 text-white gap-2 h-11 px-6 rounded-xl font-bold shadow-lg shadow-amber-600/20 transition-all active:scale-95">
                        <Plus className="h-4 w-4" /> Tạo voucher mới
                    </Button>
                }
            />

            <SearchBanner
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                placeholder="Tìm kiếm mã voucher..."
                onRefresh={fetchVouchers}
                loading={loading}
                count={totalCount}
                countLabel="Hiện có"
            />

            <VoucherTable
                vouchers={vouchers}
                loading={loading}
                searchTerm={searchTerm}
                formatCurrency={formatCurrency}
                isExpired={isExpired}
                onEdit={openEdit}
                onDelete={handleDelete}
                pagination={{
                    currentPage: currentPage,
                    totalPages: Math.ceil(totalCount / limit),
                    totalCount: totalCount,
                    countLabel: "voucher",
                    onPageChange: (page) => setCurrentPage(page)
                }}
            />

            <VoucherFormModal
                isOpen={modalOpen}
                onClose={closeModal}
                onSubmit={handleSubmit}
                form={form}
                setForm={setForm}
                saving={saving}
                editingVoucher={editingVoucher}
            />
        </div>
    );
};

export default VoucherListPage;
