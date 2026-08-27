import React, { useMemo } from 'react';
import { Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '../../ui/button';
import DataTable from '../../ui/data-table';

const ProductTable = ({
    products = [],
    loading = false,
    selectedIds = [],
    toggleSelect,
    toggleSelectAll,
    isAllSelected = false,
    formatCurrency,
    onEdit,
    onDelete,
    onView,
    pagination
}) => {
    const columns = useMemo(() => [
        {
            id: 'selection',
            width: 40,
            stopRowClick: true,
            header: () => (
                <input
                    type="checkbox"
                    checked={isAllSelected && products.length > 0}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                />
            ),
            cell: ({ row }) => (
                <input
                    type="checkbox"
                    checked={selectedIds.includes(row.id)}
                    onChange={() => toggleSelect(row.id)}
                    className="h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                />
            )
        },
        {
            header: 'Sản phẩm',
            cell: ({ row }) => (
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-gray-50 border border-slate-200 overflow-hidden flex-shrink-0 shadow-sm transition-transform group-hover:scale-105">
                        {row.image_url ? (
                            <img src={row.image_url} alt={row.name} className="h-full w-full object-cover" />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center text-slate-600 text-[10px]">No img</div>
                        )}
                    </div>
                    <div className="min-w-0">
                        <p className="font-bold text-slate-800 truncate max-w-[180px] group-hover:text-amber-600 transition-colors text-sm">{row.name}</p>
                        <p className="text-[11px] font-medium text-slate-400">{row.brand?.name}</p>
                    </div>
                </div>
            )
        },
        {
            header: 'Danh mục',
            cell: ({ row }) => (
                <div className="flex flex-wrap gap-1">
                    {row.categories?.map(cat => (
                        <span key={cat.id} className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200/50">{cat.name}</span>
                    ))}
                </div>
            )
        },
        {
            header: 'Giá bán',
            accessorKey: 'price',
            cell: ({ value }) => <span className="font-bold text-slate-900 text-sm">{formatCurrency(value)}</span>
        },
        {
            header: 'Kho',
            cell: ({ row }) => (
                <div className="flex items-center gap-1.5">
                    <span className={`font-bold text-sm ${row.stock === 0 ? 'text-rose-500' : row.stock <= 5 ? 'text-amber-500' : 'text-slate-700'}`}>{row.stock}</span>
                    {row.stock <= 5 && <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />}
                </div>
            )
        },
        {
            header: 'Trạng thái',
            cell: ({ row }) => (
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border shadow-sm ${row.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                    {row.status === 'active' ? 'Đang bán' : 'Ngừng bán'}
                </span>
            )
        },
        {
            header: 'Thao tác',
            align: 'right',
            stopRowClick: true,
            cell: ({ row }) => (
                <div className="flex items-center justify-end gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onView(row.slug)}
                        className="h-8 w-8 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 shadow-sm border border-transparent hover:border-blue-100 transition-all cursor-pointer"
                        title="Xem chi tiết"
                    >
                        <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(row.id)}
                        className="h-8 w-8 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 shadow-sm border border-transparent hover:border-amber-100 transition-all cursor-pointer"
                    >
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(row)}
                        className="h-8 w-8 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 shadow-sm border border-transparent hover:border-rose-100 transition-all cursor-pointer"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            )
        }
    ], [formatCurrency, isAllSelected, onDelete, onEdit, onView, products.length, selectedIds, toggleSelect, toggleSelectAll]);

    return (
        <DataTable
            columns={columns}
            data={products}
            loading={loading}
            selectedRowKeys={selectedIds}
            emptyMessage="Không tìm thấy sản phẩm nào"
            pagination={pagination}
        />
    );
};

export default ProductTable;
