import React, { useMemo } from 'react';
import { Edit, Trash2, ToggleLeft, ToggleRight, ChevronRight } from 'lucide-react';
import { Button } from '../../ui/button';
import DataTable from '../../ui/data-table';

const CategoryTable = ({
    categories = [],
    loading = false,
    onEdit,
    onDelete,
    onToggle
}) => {
    const columns = useMemo(() => [
        {
            header: 'Tên danh mục',
            cell: ({ row }) => (
                <div className="flex items-center gap-1" style={{ paddingLeft: row.level * 16 }}>
                    {row.level > 0 && <ChevronRight className="h-3 w-3 text-slate-600 flex-shrink-0" />}
                    <span className={`${row.level === 0 ? 'font-bold text-slate-800' : 'font-medium text-slate-600'} text-sm`}>
                        {row.name}
                    </span>
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
            header: 'Cấp',
            cell: ({ row }) => (
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border shadow-sm uppercase ${row.level === 0 ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                    {row.level === 0 ? 'Gốc' : 'Con'}
                </span>
            )
        },
        {
            header: 'Trạng thái',
            cell: ({ row }) => (
                <button onClick={() => onToggle(row)} className="flex items-center gap-1.5 focus:outline-none cursor-pointer">
                    {row.is_active !== false ? (
                        <>
                            <ToggleRight className="h-4.5 w-4.5 text-emerald-500" />
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100 uppercase">Hiện</span>
                        </>
                    ) : (
                        <>
                            <ToggleLeft className="h-4.5 w-4.5 text-slate-400" />
                            <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2.5 py-0.5 rounded-full border border-slate-100 uppercase">Ẩn</span>
                        </>
                    )}
                </button>
            )
        },
        {
            header: 'Thứ tự',
            accessorKey: 'sort_order',
            cell: ({ value }) => <span className="text-slate-700 text-xs font-bold">{value ?? 0}</span>
        },
        {
            header: 'Thao tác',
            align: 'right',
            stopRowClick: true,
            cell: ({ row }) => (
                <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(row)} className="h-8 w-8 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 shadow-sm border border-transparent hover:border-amber-100 transition-all">
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(row)} className="h-8 w-8 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 shadow-sm border border-transparent hover:border-rose-100 transition-all">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            )
        }
    ], [onEdit, onDelete, onToggle]);

    return (
        <DataTable
            columns={columns}
            data={categories}
            loading={loading}
            emptyMessage="Chưa có danh mục nào"
            footer={
                <div className="px-4 py-2.5 border-t border-slate-50 bg-slate-50/30">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Tổng: {categories.length} danh mục</p>
                </div>
            }
        />
    );
};

export default CategoryTable;
