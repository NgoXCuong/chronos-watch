import React from 'react';
import { LayoutDashboard } from 'lucide-react';
import { Input } from '../../../ui/input';
import { Label, SectionTitle, EditorCard } from '../EditorUI';

const BasicInfo = ({ form, setForm }) => {
    return (
        <EditorCard className="space-y-5">
            <SectionTitle icon={LayoutDashboard}>Thông tin cơ bản</SectionTitle>

            <div className="space-y-4">
                <div>
                    <Label required>Tên sản phẩm</Label>
                    <Input
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="VD: Rolex Submariner Date Gold"
                        className="h-11 rounded-xl bg-slate-50 border-slate-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all"
                        required
                    />
                </div>

                <div>
                    <Label>Đường dẫn mẫu (Slug)</Label>
                    <Input
                        value={form.slug}
                        onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                        placeholder="VD: rolex-submariner-date-gold"
                        className="h-11 rounded-xl bg-slate-50 border-slate-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all"
                    />
                </div>
            </div>
        </EditorCard>
    );
};

export default BasicInfo;
