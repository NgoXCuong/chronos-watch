import React from 'react';
import { X, Upload } from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';

const Label = ({ children }) => (
    <label className="block text-xs font-semibold text-slate-800 mb-1 uppercase tracking-tight">{children}</label>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
                    <h3 className="text-base font-bold text-slate-900 uppercase tracking-tight">
                        {editingBrand ? 'Cập nhật thương hiệu' : 'Thêm thương hiệu mới'}
                    </h3>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-lg h-8 w-8 hover:bg-slate-50 transition-colors">
                        <X className="h-4 w-4" />
                    </Button>
                </div>
                <form onSubmit={onSubmit} className="px-6 py-5 space-y-4">
                    <div>
                        <Label>Logo thương hiệu</Label>
                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 shadow-inner">
                            <div className="h-16 w-16 rounded-xl bg-white border border-slate-200 overflow-hidden flex items-center justify-center flex-shrink-0 shadow-sm relative group">
                                {logoPreview ? (
                                    <img src={logoPreview} alt="Preview" className="h-full w-full object-contain p-2" />
                                ) : (
                                    <Upload className="h-6 w-6 text-slate-300" />
                                )}
                            </div>
                            <div className="space-y-1.5 flex-1">
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => fileRef.current?.click()} 
                                    className="h-8 text-[11px] font-bold uppercase tracking-widest border-slate-200 hover:bg-white hover:text-amber-600 hover:border-amber-200 transition-all shadow-sm"
                                >
                                    Chọn ảnh mới
                                </Button>
                                <p className="text-[10px] text-slate-400 font-medium italic">Định dạng JPG, PNG hoặc WEBP</p>
                            </div>
                            <input ref={fileRef} type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                        </div>
                    </div>

                    <div>
                        <Label>Tên thương hiệu *</Label>
                        <Input 
                            value={form.name} 
                            onChange={e => setForm(f => ({ ...f, name: e.target.value }))} 
                            placeholder="VD: ROLEX" 
                            className="h-10 rounded-xl bg-white border-slate-200 focus:border-amber-500 font-bold text-slate-700 shadow-sm" 
                            required 
                        />
                    </div>
                    <div>
                        <Label>Slug</Label>
                        <Input 
                            value={form.slug} 
                            onChange={e => setForm(f => ({ ...f, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))} 
                            placeholder="VD: rolex" 
                            className="h-10 rounded-xl bg-slate-50 border-slate-200 font-medium text-slate-500 shadow-inner" 
                        />
                    </div>
                    <div>
                        <Label>Quốc gia</Label>
                        <Input 
                            value={form.country} 
                            onChange={e => setForm(f => ({ ...f, country: e.target.value }))} 
                            placeholder="VD: Thụy Sỹ" 
                            className="h-10 rounded-xl bg-white border-slate-200 focus:border-amber-500 font-bold text-slate-700 shadow-sm uppercase tracking-tighter" 
                        />
                    </div>
                    <div>
                        <Label>Mô tả thương hiệu</Label>
                        <textarea 
                            value={form.description} 
                            onChange={e => setForm(f => ({ ...f, description: e.target.value }))} 
                            placeholder="Nhập mô tả về thương hiệu..." 
                            className="w-full h-24 p-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 font-medium text-slate-600 transition-all shadow-sm"
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={onClose} 
                            className="flex-1 h-10 rounded-xl border-slate-200 font-bold text-xs uppercase tracking-widest shadow-sm"
                        >
                            Hủy
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={saving} 
                            className="flex-1 h-10 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-amber-600/20 transition-all active:scale-95"
                        >
                            {saving ? 'Đang lưu...' : (editingBrand ? 'Cập nhật' : 'Thêm mới')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BrandFormModal;
