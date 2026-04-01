import React from 'react';
import { X } from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';

const Label = ({ children }) => (
    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">{children}</label>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden border border-slate-100">
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-50 sticky top-0 bg-white z-10">
                    <h3 className="text-base font-bold text-slate-900 uppercase tracking-tight">
                        {editingCat ? 'Cập nhật danh mục' : 'Thêm danh mục mới'}
                    </h3>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-xl h-9 w-9 hover:bg-slate-50 transition-colors">
                        <X className="h-4 w-4" />
                    </Button>
                </div>
                <form onSubmit={onSubmit} className="px-6 py-6 space-y-5">
                    <div>
                        <Label>Tên danh mục *</Label>
                        <Input 
                            value={form.name} 
                            onChange={e => setForm(f => ({ ...f, name: e.target.value }))} 
                            placeholder="VD: ĐỒNG HỒ NAM" 
                            className="h-11 rounded-xl bg-white border-slate-200 focus:border-amber-500 font-bold text-slate-800 shadow-sm uppercase tracking-tight" 
                            required 
                        />
                    </div>
                    <div>
                        <Label>Slug</Label>
                        <Input 
                            value={form.slug} 
                            onChange={e => setForm(f => ({ ...f, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))} 
                            placeholder="VD: dong-ho-nam" 
                            className="h-11 rounded-xl bg-slate-50 border-slate-200 font-medium text-slate-500 shadow-inner" 
                        />
                    </div>
                    <div>
                        <Label>Danh mục cha</Label>
                        <select 
                            value={form.parent_id} 
                            onChange={e => setForm(f => ({ ...f, parent_id: e.target.value }))} 
                            className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all shadow-sm"
                        >
                            <option value="">— DANH MỤC GỐC —</option>
                            {rootCats.filter(c => c.id !== editingCat?.id).map(c => (
                                <option key={c.id} value={c.id}>{c.name?.toUpperCase()}</option>
                            ))}
                        </select>
                        <p className="mt-1.5 text-[9px] text-slate-400 font-medium italic">Để trống nếu muốn đây là danh mục cao nhất</p>
                    </div>
                    <div className="grid grid-cols-1 gap-5">
                        <div>
                            <Label>Thứ tự hiển thị</Label>
                            <Input 
                                type="number" 
                                value={form.sort_order} 
                                onChange={e => setForm(f => ({ ...f, sort_order: e.target.value }))} 
                                placeholder="0" 
                                className="h-11 rounded-xl bg-white border-slate-200 focus:border-amber-500 font-bold text-slate-800 shadow-sm" 
                            />
                        </div>
                    </div>
                    <div>
                        <Label>Mô tả chi tiết</Label>
                        <textarea 
                            value={form.description} 
                            onChange={e => setForm(f => ({ ...f, description: e.target.value }))} 
                            placeholder="Nhập mô tả ngắn về danh mục này..." 
                            className="w-full h-28 p-4 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all shadow-sm resize-none"
                        />
                    </div>

                    <div className="flex gap-3 pt-3">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={onClose} 
                            className="flex-1 h-11 rounded-2xl border-slate-200 font-bold text-xs uppercase tracking-widest text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all shadow-sm"
                        >
                            Hủy bỏ
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={saving} 
                            className="flex-1 h-11 rounded-2xl bg-slate-900 hover:bg-black text-white font-bold text-xs uppercase tracking-widest shadow-xl transition-all active:scale-95"
                        >
                            {saving ? 'Đang lưu...' : (editingCat ? 'Cập nhật' : 'Thêm mới')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CategoryFormModal;
