import React from 'react';
import { X } from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';

const Label = ({ children }) => (
    <label className="block text-xs font-medium text-slate-600 mb-1">{children}</label>
);

const VoucherFormModal = ({
    isOpen,
    onClose,
    onSubmit,
    form,
    setForm,
    saving,
    editingVoucher
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white rounded-t-2xl">
                    <h3 className="text-base font-semibold text-slate-900">
                        {editingVoucher ? 'Cập nhật voucher' : 'Tạo voucher mới'}
                    </h3>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-lg h-8 w-8">
                        <X className="h-4 w-4" />
                    </Button>
                </div>
                <form onSubmit={onSubmit} className="px-6 py-5 space-y-4">
                    <div>
                        <Label>Mã code *</Label>
                        <Input 
                            value={form.code} 
                            onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} 
                            placeholder="VD: SUMMER2025" 
                            className="h-9 rounded-lg bg-slate-50 border-slate-200 font-semibold tracking-wider text-sm" 
                            required 
                        />
                    </div>
                    <div>
                        <Label>Loại giảm giá</Label>
                        <select 
                            value={form.discount_type} 
                            onChange={e => setForm(f => ({ ...f, discount_type: e.target.value }))} 
                            className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 shadow-sm"
                        >
                            <option value="percentage">Phần trăm (%)</option>
                            <option value="fixed">Số tiền cố định (VND)</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <Label>{form.discount_type === 'percentage' ? 'Phần trăm (%)' : 'Số tiền (VND)'} *</Label>
                            <Input 
                                type="number" 
                                value={form.discount_value} 
                                onChange={e => setForm(f => ({ ...f, discount_value: e.target.value }))} 
                                placeholder={form.discount_type === 'percentage' ? '10' : '100000'} 
                                className="h-9 rounded-lg bg-slate-50 border-slate-200 text-sm" 
                                min={1} 
                                required 
                            />
                        </div>
                        {form.discount_type === 'percentage' && (
                            <div>
                                <Label>Giảm tối đa (VND)</Label>
                                <Input 
                                    type="number" 
                                    value={form.max_discount} 
                                    onChange={e => setForm(f => ({ ...f, max_discount: e.target.value }))} 
                                    placeholder="500000" 
                                    className="h-9 rounded-lg bg-slate-50 border-slate-200 text-sm" 
                                />
                            </div>
                        )}
                    </div>
                    <div>
                        <Label>Giá trị đơn tối thiểu (VND)</Label>
                        <Input 
                            type="number" 
                            value={form.min_order_value} 
                            onChange={e => setForm(f => ({ ...f, min_order_value: e.target.value }))} 
                            placeholder="2000000" 
                            className="h-9 rounded-lg bg-slate-50 border-slate-200 text-sm" 
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <Label>Ngày bắt đầu</Label>
                            <Input 
                                type="date" 
                                value={form.start_date} 
                                onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))} 
                                className="h-9 rounded-lg bg-slate-50 border-slate-200 text-sm" 
                            />
                        </div>
                        <div>
                            <Label>Ngày kết thúc</Label>
                            <Input 
                                type="date" 
                                value={form.end_date} 
                                onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))} 
                                className="h-9 rounded-lg bg-slate-50 border-slate-200 text-sm" 
                            />
                        </div>
                    </div>
                    <div>
                        <Label>Giới hạn sử dụng (để trống = không giới hạn)</Label>
                        <Input 
                            type="number" 
                            value={form.usage_limit} 
                            onChange={e => setForm(f => ({ ...f, usage_limit: e.target.value }))} 
                            placeholder="100" 
                            className="h-9 rounded-lg bg-slate-50 border-slate-200 text-sm" 
                        />
                    </div>
                    <div className="flex gap-3 pt-1">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={onClose} 
                            className="flex-1 h-9 rounded-lg border-slate-200 font-medium text-sm"
                        >
                            Hủy
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={saving} 
                            className="flex-1 h-9 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-medium text-sm shadow-md transition-all active:scale-95"
                        >
                            {saving ? 'Đang lưu...' : editingVoucher ? 'Cập nhật' : 'Tạo voucher'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VoucherFormModal;
