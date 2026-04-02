import React from 'react';
import { X, Upload, Award, Type, Link, Globe, FileText, Image as ImageIcon } from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';

const Label = ({ children, icon: Icon }) => (
    <label className="flex items-center gap-2 text-[13px] font-semibold text-slate-900 mb-1.5 tracking-tight">
        {Icon && <Icon className="h-4 w-4 text-amber-600" />}
        {children}
    </label>
);

const BrandFormModal = ({
    isOpen,
    onClose,
    onSubmit,
    form,
    setForm,
    logoPreview,
    setLogoFile,
    setLogoPreview,
    fileRef,
    saving,
    editingBrand
}) => {
    if (!isOpen) return null;

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogoFile(file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-md p-4 transition-all duration-300">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden border border-white/20 animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="relative px-8 pt-8 pb-6 bg-gradient-to-br from-slate-50 to-white border-b border-slate-100">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                                <Award className="h-5 w-5 text-amber-600" />
                                {editingBrand ? 'Cập nhật thương hiệu' : 'Thêm mới thương hiệu'}
                            </h3>
                            <p className="text-[11px] font-bold text-amber-600/80 uppercase tracking-[0.2em]">Quản lý thương hiệu</p>
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

                <form onSubmit={onSubmit} className="px-8 py-7 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="col-span-2">
                            <Label icon={ImageIcon}>Logo thương hiệu</Label>
                            <div className="relative group cursor-pointer" onClick={() => fileRef.current?.click()}>
                                <div className="flex items-center gap-6 p-5 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 group-hover:border-amber-400 group-hover:bg-amber-50/30 transition-all duration-300">
                                    <div className="h-20 w-20 rounded-lg bg-white border border-slate-200 overflow-hidden flex items-center justify-center shadow-md group-hover:shadow-amber-200 transition-all duration-300 relative shrink-0">
                                        {logoPreview ? (
                                            <img src={logoPreview} alt="Preview" className="h-full w-full object-contain p-2 animate-in fade-in duration-500" />
                                        ) : (
                                            <Upload className="h-6 w-6 text-slate-300 group-hover:text-amber-500 transition-colors" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[13px] font-bold text-slate-700 group-hover:text-amber-600 transition-colors">
                                            {logoPreview ? 'Thay đổi ảnh thương hiệu' : 'Tải lên logo mới'}
                                        </p>
                                        <p className="text-[11px] text-slate-500 mt-1 italic font-medium">Hỗ trợ định dạng JPG, PNG, WEBP. Dung lượng tối đa 2MB.</p>
                                    </div>
                                </div>
                                <input ref={fileRef} type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                            </div>
                        </div>

                        <div className="col-span-2 sm:col-span-1">
                            <Label icon={Type}>Tên thương hiệu *</Label>
                            <Input
                                value={form.name}
                                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                placeholder="VD: Rolex"
                                className="h-12 rounded-xl bg-white border-slate-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 text-slate-800 shadow-sm transition-all duration-300"
                                required
                            />
                        </div>

                        <div className="col-span-2 sm:col-span-1">
                            <Label icon={Link}>Slug (Đường dẫn)</Label>
                            <Input
                                value={form.slug}
                                onChange={e => setForm(f => ({ ...f, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
                                placeholder="VD: rolex"
                                className="h-12 rounded-xl bg-slate-50 border-slate-200 text-slate-500 shadow-inner transition-all duration-300"
                            />
                        </div>

                        <div className="col-span-2 sm:col-span-1">
                            <Label icon={Globe}>Quốc gia</Label>
                            <Input
                                value={form.country}
                                onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
                                placeholder="VD: Thụy Sỹ"
                                className="h-12 rounded-xl bg-white border-slate-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 text-slate-800 shadow-sm transition-all duration-300"
                            />
                        </div>

                        <div className="col-span-2">
                            <Label icon={FileText}>Mô tả thương hiệu</Label>
                            <textarea
                                value={form.description}
                                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                placeholder="Nhập câu chuyện hoặc mô tả về thương hiệu..."
                                className="w-full h-32 p-5 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all duration-300 shadow-sm resize-none"
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
                            ) : (editingBrand ? 'Cập nhật' : 'Xác nhận')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BrandFormModal;
