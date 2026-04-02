import React from 'react';
import { Tag, Plus } from 'lucide-react';
import { Label, SectionTitle, EditorCard } from '../EditorUI';

const ProductCategorization = ({ form, setForm, brands, categories }) => {
    const toggleCategory = (catId) => {
        setForm(f => ({
            ...f,
            category_ids: f.category_ids.includes(catId)
                ? f.category_ids.filter(cid => cid !== catId)
                : [...f.category_ids, catId]
        }));
    };

    return (
        <EditorCard className="space-y-5">
            <SectionTitle icon={Tag}>Phân loại</SectionTitle>
            <div className="space-y-4">
                <div>
                    <Label>Thương hiệu</Label>
                    <select
                        value={form.brand_id}
                        onChange={e => setForm(f => ({ ...f, brand_id: e.target.value }))}
                        className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-amber-500"
                    >
                        <option value="">— Chọn thương hiệu —</option>
                        {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                </div>
                <div>
                    <Label>Danh mục sản phẩm</Label>
                    <div className="border border-slate-100 rounded-xl p-3 bg-slate-50/50 space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() => toggleCategory(cat.id)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-between ${form.category_ids.includes(cat.id) ? 'bg-amber-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-100 hover:border-amber-300'}`}
                                style={{ marginLeft: cat.level * 12 }}
                            >
                                <span>{cat.name}</span>
                                {form.category_ids.includes(cat.id) && <Plus className="h-3 w-3 rotate-45" />}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </EditorCard>
    );
};

export default ProductCategorization;
