import React from 'react';
import { DollarSign, Box } from 'lucide-react';
import { Input } from '../../../ui/input';
import { Label, SectionTitle, EditorCard } from '../EditorUI';

const ProductPricing = ({ form, setForm }) => {
    return (
        <EditorCard className="space-y-5">
            <SectionTitle icon={DollarSign}>Giá & Kho hàng</SectionTitle>
            <div className="space-y-4">
                <div>
                    <Label required>Giá bán (VND)</Label>
                    <div className="relative">
                        <Input
                            type="number"
                            value={form.price}
                            onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                            className="h-11 pl-4 rounded-xl bg-slate-50 border-slate-200 font-bold text-amber-700"
                            placeholder="0"
                        />
                    </div>
                </div>
                <div>
                    <Label>Giá gốc (VND)</Label>
                    <Input
                        type="number"
                        value={form.old_price}
                        onChange={e => setForm(f => ({ ...f, old_price: e.target.value }))}
                        className="h-11 pl-4 rounded-xl bg-slate-50 border-slate-200 text-slate-400"
                        placeholder="0"
                    />
                </div>
                <div>
                    <Label>Tồn kho</Label>
                    <div className="relative">
                        <Box className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
                        <Input
                            type="number"
                            value={form.stock}
                            onChange={e => setForm(f => ({ ...f, stock: e.target.value }))}
                            className="h-11 rounded-xl bg-slate-50 border-slate-200"
                        />
                    </div>
                </div>
                <div>
                    <Label>Trạng thái</Label>
                    <select
                        value={form.status}
                        onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                        className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all outline-none"
                    >
                        <option value="active">Đang kinh doanh</option>
                        <option value="inactive">Tạm ngừng bán</option>
                    </select>
                </div>
            </div>
        </EditorCard>
    );
};

export default ProductPricing;
