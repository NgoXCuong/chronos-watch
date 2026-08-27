import React, { useMemo } from 'react';
import { Tag, Edit, Trash2 } from 'lucide-react';
import { Button } from '../../ui/button';
import DataTable from '../../ui/data-table';

const VoucherTable = ({
    vouchers = [],
    loading = false,
    searchTerm = '',
    formatCurrency,
    isExpired,
    onEdit,
    onDelete,
    pagination
}) => {
    const columns = useMemo(() => [
        {
            header: 'Mã code',
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Tag className="h-3 w-3 text-amber-500" />
                    <span className="font-semibold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-100 text-xs">{row.code}</span>
                </div>
            )
        },
        {
            header: 'Loại',
            accessorKey: 'discount_type',
            cell: ({ value }) => (
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${value === 'percentage' ? 'bg-blue-200 text-blue-800 border-blue-100' : 'bg-purple-100 text-purple-800 border-purple-100'}`}>
                    {value === 'percentage' ? 'Phần trăm' : 'Số tiền'}
                </span>
            )
        },
        {
            header: 'Giá trị',
            cell: ({ row }) => (
                <span className="font-bold text-slate-800 text-sm">
                    {row.discount_type === 'percentage' ? `${row.discount_value}%` : formatCurrency(row.discount_value)}
                    {row.max_discount && <span className="text-[10px] text-slate-800 ml-1">(max {formatCurrency(row.max_discount)})</span>}
                </span>
            )
        },
        {
            header: 'Đơn tối thiểu',
            accessorKey: 'min_order_value',
            cell: ({ value }) => <span className="text-slate-800 text-sm">{value ? formatCurrency(value) : '—'}</span>
        },
        {
            header: 'Hạn dùng',
            cell: ({ row }) => {
                const expired = isExpired(row.end_date);
                return row.end_date ? (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${expired ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                        {expired ? 'Hết hạn' : new Date(row.end_date).toLocaleDateString('vi-VN')}
                    </span>
                ) : <span className="text-slate-400 text-xs">Không giới hạn</span>;
            }
        },
        {
            header: 'Đã dùng',
            cell: ({ row }) => <span className="text-slate-800 text-sm">{row.used_count || 0}/{row.usage_limit || '∞'}</span>
        },
        {
            header: 'Thao tác',
            align: 'right',
            stopRowClick: true,
            cell: ({ row }) => (
                <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(row)} className="h-7 w-7 rounded-lg text-slate-800 hover:text-amber-600 hover:bg-amber-50 cursor-pointer">
                        <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(row)} className="h-7 w-7 rounded-lg text-slate-800 hover:text-rose-600 hover:bg-rose-50 cursor-pointer">
                        <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                </div>
            )
        }
    ], [formatCurrency, isExpired, onDelete, onEdit]);

    return (
        <DataTable
            columns={columns}
            data={vouchers}
            loading={loading}
            rowClassName={(row) => (isExpired(row.end_date) ? 'opacity-60' : '')}
            emptyMessage={searchTerm ? "Không tìm thấy mã giảm giá nào phù hợp" : "Chưa có mã giảm giá nào"}
            pagination={pagination}
        />
    );
};

export default VoucherTable;
