import React, { useMemo } from "react";
import {
  MoreVertical,
  Eye,
  CheckCircle2,
  Truck,
  Package,
  XCircle,
  RefreshCcw,
  ShoppingBag,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../../ui/dropdown-menu";
import { Button, buttonVariants } from "../../ui/button";
import DataTable from "../../ui/data-table";
import { cn } from "../../../lib/utils";

const STATUS_CONFIG = {
  pending: {
    label: "Chờ duyệt",
    bg: "bg-amber-50",
    text: "text-amber-600",
    border: "border-amber-100",
    dot: "bg-amber-500",
    icon: Package,
  },
  confirmed: {
    label: "Đã xác nhận",
    bg: "bg-blue-50",
    text: "text-blue-600",
    border: "border-blue-100",
    dot: "bg-blue-500",
    icon: CheckCircle2,
  },
  processing: {
    label: "Đang xử lý",
    bg: "bg-indigo-50",
    text: "text-indigo-600",
    border: "border-indigo-100",
    dot: "bg-indigo-500",
    icon: RefreshCcw,
  },
  shipping: {
    label: "Đang giao",
    bg: "bg-purple-50",
    text: "text-purple-600",
    border: "border-purple-100",
    dot: "bg-purple-500",
    icon: Truck,
  },
  delivered: {
    label: "Hoàn thành",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    border: "border-emerald-100",
    dot: "bg-emerald-500",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Đã hủy",
    bg: "bg-rose-50",
    text: "text-rose-600",
    border: "border-rose-100",
    dot: "bg-rose-500",
    icon: XCircle,
  },
  returned: {
    label: "Hoàn hàng",
    bg: "bg-slate-50",
    text: "text-slate-500",
    border: "border-slate-100",
    dot: "bg-slate-400",
    icon: RefreshCcw,
  },
};

const ORDER_STATUS_TRANSITIONS = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['processing', 'cancelled'],
  processing: ['shipping', 'cancelled'],
  shipping: ['delivered'],
  delivered: ['returned'],
  cancelled: [],
  returned: [],
};

const StatusBadge = ({ status }) => {
  const s = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <span
      className={`flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase w-fit border ${s.bg} ${s.text} ${s.border}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
};

const OrderTable = ({
  orders = [],
  loading = false,
  onStatusUpdate,
  onView,
  formatCurrency,
  updatingId,
  pagination,
}) => {
  const columns = useMemo(() => [
    {
      header: "Mã đơn",
      headerClassName: "px-6 py-5",
      className: "px-6 py-5",
      cell: ({ row }) => (
        <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-xl border border-amber-100 shadow-sm">
          #{row.id}
        </span>
      ),
    },
    {
      header: "Khách hàng",
      headerClassName: "px-6 py-5",
      className: "px-6 py-5",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 border border-slate-200 shrink-0 group-hover:bg-white transition-colors">
            {row.user?.username?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div>
            <p className="font-bold text-slate-800 text-sm">
              {row.user?.username || "Khách vãng lai"}
            </p>
            <p className="text-[10px] text-slate-400 font-medium">
              {row.user?.email || "N/A"}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Ngày đặt",
      headerClassName: "px-6 py-5",
      className: "px-6 py-5 text-xs text-slate-500 font-medium",
      cell: ({ row }) =>
        new Date(row.created_at).toLocaleString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
    },
    {
      header: "Tổng tiền",
      headerClassName: "px-6 py-5",
      className: "px-6 py-5 font-bold text-slate-900 text-sm font-price",
      cell: ({ row }) => formatCurrency(row.total_amount),
    },
    {
      header: "Thanh toán",
      headerClassName: "px-6 py-5",
      className: "px-6 py-5",
      cell: ({ row }) => (
        <span className="text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100 uppercase">
          {row.payment_method}
        </span>
      ),
    },
    {
      header: "Trạng thái",
      headerClassName: "px-6 py-5",
      className: "px-6 py-5",
      cell: ({ row }) => <StatusBadge status={row.status} />,
    },
    {
      header: "Thao tác",
      align: "right",
      stopRowClick: true,
      headerClassName: "px-6 py-5",
      className: "px-6 py-5",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "h-10 w-10 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-white shadow-sm border border-transparent hover:border-slate-100 transition-all focus:outline-none focus:ring-0 cursor-pointer"
            )}
          >
            <MoreVertical className="h-5 w-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 p-2 bg-white rounded-[1.5rem] shadow-2xl border-slate-100 ring-1 ring-slate-200/50"
          >
            <DropdownMenuItem
              className="gap-3 cursor-pointer py-2.5 px-3 rounded-xl text-xs font-bold text-slate-700 outline-none"
              onClick={() => onView(row.id)}
            >
              <Eye className="h-4 w-4 text-slate-400" /> Chi tiết đơn hàng
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-1 bg-slate-50" />
            <p className="px-3 py-2 text-[12px] font-bold text-slate-400 uppercase mb-1 border-b border-slate-50">
              Cập nhật nhanh
            </p>

            {updatingId === row.id ? (
              <div className="py-4 text-center">
                <RefreshCcw className="h-4 w-4 animate-spin mx-auto text-amber-600" />
              </div>
            ) : (
              Object.entries(STATUS_CONFIG).filter(([key]) => {
                const allowed = ORDER_STATUS_TRANSITIONS[row.status] || [];
                return allowed.includes(key);
              }).map(([key, cfg]) => (
                <DropdownMenuItem
                  key={key}
                  className={cn(
                    "gap-3 cursor-pointer py-2 px-3 rounded-lg text-[11px] font-bold outline-none",
                    row.status === key ? "bg-slate-50 opacity-50" : "hover:bg-slate-50"
                  )}
                  disabled={row.status === key}
                  onClick={() => onStatusUpdate(row.id, key)}
                >
                  <cfg.icon className={cn("h-3.5 w-3.5", cfg.text)} />
                  {cfg.label}
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ], [formatCurrency, onStatusUpdate, onView, updatingId]);

  return (
    <DataTable
      columns={columns}
      data={orders}
      loading={loading}
      onRowClick={(row) => onView(row.id)}
      rowClassName="group"
      emptyMessage="Không tìm thấy đơn hàng nào"
      emptyIcon={ShoppingBag}
      pagination={pagination}
    />
  );
};

export default OrderTable;
export { STATUS_CONFIG };
