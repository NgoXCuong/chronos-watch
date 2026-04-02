import React from 'react';
import { X, Layout, Type, Link, Layers, ListOrdered, FileText } from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';

const Label = ({ children, icon: Icon }) => (
    <label className="flex items-center gap-2 text-[13px] font-semibold text-slate-900 mb-1.5 tracking-tight">
        {Icon && <Icon className="h-4 w-4 text-amber-600" />}
        {children}
    </label>
);

const CategoryFormModal = ({
    isOpen,
    onClose,
    onSubmit,
    form,
    setForm,
    rootCats,
    saving,
    editingCat
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-md p-4 transition-all duration-300">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden border border-white/20 animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="relative px-8 pt-8 pb-6 bg-gradient-to-br from-slate-50 to-white border-b border-slate-100">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                                <Layout className="h-5 w-5 text-amber-600" />
                                {editingCat ? 'Cập nhật danh mục' : 'Thêm mới danh mục'}
                            </h3>
                            <p className="text-[11px] font-bold text-amber-600/80 uppercase tracking-[0.2em]">Quản lý danh mục sản phẩm</p>
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

                {/* Form Body */}
                <form onSubmit={onSubmit} className="px-8 py-7 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="col-span-2 sm:col-span-1">
                            <Label icon={Type}>Tên danh mục *</Label>
                            <Input
                                value={form.name}
                                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                placeholder="VD: Đồng hồ nam"
                                className="h-12 rounded-xl bg-white border-slate-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 text-slate-800 shadow-sm transition-all duration-300"
                                required
                            />
                        </div>

                        <div className="col-span-2 sm:col-span-1">
                            <Label icon={Link}>Slug (Đường dẫn)</Label>
                            <Input
                                value={form.slug}
                                onChange={e => setForm(f => ({ ...f, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
                                placeholder="VD: dong-ho-nam"
                                className="h-12 rounded-xl bg-slate-50 border-slate-200 text-slate-500 shadow-inner group-focus-within:bg-white transition-all duration-300"
                            />
                        </div>

                        <div className="col-span-2 sm:col-span-1">
                            <Label icon={Layers}>Danh mục cha</Label>
                            <div className="relative group">
                                <select
                                    value={form.parent_id}
                                    onChange={e => setForm(f => ({ ...f, parent_id: e.target.value }))}
                                    className="w-full h-12 px-5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all duration-300 appearance-none shadow-sm cursor-pointer"
                                >
                                    <option value="">— DANH MỤC GỐC —</option>
                                    {rootCats.filter(c => c.id !== editingCat?.id).map(c => (
                                        <option key={c.id} value={c.id}>{c.name?.toUpperCase()}</option>
                                    ))}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-amber-500 transition-colors">
                                    <Layers className="h-4 w-4" />
                                </div>
                            </div>
                        </div>

                        <div className="col-span-2 sm:col-span-1">
                            <Label icon={ListOrdered}>Thứ tự hiển thị</Label>
                            <Input
                                type="number"
                                value={form.sort_order}
                                onChange={e => setForm(f => ({ ...f, sort_order: e.target.value }))}
                                placeholder="0"
                                className="h-12 rounded-xl bg-white border-slate-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 text-slate-800 shadow-sm transition-all duration-300"
                            />
                        </div>

                        <div className="col-span-2">
                            <Label icon={FileText}>Mô tả chi tiết</Label>
                            <textarea
                                value={form.description}
                                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                placeholder="Nhập mô tả ngắn về danh mục này..."
                                className="w-full h-32 p-5 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all duration-300 shadow-sm resize-none"
                            />
                        </div>
                    </div>

                    {/* Actions */}
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
                            ) : (editingCat ? 'Cập nhật' : 'Xác nhận')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CategoryFormModal;
