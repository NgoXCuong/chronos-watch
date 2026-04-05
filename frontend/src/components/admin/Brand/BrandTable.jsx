import React from 'react';
import { Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { Button } from '../../ui/button';

const BrandTable = ({
    brands,
    loading,
    onEdit,
    onDelete,
    onToggle
}) => {
    return (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="px-4 py-4 text-xs font-semibold text-slate-500 uppercase ">Thương hiệu</th>
                            <th className="px-4 py-4 text-xs font-semibold text-slate-500 uppercase ">Slug</th>
                            <th className="px-4 py-4 text-xs font-semibold text-slate-500 uppercase ">Mô tả</th>
                            <th className="px-4 py-4 text-xs font-semibold text-slate-500 uppercase ">Quốc gia</th>
                            <th className="px-4 py-4 text-xs font-semibold text-slate-500 uppercase ">Trạng thái</th>
                            <th className="px-4 py-4 text-xs font-semibold text-slate-500 uppercase ">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {loading && (
                            <tr>
                                <td colSpan={6} className="py-10 text-center">
                                    <div className="w-7 h-7 border-2 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto" />
                                </td>
                            </tr>
                        )}
                        {!loading && !brands.length && (
                            <tr>
                                <td colSpan={6} className="py-8 text-center text-slate-400 text-sm">
                                    Chưa có thương hiệu nào
                                </td>
                            </tr>
                        )}
                        {brands.map(brand => (
                            <tr key={brand.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="h-9 w-9 rounded-lg bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center flex-shrink-0 shadow-sm">
                                            {brand.logo_url
                                                ? <img src={brand.logo_url} alt={brand.name} className="h-full w-full object-contain p-1" />
                                                : <span className="text-slate-400 font-semibold text-xs">{brand.name?.charAt(0)}</span>}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800 text-sm uppercase">{brand.name}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-slate-500 text-xs font-medium">{brand.slug || '—'}</td>
                                <td className="px-4 py-3 text-slate-500 text-xs max-w-xs truncate">{brand.description || '—'}</td>
                                <td className="px-4 py-3 text-slate-500 text-xs font-medium uppercase">{brand.country || '—'}</td>
                                <td className="px-4 py-3">
                                    <button onClick={() => onToggle(brand)} className="flex items-center gap-1.5 focus:outline-none">
                                        {brand.is_active
                                            ? <><ToggleRight className="h-4.5 w-4.5 text-emerald-500" /><span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 uppercase">Hoạt động</span></>
                                            : <><ToggleLeft className="h-4.5 w-4.5 text-slate-400" /><span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100 uppercase">Ẩn</span></>}
                                    </button>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <Button variant="ghost" size="icon" onClick={() => onEdit(brand)} className="h-7 w-7 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50">
                                            <Edit className="h-3.5 w-3.5" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => onDelete(brand)} className="h-7 w-7 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50">
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="px-4 py-2.5 border-t border-slate-50 bg-slate-50/30">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Tổng: {brands.length} thương hiệu</p>
            </div>
        </div>
    );
};

export default BrandTable;
