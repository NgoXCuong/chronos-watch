import React, { useMemo } from 'react';
import {
    MoreVertical,
    Mail,
    Shield,
    UserX,
    UserCheck
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import { Button, buttonVariants } from '../../ui/button';
import DataTable from '../../ui/data-table';
import { cn } from '../../../lib/utils';

const UserTable = ({
    users = [],
    loading = false,
    onUpdateStatus,
    onUpdateRole,
    pagination
}) => {
    const columns = useMemo(() => [
        {
            header: 'Thành viên',
            headerClassName: 'px-8 py-5',
            className: 'px-8 py-3',
            cell: ({ row }) => (
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200 group-hover:border-amber-200 transition-all shadow-sm">
                        {row.avatar_url ? (
                            <img
                                src={row.avatar_url}
                                alt={row.full_name || row.username}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <span className="text-slate-400 font-bold group-hover:text-amber-600 transition-all">
                                {(row.full_name || row.username)?.charAt(0).toUpperCase() || 'U'}
                            </span>
                        )}
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                            {row.full_name || row.username}
                        </p>
                        <p className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                            <Mail className="h-3 w-3" /> {row.email}
                        </p>
                    </div>
                </div>
            )
        },
        {
            header: 'Vai trò',
            align: 'center',
            headerClassName: 'px-8 py-5',
            className: 'px-8 py-3 text-center',
            cell: ({ row }) => (
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold border shadow-sm ${row.role === 'admin' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-slate-50 text-slate-600 border-slate-100'}`}>
                    {row.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}
                </span>
            )
        },
        {
            header: 'Gia nhập',
            headerClassName: 'px-8 py-5',
            className: 'px-8 py-3 text-[11px] text-slate-500 font-bold',
            cell: ({ row }) => new Date(row.created_at).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
        },
        {
            header: 'Trạng thái',
            headerClassName: 'px-8 py-5',
            className: 'px-8 py-3',
            cell: ({ row }) => (
                <span className={`flex items-center gap-2 text-[10px] font-bold px-3 py-1 rounded-xl border w-fit shadow-sm ${row.status === 'active' ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 'text-rose-600 bg-rose-50 border-rose-100'}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${row.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                    {row.status === 'active' ? 'Hoạt động' : 'Kiểm soát'}
                </span>
            )
        },
        {
            header: 'Thao tác',
            align: 'right',
            stopRowClick: true,
            headerClassName: 'px-8 py-5',
            className: 'px-8 py-3',
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-10 w-10 text-slate-400 hover:text-slate-900 hover:bg-white shadow-sm border border-transparent hover:border-slate-100 transition-all focus:outline-none focus:ring-0 cursor-pointer")}>
                        <MoreVertical className="h-5 w-5" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 p-2 bg-white shadow-2xl border-slate-100 ring-1 ring-slate-200/50">
                        <p className="px-3 py-2 text-[12px] font-bold text-slate-600 uppercase mb-1 border-b border-slate-50">Hành động bảo mật</p>

                        <DropdownMenuItem
                            onClick={() => onUpdateRole(row.id, row.role)}
                            className="gap-3 cursor-pointer py-2.5 px-3 rounded-xl text-xs font-bold text-amber-600 focus:bg-amber-50 transition-all outline-none"
                        >
                            <Shield className="h-4 w-4" /> Thay đổi vai trò
                        </DropdownMenuItem>

                        {row.status === 'active' ? (
                            <DropdownMenuItem
                                onClick={() => onUpdateStatus(row.id, row.status)}
                                className="gap-3 cursor-pointer py-2.5 px-3 rounded-xl text-xs font-bold text-rose-500 focus:bg-rose-50 transition-all outline-none"
                            >
                                <UserX className="h-4 w-4" /> Khóa tài khoản
                            </DropdownMenuItem>
                        ) : (
                            <DropdownMenuItem
                                onClick={() => onUpdateStatus(row.id, row.status)}
                                className="gap-3 cursor-pointer py-2.5 px-3 rounded-xl text-xs font-bold text-emerald-600 focus:bg-emerald-50 transition-all outline-none"
                            >
                                <UserCheck className="h-4 w-4" /> Mở khóa
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    ], [onUpdateRole, onUpdateStatus]);

    return (
        <DataTable
            columns={columns}
            data={users}
            loading={loading}
            rowClassName="group"
            emptyMessage="Không tìm thấy thành viên nào"
            pagination={pagination}
        />
    );
};

export default UserTable;
