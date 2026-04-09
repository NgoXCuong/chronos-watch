import { Clock, ChevronRight } from "lucide-react";
import { Button } from "../../../components/ui/button";

const RecentOrders = ({ orders, navigate, formatCurrency }) => {
  return (
    <div className="bg-white p-8 rounded-md border border-slate-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Clock size={18} className="text-amber-500" />
          <h3 className="text-base font-bold text-slate-900 uppercase">
            Đơn hàng mới nhất
          </h3>
        </div>
        <Button
          variant="ghost"
          onClick={() => navigate("/admin/orders")}
          className="text-[11px] font-black text-amber-600 uppercase bg-amber-50/50 hover:bg-amber-50 px-3 h-8 rounded-lg group/btn transition-all duration-300"
        >
          Xem tất cả{" "}
          <ChevronRight className="h-3 w-3 ml-1 group-hover/btn:translate-x-0.5 transition-transform" />
        </Button>
      </div>
      <div className="space-y-3">
        {orders && orders.length > 0 ? (
          orders.map((order, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2 bg-slate-50/50 rounded-2xl border border-transparent hover:border-amber-200 transition-all cursor-pointer group"
              onClick={() => navigate(`/admin/orders/${order.id}`)}
            >
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden group-hover:border-amber-400 transition-all shadow-sm shrink-0">
                  {order.details?.[0]?.product?.image_url ? (
                    <img
                      src={order.details[0].product.image_url}
                      alt="Product"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-slate-300 font-bold text-[10px] italic">
                      #{order.id}
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate">
                    {order.user?.full_name || "Khách vãng lai"}
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium truncate max-w-50">
                    {order.details?.[0]?.product?.name || "Chưa có tên SP"}
                    {order.details?.length > 1 &&
                      ` (+${order.details.length - 1} sp khác)`}
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
                  className={`text-[12px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    order.status === "delivered"
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
