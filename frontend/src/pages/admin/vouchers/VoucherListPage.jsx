import React, { useState, useEffect } from 'react';
import { Plus, Tag, RefreshCw, Activity, CheckCircle2 } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import AdminHeader from '../../../components/admin/Common/AdminHeader';
import StatsGrid from '../../../components/admin/Common/StatsGrid';
import SearchBanner from '../../../components/admin/Common/SearchBanner';
import VoucherTable from '../../../components/admin/Voucher/VoucherTable';
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

    const formatCurrency = (amt) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amt || 0);

    const fetchVouchers = async () => {
        setLoading(true);
        try {
            const data = await voucherApi.getAll();
            setVouchers(Array.isArray(data) ? data : []);
        } catch {
            toast.error('Không thể tải mã giảm giá');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchVouchers(); }, []);

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

    const statCards = [
        {
            label: 'Tổng voucher', icon: Tag, value: vouchers.length,
            color: 'text-white', bg: 'bg-amber-600',
            dot: 'bg-white', trend: '↑ 2 mã mới', trendColor: 'text-amber-100',
            hist: [10, 12, 11, 14, 15, 18, vouchers.length], chartColor: '#FEF3C7'
        },
        {
            label: 'Đang hiệu lực', icon: Activity, value: vouchers.filter(v => !isExpired(v.end_date)).length,
            color: 'text-slate-900', bg: 'bg-white',
            dot: 'bg-emerald-500', trend: '↑ 5.2%', trendColor: 'text-emerald-600',
            hist: [5, 8, 7, 10, 9, 12, vouchers.filter(v => !isExpired(v.end_date)).length], chartColor: '#10B981',
            pulse: true
        },
        {
            label: 'Đã hết hạn', icon: CheckCircle2, value: vouchers.filter(v => isExpired(v.end_date)).length,
            color: 'text-slate-900', bg: 'bg-white',
            dot: 'bg-rose-500', trend: '↓ 12% so với tuần trước', trendColor: 'text-rose-600',
            hist: [2, 4, 3, 5, 4, 6, vouchers.filter(v => isExpired(v.end_date)).length], chartColor: '#F43F5E'
        }
    ];

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

            <StatsGrid stats={statCards} />

            <SearchBanner
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                placeholder="Tìm kiếm mã voucher..."
                onRefresh={fetchVouchers}
                loading={loading}
                count={vouchers.length}
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
