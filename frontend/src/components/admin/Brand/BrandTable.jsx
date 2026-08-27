import React, { useMemo } from 'react';
import { Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { Button } from '../../ui/button';
import DataTable from '../../ui/data-table';

const BrandTable = ({
    brands = [],
    loading = false,
    onEdit,
    onDelete,
    onToggle,
    pagination
}) => {
    const columns = useMemo(() => [
        {
            header: 'Thương hiệu',
            cell: ({ row }) => (
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center flex-shrink-0 shadow-sm">
                        {row.logo_url ? (
                            <img src={row.logo_url} alt={row.name} className="h-full w-full object-contain p-1" />
                        ) : (
                            <span className="text-slate-400 font-semibold text-xs">{row.name?.charAt(0)}</span>
                        )}
                    </div>
                    <p className="font-bold text-slate-800 text-sm uppercase">{row.name}</p>
                </div>
            )
        },
        {
            header: 'Slug',
            accessorKey: 'slug',
            cell: ({ value }) => <span className="text-slate-500 text-xs font-medium">{value || '—'}</span>
        },
        {
            header: 'Mô tả',
            accessorKey: 'description',
            cell: ({ value }) => <span className="text-slate-500 text-xs max-w-xs truncate block">{value || '—'}</span>
        },
        {
            header: 'Quốc gia',
            accessorKey: 'country',
            cell: ({ value }) => <span className="text-slate-500 text-xs font-medium uppercase">{value || '—'}</span>
        },
        {
            header: 'Sản phẩm',
            accessorKey: 'product_count',
            cell: ({ value }) => <span className="text-slate-800 text-sm font-bold">{value || 0}</span>
        },
        {
            header: 'Trạng thái',
            cell: ({ row }) => (
                <button onClick={() => onToggle(row)} className="flex items-center gap-1.5 focus:outline-none cursor-pointer">
                    {row.is_active ? (
                        <>
                            <ToggleRight className="h-4.5 w-4.5 text-emerald-500" />
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 uppercase">Hoạt động</span>
                        </>
                    ) : (
                        <>
                            <ToggleLeft className="h-4.5 w-4.5 text-slate-400" />
                            <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100 uppercase">Ẩn</span>
                        </>
                    )}
                </button>
            )
        },
        {
            header: 'Thao tác',
            align: 'right',
            stopRowClick: true,
            cell: ({ row }) => (
                <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(row)} className="h-7 w-7 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50">
                        <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(row)} className="h-7 w-7 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50">
                        <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                </div>
            )
        }
    ], [onEdit, onDelete, onToggle]);

    return (
        <DataTable
            columns={columns}
            data={brands}
            loading={loading}
            emptyMessage="Chưa có thương hiệu nào"
            pagination={pagination}
        />
    );
};

export default BrandTable;
