import React from 'react';
import { Edit, Trash2, Globe, Layout, Layers, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '../../ui/button';
import { cn } from '../../../lib/utils';

const POSITION_LABELS = {
    'home_main': { label: 'Slide chính', color: 'bg-blue-50 text-blue-600 border-blue-100', icon: Layout },
    'home_sidebar': { label: 'Cạnh Slide', color: 'bg-indigo-50 text-indigo-600 border-indigo-100', icon: Layers },
    'popup': { label: 'Popup quảng cáo', color: 'bg-rose-50 text-rose-600 border-rose-100', icon: Globe }
};

const BannerTable = ({
    banners,
    loading,
    onEdit,
    onDelete,
    onToggleStatus
}) => {
    return (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Banner</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Vị trí</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Thứ tự</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Trạng thái</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {loading && (
                            <tr>
                                <td colSpan={5} className="py-20 text-center">
                                    <div className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto" />
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4">Đang tải dữ liệu...</p>
                                </td>
                            </tr>
                        )}
                        {!loading && banners.length === 0 && (
                            <tr>
                                <td colSpan={5} className="py-20 text-center">
                                    <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Layout className="h-8 w-8 text-slate-200" />
                                    </div>
                                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Chưa có banner nào</p>
                                    <p className="text-[10px] text-slate-300 uppercase tracking-widest mt-1">Vui lòng thêm banner mới để hiển thị trên website</p>
                                </td>
                            </tr>
                        )}
                        {banners.map(banner => {
                            const pos = POSITION_LABELS[banner.position] || { label: banner.position, color: 'bg-slate-50 text-slate-600 border-slate-100', icon: Layout };
                            return (
                                <tr key={banner.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="h-16 w-32 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0 shadow-sm relative group-hover:shadow-md transition-all duration-300">
                                                {banner.image_url ? (
                                                    <img src={banner.image_url} alt={banner.title} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center text-slate-300">
                                                        <Layout size={20} />
                                                    </div>
                                                )}
                                                {!banner.is_active && (
                                                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center">
                                                        <span className="text-[8px] font-bold text-white uppercase tracking-[0.2em] border border-white/50 px-2 py-0.5 rounded">Đã ẩn</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-bold text-slate-800 text-sm truncate max-w-[200px]">{banner.title || 'Không có tiêu đề'}</p>
                                                <p className="text-[10px] text-slate-400 truncate max-w-[200px] font-medium mt-0.5 italic">{banner.link_url || 'Không gắn link'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border font-bold text-[10px] uppercase tracking-wider shadow-sm", pos.color)}>
                                            <pos.icon size={12} />
                                            {pos.label}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center">
                                            <span className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-[11px] font-black text-slate-600 shadow-inner border border-slate-200/50">
                                                {banner.sort_order}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button 
                                            onClick={() => onToggleStatus(banner.id)}
                                            className={cn(
                                                "flex items-center gap-1.5 px-3 py-1 rounded-lg border font-bold text-[10px] uppercase tracking-widest transition-all shadow-sm active:scale-95",
                                                banner.is_active 
                                                    ? "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100" 
                                                    : "bg-rose-50 text-rose-400 border-rose-100 hover:bg-rose-100"
                                            )}
                                        >
                                            {banner.is_active ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                                            {banner.is_active ? 'Hiển thị' : 'Đã ẩn'}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                onClick={() => onEdit(banner)} 
                                                className="h-9 w-9 rounded-xl text-slate-400 hover:text-amber-600 hover:bg-amber-50 shadow-sm border border-transparent hover:border-amber-100 transition-all active:scale-90"
                                            >
                                                <Edit className="h-4.5 w-4.5" />
                                            </Button>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                onClick={() => onDelete(banner)} 
                                                className="h-9 w-9 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 shadow-sm border border-transparent hover:border-rose-100 transition-all active:scale-90"
                                            >
                                                <Trash2 className="h-4.5 w-4.5" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BannerTable;
