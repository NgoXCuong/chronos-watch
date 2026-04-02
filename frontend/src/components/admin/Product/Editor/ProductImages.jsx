import React from 'react';
import { Image as ImageIcon, Upload, X, Plus } from 'lucide-react';
import { Label, SectionTitle, EditorCard } from '../EditorUI';

const ProductImages = ({
    imagePreview,
    imageRef,
    handleImageChange,
    galleryPreviews,
    galleryRef,
    handleGalleryChange,
    removeGalleryItem
}) => {
    return (
        <EditorCard className="space-y-5">
            <SectionTitle icon={ImageIcon}>Hình ảnh</SectionTitle>

            {/* Main Image */}
            <div>
                <Label>Ảnh đại diện (Thumbnail)</Label>
                <div
                    onClick={() => imageRef.current.click()}
                    className="aspect-square rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 overflow-hidden flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-all relative group"
                >
                    {imagePreview ? (
                        <>
                            <img src={imagePreview} alt="Thumbnail" className="h-full w-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                <Upload className="h-6 w-6 text-white" />
                            </div>
                        </>
                    ) : (
                        <>
                            <Upload className="h-8 w-8 text-slate-300 mb-2" />
                            <span className="text-xs text-slate-400 font-medium tracking-tight">Tải lên ảnh 1x1</span>
                        </>
                    )}
                </div>
                <input ref={imageRef} type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
            </div>

            {/* Gallery */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <Label>Bố sưu tập ảnh</Label>
                    <button type="button" onClick={() => galleryRef.current.click()} className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">+ Thêm ảnh</button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    {galleryPreviews.map((url, idx) => (
                        <div key={idx} className="aspect-square rounded-xl bg-slate-100 border border-slate-200 relative overflow-hidden group">
                            <img src={url} alt={`Gallery ${idx}`} className="h-full w-full object-cover" />
                            <button
                                type="button"
                                onClick={() => removeGalleryItem(idx)}
                                className="absolute top-1 right-1 h-5 w-5 bg-rose-500 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    ))}
                    <div
                        onClick={() => galleryRef.current.click()}
                        className="aspect-square rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300 hover:text-amber-500 hover:border-amber-300 cursor-pointer transition-all"
                    >
                        <Plus className="h-5 w-5" />
                    </div>
                </div>
                <input ref={galleryRef} type="file" className="hidden" accept="image/*" multiple onChange={handleGalleryChange} />
            </div>
        </EditorCard>
    );
};

export default ProductImages;
