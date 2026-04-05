import React from 'react';
import { X, Ticket, Type, Percent, Banknote, Calendar, Layers, ShieldCheck } from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';

const Label = ({ children, icon: Icon }) => (
    <label className="flex items-center gap-2 text-[13px] font-semibold text-slate-900 mb-1.5">
        {Icon && <Icon className="h-4 w-4 text-amber-600" />}
        {children}
    </label>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-md p-4 transition-all duration-300">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden border border-white/20 animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="relative px-8 pt-8 pb-6 bg-gradient-to-br from-slate-50 to-white border-b border-slate-100">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                <Ticket className="h-5 w-5 text-amber-600" />
                                {editingVoucher ? 'Cập nhật voucher' : 'Tạo voucher mới'}
                            </h3>
                            <p className="text-[11px] font-bold text-amber-600/80 uppercase">Quản lý chương trình khuyến mãi</p>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="rounded-lg h-10 w-10 hover:bg-red-50 hover:text-red-500 transition-all duration-300 border border-transparent hover:border-red-100"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                <form onSubmit={onSubmit} className="px-8 py-7 space-y-6 max-h-[85vh] overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="col-span-2 sm:col-span-1">
                            <Label icon={Type}>Mã code *</Label>
                            <Input
                                value={form.code}
                                onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                                placeholder="VD: SUMMER2025"
                                className="h-12 rounded-xl bg-white border-slate-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 text-slate-800 shadow-sm transition-all duration-300"
                                required
                            />
                        </div>

                        <div className="col-span-2 sm:col-span-1">
                            <Label icon={Layers}>Loại giảm giá</Label>
                            <div className="relative group text-slate-700">
                                <select
                                    value={form.discount_type}
                                    onChange={e => setForm(f => ({ ...f, discount_type: e.target.value }))}
                                    className="w-full h-12 px-5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all duration-300 appearance-none shadow-inner cursor-pointer"
                                >
                                    <option value="percentage">Phần trăm (%)</option>
                                    <option value="fixed">Số tiền cố định (VND)</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-amber-500 transition-colors">
                                    <Layers className="h-4 w-4" />
                                </div>
                            </div>
                        </div>

                        <div className="col-span-2 sm:col-span-1">
                            <Label icon={form.discount_type === 'percentage' ? Percent : Banknote}>
                                {form.discount_type === 'percentage' ? 'Phần trăm (%)' : 'Số tiền (VND)'} *
                            </Label>
                            <Input
                                type="number"
                                value={form.discount_value}
                                onChange={e => setForm(f => ({ ...f, discount_value: e.target.value }))}
                                placeholder={form.discount_type === 'percentage' ? '10' : '100000'}
                                className="h-12 rounded-xl bg-white border-slate-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 text-slate-800 shadow-sm transition-all duration-300"
                                min={1}
                                required
                            />
                        </div>

                        {form.discount_type === 'percentage' && (
                            <div className="col-span-2 sm:col-span-1">
                                <Label icon={ShieldCheck}>Giảm tối đa (VND)</Label>
                                <Input
                                    type="number"
                                    value={form.max_discount}
                                    onChange={e => setForm(f => ({ ...f, max_discount: e.target.value }))}
                                    placeholder="500000"
                                    className="h-12 rounded-xl bg-white border-slate-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 text-slate-800 shadow-sm transition-all duration-300"
                                />
                            </div>
                        )}

                        <div className="col-span-2 sm:col-span-1">
                            <Label icon={Banknote}>Giá trị đơn tối thiểu (VND)</Label>
                            <Input
                                type="number"
                                value={form.min_order_value}
                                onChange={e => setForm(f => ({ ...f, min_order_value: e.target.value }))}
                                placeholder="2000000"
                                className="h-12 rounded-xl bg-white border-slate-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 text-slate-800 shadow-sm transition-all duration-300"
                            />
                        </div>

                        <div className="col-span-2 sm:col-span-1">
                            <Label icon={Layers}>Giới hạn sử dụng</Label>
                            <Input
                                type="number"
                                value={form.usage_limit}
                                onChange={e => setForm(f => ({ ...f, usage_limit: e.target.value }))}
                                placeholder="Trống = Không giới hạn"
                                className="h-12 rounded-xl bg-white border-slate-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 text-slate-800 shadow-sm transition-all duration-300"
                            />
                        </div>

                        <div className="col-span-2 sm:col-span-1">
                            <Label icon={Calendar}>Ngày bắt đầu</Label>
                            <Input
                                type="date"
                                value={form.start_date}
                                onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))}
                                className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 text-slate-700 shadow-inner transition-all duration-300 px-4"
                            />
                        </div>

                        <div className="col-span-2 sm:col-span-1">
                            <Label icon={Calendar}>Ngày kết thúc</Label>
                            <Input
                                type="date"
                                value={form.end_date}
                                onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))}
                                className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 text-slate-700 shadow-inner transition-all duration-300 px-4"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 pt-6 border-t border-slate-50">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="flex-1 h-13 rounded-xl border-slate-200 font-bold text-[13px] text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all duration-300"
                        >
                            Hủy bỏ
                        </Button>
                        <Button
                            type="submit"
                            disabled={saving}
                            className="flex-[1.5] h-13 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-[13px] shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-300 active:scale-95 disabled:opacity-70"
                        >
                            {saving ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Đang lưu...
                                </div>
                            ) : (editingVoucher ? 'Cập nhật' : 'Tạo voucher')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VoucherFormModal;
