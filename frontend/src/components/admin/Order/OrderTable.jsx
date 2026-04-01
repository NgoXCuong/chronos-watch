import React from 'react';
import { 
    MoreVertical, 
    Eye, 
    CheckCircle2, 
    Truck, 
    Package, 
    XCircle, 
    RefreshCcw,
    ShoppingBag
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

const STATUS_CONFIG = {
    pending:   { label: 'Chờ duyệt',   bg: 'bg-amber-50',   text: 'text-amber-600',  border: 'border-amber-100',  dot: 'bg-amber-500', icon: Package },
    confirmed: { label: 'Đã xác nhận', bg: 'bg-blue-50',    text: 'text-blue-600',   border: 'border-blue-100',   dot: 'bg-blue-500', icon: CheckCircle2 },
    processing: { label: 'Đang xử lý', bg: 'bg-indigo-50',  text: 'text-indigo-600', border: 'border-indigo-100', dot: 'bg-indigo-500', icon: RefreshCcw },
    shipped:   { label: 'Đang giao',   bg: 'bg-purple-50',  text: 'text-purple-600', border: 'border-purple-100', dot: 'bg-purple-500', icon: Truck },
    delivered: { label: 'Hoàn thành',  bg: 'bg-emerald-50', text: 'text-emerald-600',border: 'border-emerald-100',dot: 'bg-emerald-500', icon: CheckCircle2 },
    cancelled: { label: 'Đã hủy',      bg: 'bg-rose-50',    text: 'text-rose-600',   border: 'border-rose-100',   dot: 'bg-rose-500', icon: XCircle },
    returned:  { label: 'Hoàn hàng',   bg: 'bg-slate-50',   text: 'text-slate-500',  border: 'border-slate-100',  dot: 'bg-slate-400', icon: RefreshCcw },
};

const StatusBadge = ({ status }) => {
    const s = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
    return (
        <span className={`flex items-center gap-1.5 text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider w-fit border ${s.bg} ${s.text} ${s.border}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
            {s.label}
        </span>
    );
};

const OrderTable = ({ 
    orders, 
    loading, 
    onStatusUpdate, 
    onView, 
    formatCurrency, 
    updatingId 
}) => {
    return (
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Mã đơn</th>
                            <th className="px-6 py-5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Khách hàng</th>
                            <th className="px-6 py-5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Ngày đặt</th>
                            <th className="px-6 py-5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Tổng tiền</th>
                            <th className="px-6 py-5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Thanh toán</th>
                            <th className="px-6 py-5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Trạng thái</th>
                            <th className="px-6 py-5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {loading && (
                            <tr><td colSpan={7} className="py-20 text-center"><div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" /></td></tr>
                        )}
                        {!loading && !orders.length && (
                            <tr>
                                <td colSpan={7} className="py-24 text-center">
                                    <div className="flex flex-col items-center justify-center space-y-3">
                                        <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center border-2 border-dashed border-slate-100">
                                            <ShoppingBag className="h-8 w-8 text-slate-200" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-400">Không tìm thấy đơn hàng nào</p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        )}
                        {orders.map(order => (
                            <tr 
                                key={order.id} 
                                className="hover:bg-slate-50/50 transition-all cursor-pointer group"
                                onClick={() => onView(order.id)}
                            >
                                <td className="px-6 py-5">
                                    <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-xl border border-amber-100 shadow-sm">#{order.id}</span>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="h-9 w-9 rounded-xl bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 border border-slate-200 flex-shrink-0 group-hover:bg-white transition-colors">
                                            {order.user?.username?.charAt(0)?.toUpperCase() || 'U'}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800 text-sm">{order.user?.username || 'Khách vãng lai'}</p>
                                            <p className="text-[10px] text-slate-400 font-medium">{order.user?.email || 'N/A'}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-xs text-slate-500 font-medium">
                                    {new Date(order.created_at).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                </td>
                                <td className="px-6 py-5 font-bold text-slate-900 text-sm font-price">
                                    {formatCurrency(order.total_amount)}
                                </td>
                                <td className="px-6 py-5">
                                    <span className="text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100 uppercase tracking-tighter">
                                        {order.payment_method}
                                    </span>
                                </td>
                                <td className="px-6 py-5">
                                    <StatusBadge status={order.status} />
                                </td>
                                <td className="px-6 py-5 text-right" onClick={e => e.stopPropagation()}>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-10 w-10 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-white shadow-sm border border-transparent hover:border-slate-100 transition-all focus:outline-none focus:ring-0")}>
                                            <MoreVertical className="h-5 w-5" />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-56 p-2 bg-white rounded-[1.5rem] shadow-2xl border-slate-100 ring-1 ring-slate-200/50">
                                            <DropdownMenuItem className="gap-3 cursor-pointer py-2.5 px-3 rounded-xl text-xs font-bold text-slate-700 outline-none" onClick={() => onView(order.id)}>
                                                <Eye className="h-4 w-4 text-slate-400" /> Chi tiết đơn hàng
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator className="my-1 bg-slate-50" />
                                            <p className="px-3 py-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 border-b border-slate-50">Cập nhật nhanh</p>
                                            
                                            {updatingId === order.id ? (
                                                <div className="py-4 text-center"><RefreshCw className="h-4 w-4 animate-spin mx-auto text-amber-600" /></div>
                                            ) : (
                                                Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                                                    <DropdownMenuItem 
                                                        key={key}
                                                        className={cn("gap-3 cursor-pointer py-2 px-3 rounded-lg text-[11px] font-bold outline-none", order.status === key ? "bg-slate-50 opacity-50" : "hover:bg-slate-50")}
                                                        disabled={order.status === key}
                                                        onClick={() => onStatusUpdate(order.id, key)}
                                                    >
                                                        <cfg.icon className={cn("h-3.5 w-3.5", cfg.text)} />
                                                        {cfg.label}
                                                    </DropdownMenuItem>
                                                ))
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderTable;
export { STATUS_CONFIG };
