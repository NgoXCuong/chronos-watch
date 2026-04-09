import React from 'react';
import { Edit, Trash2, ToggleLeft, ToggleRight, ChevronRight } from 'lucide-react';
import { Button } from '../../ui/button';

const CategoryTable = ({
    categories,
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
                            <th className="px-4 py-4 text-xs font-semibold text-slate-500 uppercase ">Tên danh mục</th>
                            <th className="px-4 py-4 text-xs font-semibold text-slate-500 uppercase ">Slug</th>
                            <th className="px-4 py-4 text-xs font-semibold text-slate-500 uppercase ">Mô tả</th>
                            <th className="px-4 py-4 text-xs font-semibold text-slate-500 uppercase ">Cấp</th>
                            <th className="px-4 py-4 text-xs font-semibold text-slate-500 uppercase font-bold">Trạng thái</th>
                            <th className="px-4 py-4 text-xs font-semibold text-slate-500 uppercase ">Thứ tự</th>
                            <th className="px-4 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {loading && (
                            <tr>
                                <td colSpan={7} className="py-10 text-center">
                                    <div className="w-7 h-7 border-2 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto" />
                                </td>
                            </tr>
                        )}
                        {!loading && !categories.length && (
                            <tr>
                                <td colSpan={7} className="py-8 text-center text-slate-400 text-sm font-medium">
                                    Chưa có danh mục nào
                                </td>
                            </tr>
                        )}
                        {categories.map(cat => (
                            <tr key={cat.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-1" style={{ paddingLeft: cat.level * 16 }}>
                                        {cat.level > 0 && <ChevronRight className="h-3 w-3 text-slate-600 flex-shrink-0" />}
                                        <span className={`${cat.level === 0 ? 'font-bold text-slate-800' : 'font-medium text-slate-600'} text-sm `}>{cat.name}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-slate-500 text-xs font-medium">{cat.slug || '—'}</td>
                                <td className="px-4 py-3 text-slate-500 text-xs max-w-xs truncate">{cat.description || '—'}</td>
                                <td className="px-4 py-3">
                                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border shadow-sm uppercase ${cat.level === 0 ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                                        {cat.level === 0 ? 'Gốc' : 'Con'}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <button onClick={() => onToggle(cat)} className="flex items-center gap-1.5 focus:outline-none">
                                        {cat.is_active !== false
                                            ? <><ToggleRight className="h-4.5 w-4.5 text-emerald-500" /><span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100 uppercase">Hiện</span></>
                                            : <><ToggleLeft className="h-4.5 w-4.5 text-slate-400" /><span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2.5 py-0.5 rounded-full border border-slate-100 uppercase">Ẩn</span></>}
                                    </button>
                                </td>
                                <td className="px-4 py-3 text-slate-700 text-xs font-bold">{cat.sort_order ?? 0}</td>
                                <td className="px-4 py-3 text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <Button variant="ghost" size="icon" onClick={() => onEdit(cat)} className="h-8 w-8 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 shadow-sm border border-transparent hover:border-amber-100 transition-all">
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => onDelete(cat)} className="h-8 w-8 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 shadow-sm border border-transparent hover:border-rose-100 transition-all">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="px-4 py-2.5 border-t border-slate-50 bg-slate-50/30">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Tổng: {categories.length} danh mục</p>
            </div>
        </div>
    );
};

export default CategoryTable;
