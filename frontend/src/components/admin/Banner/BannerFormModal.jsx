import React from 'react';
import { X, Upload, Layout, Type, Link, Layers, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';

const Label = ({ children, icon: Icon }) => (
    <label className="flex items-center gap-2 text-[13px] font-semibold text-slate-900 mb-1.5 tracking-tight">
        {Icon && <Icon className="h-4 w-4 text-amber-600" />}
        {children}
    </label>
);

const BannerFormModal = ({
    isOpen,
    onClose,
    onSubmit,
    form,
    setForm,
    imagePreview,
    setImageFile,
    setImagePreview,
    fileRef,
    saving,
    editingBanner
}) => {
    if (!isOpen) return null;

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
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
                                <Layout className="h-5 w-5 text-amber-600" />
                                {editingBanner ? 'Cập nhật Banner' : 'Thêm Banner mới'}
                            </h3>
                            <p className="text-[11px] font-bold text-amber-600/80 uppercase tracking-[0.2em]">Quản lý hiển thị website</p>
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
                        {/* Image Upload Area */}
                        <div className="col-span-2">
                            <Label icon={ImageIcon}>Hình ảnh Banner *</Label>
                            <div className="relative group cursor-pointer" onClick={() => fileRef.current?.click()}>
                                <div className="flex flex-col items-center justify-center min-h-[200px] p-6 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 group-hover:border-amber-400 group-hover:bg-amber-50/30 transition-all duration-300 overflow-hidden relative">
                                    {imagePreview ? (
                                        <div className="absolute inset-0">
                                            <img src={imagePreview} alt="Preview" className="h-full w-full object-cover animate-in fade-in duration-500" />
                                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <Upload className="h-8 w-8 text-white animate-bounce" />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center">
                                            <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center shadow-md mb-3 text-slate-300 group-hover:text-amber-500 transition-all">
                                                <Upload className="h-7 w-7" />
                                            </div>
                                            <p className="text-[13px] font-bold text-slate-700">Tải lên hình ảnh banner</p>
                                            <p className="text-[11px] text-slate-400 mt-1 italic">Kích thước gợi ý: 1920x600 (Main) hoặc 800x400 (Sidebar)</p>
                                        </div>
                                    )}
                                </div>
                                <input ref={fileRef} type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                            </div>
                        </div>

                        {/* Title */}
                        <div className="col-span-2 sm:col-span-1">
                            <Label icon={Type}>Tiêu đề Banner</Label>
                            <Input
                                value={form.title}
                                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                placeholder="VD: Bộ sưu tập hè 2025"
                                className="h-12 rounded-xl bg-white border-slate-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 text-slate-800 shadow-sm transition-all duration-300"
                            />
                        </div>

                        {/* Link URL */}
                        <div className="col-span-2 sm:col-span-1">
                            <Label icon={Link}>Đường dẫn (Link)</Label>
                            <Input
                                value={form.link_url}
                                onChange={e => setForm(f => ({ ...f, link_url: e.target.value }))}
                                placeholder="VD: /collections/seasonal"
                                className="h-12 rounded-xl bg-white border-slate-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 text-slate-800 shadow-sm transition-all duration-300"
                            />
                        </div>

                        {/* Position Select */}
                        <div className="col-span-2 sm:col-span-1">
                            <Label icon={Layers}>Vị trí hiển thị</Label>
                            <select
                                value={form.position}
                                onChange={e => setForm(f => ({ ...f, position: e.target.value }))}
                                className="w-full h-12 px-5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all duration-300 appearance-none shadow-sm cursor-pointer"
                            >
                                <option value="home_main">Slide chính (Trang chủ)</option>
                                <option value="home_sidebar">Cạnh Slide (Trang chủ)</option>
                                <option value="popup">Popup quảng cáo</option>
                            </select>
                        </div>

                        {/* Sort Order */}
                        <div className="col-span-2 sm:col-span-1">
                            <Label icon={Layers}>Thứ tự hiển thị</Label>
                            <Input
                                type="number"
                                value={form.sort_order}
                                onChange={e => setForm(f => ({ ...f, sort_order: e.target.value }))}
                                placeholder="0"
                                className="h-12 rounded-xl bg-white border-slate-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 text-slate-800 shadow-sm transition-all duration-300 font-bold"
                            />
                        </div>

                        {/* Status Toggle */}
                        <div className="col-span-2 pt-2">
                             <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setForm(f => ({ ...f, is_active: f.is_active ? 0 : 1 }))}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${form.is_active ? 'bg-amber-500' : 'bg-slate-300'}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.is_active ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                                <div className="flex flex-col">
                                    <span className="text-[13px] font-bold text-slate-800">Hiển thị Banner này ngay</span>
                                    <span className="text-[11px] text-slate-500">Banner sẽ bắt đầu xuất hiện trên các trang được chọn.</span>
                                </div>
                             </div>
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
                            ) : (editingBanner ? 'Cập nhật' : 'Xác nhận')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BannerFormModal;
