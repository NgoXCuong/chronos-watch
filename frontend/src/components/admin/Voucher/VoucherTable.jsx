import React from 'react';
import { Tag, Edit, Trash2 } from 'lucide-react';
import { Button } from '../../ui/button';
import AdminPagination from '../Common/AdminPagination';

const VoucherTable = ({
    vouchers,
    loading,
    searchTerm,
    formatCurrency,
    isExpired,
    onEdit,
    onDelete,
    pagination
}) => {

    return (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="px-4 py-4 text-xs font-semibold text-slate-500 uppercase">Mã code</th>
                            <th className="px-4 py-4 text-xs font-semibold text-slate-500 uppercase">Loại</th>
                            <th className="px-4 py-4 text-xs font-semibold text-slate-500 uppercase">Giá trị</th>
                            <th className="px-4 py-4 text-xs font-semibold text-slate-500 uppercase">Đơn tối thiểu</th>
                            <th className="px-4 py-4 text-xs font-semibold text-slate-500 uppercase">Hạn dùng</th>
                            <th className="px-4 py-4 text-xs font-semibold text-slate-500 uppercase">Đã dùng</th>
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
                        {!loading && vouchers.length === 0 && (
                            <tr>
                                <td colSpan={7} className="py-8 text-center text-slate-400 text-sm">
                                    {searchTerm ? "Không tìm thấy mã giảm giá nào phù hợp" : "Chưa có mã giảm giá nào"}
                                </td>
                            </tr>
                        )}
                        {vouchers.map(v => {
                            const expired = isExpired(v.end_date);
                            return (
                                <tr key={v.id} className={`hover:bg-slate-50/50 transition-colors ${expired ? 'opacity-60' : ''}`}>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <Tag className="h-3 w-3 text-amber-500" />
                                            <span className="font-semibold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-100 text-xs">{v.code}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${v.discount_type === 'percentage' ? 'bg-blue-200 text-blue-800 border-blue-100' : 'bg-purple-100 text-purple-800 border-purple-100'}`}>
                                            {v.discount_type === 'percentage' ? 'Phần trăm' : 'Số tiền'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 font-bold text-slate-800 text-sm">
                                        {v.discount_type === 'percentage' ? `${v.discount_value}%` : formatCurrency(v.discount_value)}
                                        {v.max_discount && <span className="text-[10px] text-slate-800 ml-1">(max {formatCurrency(v.max_discount)})</span>}
                                    </td>
                                    <td className="px-4 py-3 text-slate-800 text-sm">{v.min_order_value ? formatCurrency(v.min_order_value) : '—'}</td>
                                    <td className="px-4 py-3">
                                        {v.end_date ? (
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${expired ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                                                {expired ? 'Hết hạn' : new Date(v.end_date).toLocaleDateString('vi-VN')}
                                            </span>
                                        ) : <span className="text-slate-400 text-xs">Không giới hạn</span>}
                                    </td>
                                    <td className="px-4 py-3 text-slate-800 text-sm">{v.used_count || 0}/{v.usage_limit || '∞'}</td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button variant="ghost" size="icon" onClick={() => onEdit(v)} className="h-7 w-7 rounded-lg text-slate-800 hover:text-amber-600 hover:bg-amber-50">
                                                <Edit className="h-3.5 w-3.5" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => onDelete(v)} className="h-7 w-7 rounded-lg text-slate-800 hover:text-rose-600 hover:bg-rose-50">
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            {pagination && (
                <AdminPagination {...pagination} />
            )}
        </div>
    );
};

export default VoucherTable;
