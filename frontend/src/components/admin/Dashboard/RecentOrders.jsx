import React from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "../../../components/ui/button";

const RecentOrders = ({ orders, navigate, formatCurrency }) => {
  return (
    <div className="bg-white p-8 rounded-md border border-slate-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-bold text-slate-900">
          Đơn hàng mới nhất
        </h3>
        <Button
          variant="ghost"
          onClick={() => navigate("/admin/orders")}
          className="text-xs font-bold text-amber-600 gap-1 hover:bg-amber-400 hover:text-black-400"
        >
          Xem tất cả <ChevronRight className="h-3 w-3" />
        </Button>
      </div>
      <div className="space-y-4">
        {orders && orders.length > 0 ? (
          orders.map((order, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-transparent hover:border-amber-200 transition-all cursor-pointer group"
              onClick={() => navigate(`/admin/orders/${order.id}`)}
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 font-bold text-xs uppercase group-hover:text-amber-600 transition-all shadow-sm italic">
                  #{order.id}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">
                    {order.user?.username || "Khách vãng lai"}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {new Date(order.created_at).toLocaleString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      day: "2-digit",
                      month: "2-digit",
                    })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-slate-900">
                  {formatCurrency(order.total_amount)}
                </p>
                <span
                  className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${order.status === "delivered"
                    ? "bg-emerald-50 text-emerald-600"
                    : order.status === "cancelled"
                      ? "bg-rose-50 text-rose-600"
                      : "bg-blue-50 text-blue-600"
                    }`}
                >
                  {order.status === "pending"
                    ? "Chờ duyệt"
                    : order.status === "processing"
                      ? "Đang giao"
                      : order.status === "delivered"
                        ? "Xong"
                        : order.status}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="py-10 text-center text-sm text-slate-500  mt-1">
            Chưa có đơn hàng nào
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentOrders;
