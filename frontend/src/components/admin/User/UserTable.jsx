import React from 'react';
import { 
    MoreVertical, 
    Mail, 
    History, 
    Shield, 
    UserX, 
    UserCheck 
} from 'lucide-react';
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger, 
    DropdownMenuSeparator 
} from '../../ui/dropdown-menu';
import { Button, buttonVariants } from '../../ui/button';
import { cn } from '../../../lib/utils';

const UserTable = ({ users, loading }) => {
    return (
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="px-8 py-5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Thành viên</th>
                            <th className="px-8 py-5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider text-center">Vai trò</th>
                            <th className="px-8 py-5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Gia nhập</th>
                            <th className="px-8 py-5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Trạng thái</th>
                            <th className="px-8 py-5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {loading && (
                            <tr><td colSpan="5" className="py-20 text-center"><div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" /></td></tr>
                        )}
                        {!loading && users.length === 0 && (
                            <tr><td colSpan="5" className="py-20 text-center text-slate-400 font-medium italic">Không tìm thấy thành viên nào</td></tr>
                        )}
                        {users.map((u) => (
                            <tr key={u.id} className="hover:bg-slate-50/50 transition-all group">
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 font-bold border border-slate-200 group-hover:bg-white group-hover:border-amber-200 group-hover:text-amber-600 transition-all shadow-sm">
                                            {u.username?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 group-hover:text-amber-700 transition-colors uppercase tracking-tight">{u.username}</p>
                                            <p className="text-[10px] text-slate-400 font-semibold tracking-wide">{u.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-5 text-center">
                                    <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border shadow-sm ${u.role === 'admin' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                                        {u.role}
                                    </span>
                                </td>
                                <td className="px-8 py-5 text-[11px] text-slate-500 font-bold uppercase tracking-tighter">
                                    {new Date(u.created_at).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                </td>
                                <td className="px-8 py-5">
                                    <span className={`flex items-center gap-2 text-[9px] font-bold px-3 py-1 rounded-xl border uppercase tracking-widest w-fit shadow-sm ${u.status === 'active' ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 'text-rose-600 bg-rose-50 border-rose-100'}`}>
                                        <span className={`h-1.5 w-1.5 rounded-full ${u.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                                        {u.status === 'active' ? 'Hoạt động' : 'Kiểm soát'}
                                    </span>
                                </td>
                                <td className="px-8 py-5 text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-10 w-10 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-white shadow-sm border border-transparent hover:border-slate-100 transition-all focus:outline-none focus:ring-0")}>
                                            <MoreVertical className="h-5 w-5" />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-56 p-2 bg-white rounded-[1.5rem] shadow-2xl border-slate-100 ring-1 ring-slate-200/50">
                                            <p className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 border-b border-slate-50">Hành động bảo mật</p>
                                            <DropdownMenuItem className="gap-3 cursor-pointer py-2.5 px-3 rounded-xl text-xs font-bold text-slate-700 focus:bg-slate-50 transition-all outline-none">
                                                <Mail className="h-4 w-4 text-slate-400" /> Liên hệ Email
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="gap-3 cursor-pointer py-2.5 px-3 rounded-xl text-xs font-bold text-slate-700 focus:bg-slate-50 transition-all outline-none">
                                                <History className="h-4 w-4 text-slate-400" /> Xem lịch sử
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator className="my-1 bg-slate-50" />
                                            <DropdownMenuItem className="gap-3 cursor-pointer py-2.5 px-3 rounded-xl text-xs font-bold text-amber-600 focus:bg-amber-50 transition-all outline-none">
                                                <Shield className="h-4 w-4" /> Thay đổi vai trò
                                            </DropdownMenuItem>
                                            {u.status === 'active' ? (
                                                <DropdownMenuItem className="gap-3 cursor-pointer py-2.5 px-3 rounded-xl text-xs font-bold text-rose-500 focus:bg-rose-50 transition-all outline-none">
                                                    <UserX className="h-4 w-4" /> Khóa tài khoản
                                                </DropdownMenuItem>
                                            ) : (
                                                <DropdownMenuItem className="gap-3 cursor-pointer py-2.5 px-3 rounded-xl text-xs font-bold text-emerald-600 focus:bg-emerald-50 transition-all outline-none">
                                                    <UserCheck className="h-4 w-4" /> Mở khóa
                                                </DropdownMenuItem>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="px-8 py-5 border-t border-slate-50 bg-slate-50/30">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Phân tích hồ sơ: {users.length} thành viên hiển thị</p>
            </div>
        </div>
    );
};

export default UserTable;
