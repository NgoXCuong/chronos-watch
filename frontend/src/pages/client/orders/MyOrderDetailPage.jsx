import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Printer,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  CreditCard,
  User,
  MapPin,
  Phone,
  ChevronRight,
  Search,
  ShoppingBag,
  Calendar,
  Receipt,
  ShieldCheck,
  AlertCircle,
  XCircle,
} from "lucide-react";
import orderApi from "../../../api/order.api";
import { formatCurrency } from "../../../utils/formatCurrency";
import { Button } from "../../../components/ui/button";
import { toast } from "sonner";
import { cn } from "../../../lib/utils";

const STATUS_STEPS = [
  {
    key: "pending",
    label: "Chờ duyệt",
    icon: Clock,
    desc: "Đơn hàng đang được hệ thống tiếp nhận.",
  },
  {
    key: "confirmed",
    label: "Xác nhận",
    icon: ShieldCheck,
    desc: "Chronos đã xác nhận và đang chuẩn bị hàng.",
  },
  {
    key: "processing",
    label: "Xử lý",
    icon: Package,
    desc: "Sản phẩm đang được kiểm định và đóng gói cao cấp.",
  },
  {
    key: "shipping",
    label: "Đang giao",
    icon: Truck,
    desc: "Đơn hàng đang trên đường đến với bạn.",
  },
  {
    key: "delivered",
    label: "Hoàn thành",
    icon: CheckCircle2,
    desc: "Tuyệt tác thời gian đã được bàn giao thành công.",
  },
];

const MyOrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchOrderDetail();
  }, [id]);

  const fetchOrderDetail = async () => {
    setLoading(true);
    try {
      const data = await orderApi.getOrderDetail(id);
      setOrder(data);
    } catch (error) {
      console.error("Lỗi lấy chi tiết đơn hàng:", error);
      toast.error("Không thể tải thông tin đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) return;
    setCancelling(true);
    try {
      await orderApi.cancelOrder(id);
      toast.success("Đã hủy đơn hàng thành công");
      fetchOrderDetail();
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi hủy đơn hàng");
    } finally {
      setCancelling(false);
    }
  };

  const handlePrint = () => window.print();

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-6">
        <div className="w-10 h-10 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] font-black  uppercase animate-pulse">
          Đang giải mã hành trình...
        </p>
      </div>
    );
  }

  if (!order)
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-8 px-6 text-center">
        <div className="h-20 w-20 rounded-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center border border-dashed border-zinc-200 dark:border-zinc-800">
          <AlertCircle className="h-10 w-10 text-zinc-300" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-serif text-zinc-900 dark:text-white">
            Kiệt tác chưa lộ diện
          </h3>
          <p className="text-zinc-700 dark: font-light max-w-xs mx-auto text-sm">
            Chúng tôi không tìm thấy dữ liệu cho đơn hàng này trong hệ thống.
          </p>
        </div>
        <Button
          onClick={() => navigate("/orders")}
          variant="outline"
          className="rounded-2xl px-10 h-12 border-zinc-200 dark:border-zinc-800 hover:bg-amber-600 hover:text-white transition-all font-bold text-[10px] uppercase "
        >
          Quay lại danh sách
        </Button>
      </div>
    );

  const currentStepIdx = STATUS_STEPS.findIndex((s) => s.key === order.status);
  const isCancelled = order.status === "cancelled";
  const isReturned = order.status === "returned";

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-4 pb-4 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 print:hidden">
          <div className="space-y-6">
            <button
              onClick={() => navigate("/orders")}
              className="flex items-center gap-2  hover:text-amber-500 transition-all font-black text-md group"
            >
              <ArrowLeft className="h-6 w-6 group-hover:-translate-x-1 transition-transform" />
              Quay lại lịch sử
            </button>
            <div className="flex flex-wrap items-center gap-6">
              <div className="h-12 w-12 bg-zinc-900 dark:bg-zinc-100 rounded-full flex items-center justify-center text-amber-500 shadow-2xl relative">
                <ShoppingBag className="h-6 w-6" />
                <div className="absolute -top-2 -right-2 h-5 w-5 bg-green-500 rounded-full border-4 border-zinc-50 dark:border-zinc-950"></div>
              </div>
              <div>
                <h2 className="text-xl md:text-3xl font-medium text-zinc-900 dark:text-white ">
                  Đơn hàng
                </h2>
                <div className="flex flex-wrap items-center gap-4 text-xs font-bold  mt-2 ">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} />{" "}
                    {new Date(order.created_at).toLocaleString("vi-VN")}
                  </span>
                  <div className="h-1 w-1 bg-zinc-200 dark:bg-zinc-800 rounded-full"></div>
                  <span className="flex items-center gap-1.5 uppercase text-amber-600 dark:text-amber-500">
                    {order.payment_method}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handlePrint}
              className="h-12 px-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark: hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all shadow-sm font-bold text-xs gap-2"
            >
              <Printer className="h-4 w-4" /> In biên lai
            </Button>
          </div>
        </div>

        {/* MASTER CARD: All-in-One Consistently Luxury Experience */}
        <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-2xl shadow-zinc-200/50 dark:shadow-none">
          {/* 1. HEADER: Tracking Timeline Integral to the Card */}
          <div className="p-6 md:p-10 border-b border-zinc-50 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/10">
            {isCancelled || isReturned ? (
              <div className="flex items-center gap-6 py-4">
                <div className="h-16 w-16 bg-rose-500/10 rounded-full flex items-center justify-center shrink-0">
                  <XCircle className="h-8 w-8 text-rose-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-rose-600">
                    Hành trình đã dừng lại
                  </h3>
                  <p className="text-zinc-700 text-sm font-medium italic">
                    Đơn hàng này đang ở trạng thái{" "}
                    {isCancelled ? "Đã hủy" : "Hoàn trả"}.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <h3 className="text-md font-black flex items-center gap-3">
                  <Truck size={20} className="text-amber-500" />
                  Tiến trình bàn giao kỳ công
                </h3>
                <div className="relative flex justify-between">
                  <div className="absolute top-[21px] left-[5%] right-[5%] h-[2px] bg-zinc-100 dark:bg-zinc-800 -z-0" />
                  <div
                    className="absolute top-[21px] left-[5%] h-[2px] bg-amber-500 transition-all duration-1000 -z-0"
                    style={{
                      width: `${(currentStepIdx / (STATUS_STEPS.length - 1)) * 90}%`,
                    }}
                  />
                  {STATUS_STEPS.map((step, idx) => {
                    const isDone = idx <= currentStepIdx;
                    const isCurrent = idx === currentStepIdx;
                    const StepIcon = step.icon;
                    return (
                      <div
                        key={step.key}
                        className="flex flex-col items-center gap-4 relative z-10 w-[20%] text-center group"
                      >
                        <div
                          className={cn(
                            "h-10 w-10 rounded-full flex items-center justify-center border-[4px] border-white dark:border-zinc-950 shadow-lg transition-all duration-700",
                            isDone
                              ? "bg-amber-500 text-white"
                              : "bg-zinc-200 dark:bg-zinc-800",
                            isCurrent
                              ? "scale-110 ring-4 ring-amber-500/10"
                              : "",
                          )}
                        >
                          <StepIcon
                            size={16}
                            className={isCurrent ? "animate-pulse" : ""}
                          />
                        </div>
                        <p
                          className={cn(
                            "text-[12px] font-black ",
                            isDone
                              ? "text-zinc-900 dark:text-white"
                              : "text-zinc-700",
                          )}
                        >
                          {step.label}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-zinc-50 dark:divide-zinc-900">
            {/* 2. CORE: Product List (2 COLUMNS on Desktop) */}
            <div className="lg:col-span-2">
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black dark:  flex items-center gap-3">
                    Bộ sưu tập lựa chọn
                  </h3>
                  <span className="text-xs font-bold bg-green-300 dark:bg-zinc-800 px-2 py-1 rounded-full">
                    {order.details?.length || 0} Kiệt tác
                  </span>
                </div>
                <div className="divide-y divide-zinc-50 dark:divide-zinc-900">
                  {order.details?.map((item) => (
                    <div
                      key={item.id}
                      className="group flex items-center gap-8 transition-all hover:bg-zinc-50/30 dark:hover:bg-zinc-900/10 -mx-4 px-4 rounded-2xl"
                    >
                      <div className="relative h-20 w-20 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl overflow-hidden shrink-0">
                        <img
                          src={item.product?.image_url}
                          alt={item.product?.name}
                          className="h-full w-full object-contain p-2 mix-blend-multiply dark:mix-blend-normal"
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <h4 className="text-base font-bold text-zinc-900 dark:text-white group-hover:text-amber-600 transition-colors uppercase leading-tight">
                          {item.product?.name}
                        </h4>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-1.5 py-0.5 bg-zinc-900 dark:bg-zinc-100 text-[9px] font-black text-white dark:text-zinc-900 rounded">
                            {order.payment_method}
                          </span>
                          <span
                            className={cn(
                              "px-1.5 py-0.5 text-[9px] font-black text-white rounded shadow-sm",
                              order.payment_status === "paid"
                                ? "bg-emerald-500"
                                : "bg-amber-500",
                            )}
                          >
                            {order.payment_status === "paid"
                              ? "Đã thanh toán"
                              : "Chờ thanh toán"}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold">
                          {item.quantity} × {formatCurrency(item.price)}
                        </div>
                        <div className="text-lg text-amber-600 dark:text-amber-500 font-bold">
                          {formatCurrency(item.price * item.quantity)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order History Summary below Products */}
                <div className="pt-4 border-t border-zinc-50 dark:border-zinc-900 space-y-6">
                  <h3 className="text-md font-black flex items-center gap-3">
                    <Clock size={20} className="text-amber-500" /> Nhật ký điều
                    phối
                  </h3>

                  <div className="relative ml-4">
                    <div className="absolute left-[3px] top-2 bottom-2 w-[1px] bg-zinc-200 dark:bg-zinc-800" />

                    <div className="space-y-6 relative">
                      {order.history?.slice(0, 3).map((h, idx) => (
                        <div
                          key={idx}
                          className="flex gap-6 items-start relative group"
                        >
                          <div className="relative z-10 flex items-center justify-center">
                            <div
                              className={cn(
                                "h-2 w-2 rounded-full ring-4 ring-white dark:ring-zinc-950",
                                h.status === "delivered"
                                  ? "bg-emerald-500"
                                  : "bg-amber-500",
                              )}
                            />
                          </div>

                          {/* 3. Nội dung */}
                          <div className="flex-1 min-w-0 -mt-1">
                            {" "}
                            {/* -mt-1 để text căn chỉnh đẹp hơn với dot */}
                            <div className="flex items-center gap-3 text-[11px] font-bold">
                              <span className="text-zinc-900 dark:text-white truncate">
                                {STATUS_STEPS.find((s) => s.key === h.status)
                                  ?.label || h.status}
                              </span>
                              <span className="text-zinc-700 shrink-0">
                                {new Date(h.created_at).toLocaleString("vi-VN")}
                              </span>
                            </div>
                            <p className="text-xs  italic mt-0.5 line-clamp-1">
                              {h.note ||
                                "Đơn hàng đang phát triển đúng tiến độ."}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. SIDEBAR: Recipient & Payment (1 COLUMN on Desktop) */}
            <div className="p-6 space-y-4 bg-zinc-50/30 dark:bg-zinc-900/5">
              {/* Recipient Details */}
              <div className="space-y-4">
                <h3 className="text-md font-black  flex items-center gap-3 border-b border-zinc-200 dark:border-zinc-800">
                  <User size={20} className="text-amber-500" /> Bàn giao cho
                </h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="h-10 w-10 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                      <User size={16} className="" />
                    </div>
                    <div>
                      <p className="text-[12px] font-black text-zinc-700 dark:text-zinc-600 ">
                        Người nhận
                      </p>
                      <p className="text-base font-bold text-zinc-900 dark:text-white">
                        {order.full_name}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="h-10 w-10 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                      <Phone size={16} className="" />
                    </div>
                    <div>
                      <p className="text-[12px] font-black text-zinc-700 dark:text-zinc-600 ">
                        Liên hệ
                      </p>
                      <p className="text-base font-bold text-zinc-900 dark:text-white ">
                        {order.phone_number}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="h-10 w-10 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                      <MapPin size={16} className="" />
                    </div>
                    <div>
                      <p className="text-[12px] font-black ">Vị trí</p>
                      <p className="text-xs font-bold text-zinc-700 dark: leading-relaxed">
                        {order.address_line}
                        {order.ward ? `, ${order.ward}` : ""}
                        {order.district ? `, ${order.district}` : ""}
                        {order.city ? `, ${order.city}` : ""}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Final Financials Stacked in Sidebar Footer */}
              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-4">
                <div className="flex justify-between text-xs font-bold">
                  <span className="">Tạm tính</span>
                  <span className="text-zinc-900 dark:text-white">
                    {formatCurrency(order.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-xs font-bold">
                  <span className="">Vận chuyển</span>
                  <span className="text-emerald-600">
                    {parseInt(order.shipping_fee) === 0
                      ? "MIỄN PHÍ"
                      : formatCurrency(order.shipping_fee)}
                  </span>
                </div>
                {parseFloat(order.discount_amount) > 0 && (
                  <div className="flex justify-between text-xs font-bold">
                    <span className="">Ưu đãi</span>
                    <span className="text-rose-600">
                      -{formatCurrency(order.discount_amount)}
                    </span>
                  </div>
                )}
                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex flex-col items-end">
                  <div className="text-xl font-bold text-rose-600 dark:text-rose-500 ">
                    Tổng cộng: {formatCurrency(order.total_amount)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Print Styles */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
                @media print {
                    @page { margin: 1cm; size: A4; }
                    body { background: white !important; font-family: sans-serif; color: black !important; }
                    header, footer, nav, button, .print-hidden { display: none !important; }
                    .max-w-6xl { max-width: 100% !important; margin: 0 !important; padding: 0 !important; }
                    .bg-white, .bg-zinc-50, .bg-zinc-900 { background: transparent !important; box-shadow: none !important; border: 1px solid #eee !important; border-radius: 0 !important; }
                    .text-white, . { color: black !important; }
                    .grid { display: block !important; }
                    .lg\\:col-span-8, .lg\\:col-span-4 { width: 100% !important; margin-bottom: 2rem; border: none !important; }
                    table { border: 1px solid #000; border-collapse: collapse; width: 100%; }
                    th, td { border: 1px solid #eee !important; padding: 10px !important; }
                    .text-4xl { font-size: 24pt !important; }
                }
            `,
          }}
        />
      </div>
    </div>
  );
};

export default MyOrderDetailPage;
