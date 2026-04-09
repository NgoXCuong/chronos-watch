import React from 'react';
import { Layers, Plus, X } from 'lucide-react';
import { Input } from '../../../ui/input';
import { SectionTitle, EditorCard } from '../EditorUI';

const ProductSpecifications = ({ form, setForm }) => {
    const addSpec = () => {
        setForm(f => ({ ...f, specifications: [...f.specifications, { key: '', value: '' }] }));
    };

    const removeSpec = (idx) => {
        setForm(f => ({ ...f, specifications: f.specifications.filter((_, i) => i !== idx) }));
    };

    const updateSpec = (idx, field, val) => {
        const newSpecs = [...form.specifications];
        newSpecs[idx][field] = val;
        setForm(f => ({ ...f, specifications: newSpecs }));
    };

    return (
        <EditorCard className="space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-4">
                <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-amber-600" />
                    <h3 className="text-sm font-bold text-slate-900 uppercase">Thông số kỹ thuật</h3>
                </div>
                <button
                    type="button"
                    onClick={addSpec}
                    className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100 transition-colors"
                >
                    <Plus className="h-3.5 w-3.5" /> Thêm thông số
                </button>
            </div>

            {form.specifications.length === 0 ? (
                <div className="text-center py-8 bg-slate-50 rounded-xl border-2 border-dashed border-slate-100">
                    <p className="text-sm text-slate-400">Chưa có thông số nào được thiết lập.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {form.specifications.map((spec, idx) => (
                        <div key={idx} className="flex items-center gap-3 animate-in fade-in slide-in-from-top-1">
                            <Input
                                value={spec.key}
                                onChange={e => updateSpec(idx, 'key', e.target.value)}
                                placeholder="Tên (VD: Máy)"
                                className="h-10 rounded-lg bg-slate-50 border-slate-200 text-sm flex-1"
                            />
                            <Input
                                value={spec.value}
                                onChange={e => updateSpec(idx, 'value', e.target.value)}
                                placeholder="Giá trị (VD: Automatic)"
                                className="h-10 rounded-lg bg-slate-50 border-slate-200 text-sm flex-1"
                            />
                            <button
                                type="button"
                                onClick={() => removeSpec(idx)}
                                className="h-10 w-10 flex items-center justify-center rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 border border-slate-200 transition-all"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </EditorCard>
    );
};

export default ProductSpecifications;
