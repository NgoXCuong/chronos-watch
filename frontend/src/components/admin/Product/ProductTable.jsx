import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '../../ui/button';
import AdminPagination from '../Common/AdminPagination';

const ProductTable = ({
    products,
    loading,
    selectedIds,
    toggleSelect,
    toggleSelectAll,
    isAllSelected,
    formatCurrency,
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
                            <th className="px-4 py-4 w-10">
                                <input
                                    type="checkbox"
                                    checked={isAllSelected && products.length > 0}
                                    onChange={toggleSelectAll}
                                    className="h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                                />
                            </th>
                            <th className="px-4 py-4 text-xs font-semibold text-slate-500 uppercase ">Sản phẩm</th>
                            <th className="px-4 py-4 text-xs font-semibold text-slate-500 uppercase ">Danh mục</th>
                            <th className="px-4 py-4 text-xs font-semibold text-slate-500 uppercase ">Giá bán</th>
                            <th className="px-4 py-4 text-xs font-semibold text-slate-500 uppercase ">Kho</th>
                            <th className="px-4 py-4 text-xs font-semibold text-slate-500 uppercase ">Trạng thái</th>
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
                        {!loading && !products.length && (
                            <tr>
                                <td colSpan={7} className="py-10 text-center text-slate-400 text-sm">
                                    Không tìm thấy sản phẩm nào
                                </td>
                            </tr>
                        )}
                        {products.map(product => (
                            <tr key={product.id} className={`hover:bg-slate-50/80 transition-colors group ${selectedIds.includes(product.id) ? 'bg-amber-50/30' : ''}`}>
                                <td className="px-4 py-3">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.includes(product.id)}
                                        onChange={() => toggleSelect(product.id)}
                                        className="h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                                    />
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="h-12 w-12 rounded-lg bg-gray-50 border border-slate-200 overflow-hidden flex-shrink-0 shadow-sm transition-transform group-hover:scale-105">
                                            {product.image_url
                                                ? <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
                                                : <div className="h-full w-full flex items-center justify-center text-slate-600 text-[10px]">No img</div>}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-bold text-slate-800 truncate max-w-[180px] group-hover:text-amber-600 transition-colors text-sm">{product.name}</p>
                                            <p className="text-[11px] font-medium text-slate-400">{product.brand?.name}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex flex-wrap gap-1">
                                        {product.categories?.map(cat => (
                                            <span key={cat.id} className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200/50">{cat.name}</span>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-4 py-3 font-bold text-slate-900 text-sm">{formatCurrency(product.price)}</td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-1.5">
                                        <span className={`font-bold text-sm ${product.stock === 0 ? 'text-rose-500' : product.stock <= 5 ? 'text-amber-500' : 'text-slate-700'}`}>{product.stock}</span>
                                        {product.stock <= 5 && <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />}
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border shadow-sm ${product.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                                        {product.status === 'active' ? 'Đang bán' : 'Ngừng bán'}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onEdit(product.id)}
                                            className="h-8 w-8 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 shadow-sm border border-transparent hover:border-amber-100 transition-all"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onDelete(product)}
                                            className="h-8 w-8 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 shadow-sm border border-transparent hover:border-rose-100 transition-all"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {pagination && (
                <AdminPagination {...pagination} />
            )}
        </div>
    );
};

export default ProductTable;
