import React from "react";
import { AlertTriangle, Package } from "lucide-react";
import { Button } from "../../../components/ui/button";

const OperationBrief = ({ lowStockProducts, stats }) => {
  return (
    <div className="bg-white p-8 rounded-md border border-slate-100 shadow-sm">
      <div className="flex items-center gap-2 mb-6 text-rose-600">
        <AlertTriangle className="h-5 w-5" />
        <h3 className="text-base font-bold text-slate-900">
          Cảnh báo tồn kho thấp
        </h3>
      </div>
      <div className="space-y-3">
        {lowStockProducts && lowStockProducts.length > 0 ? (
          lowStockProducts.map((prod, idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 p-3 bg-white border border-slate-100 rounded-2xl hover:shadow-md transition-all"
            >
              <div className="h-12 w-12 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden shrink-0">
                <img
                  src={prod.image_url}
                  alt={prod.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate">
                  {prod.name}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden max-w-20">
                    <div
                      className="h-full bg-rose-500 rounded-full"
                      style={{ width: `${(prod.stock / 10) * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-rose-600 uppercase tracking-tighter">
                    Còn {prod.stock} sp
                  </span>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="h-8 rounded-lg text-[10px] font-bold uppercase tracking-widest border-slate-100 px-3 hover:bg-slate-50 transition-all"
              >
                Nhập hàng
              </Button>
            </div>
          ))
        ) : (
          <div className="py-10 text-center bg-emerald-50/50 rounded-[2rem] border-2 border-dashed border-emerald-100">
            <Package className="h-8 w-8 text-emerald-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-emerald-800">
              Kho hàng đang ổn định
            </p>
            <p className="text-[10px] text-emerald-600 uppercase tracking-widest font-medium">
              Tất cả sản phẩm đều đủ hàng
            </p>
          </div>
        )}
      </div>

      <div className="mt-8 p-6 bg-slate-900 rounded-[2rem] text-white overflow-hidden relative group">
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-amber-500 rounded-full opacity-10 group-hover:scale-125 transition-transform duration-700" />
        <h4 className="text-sm font-bold opacity-60 uppercase tracking-widest mb-1">
          Mẹo quản trị
        </h4>
        <p className="text-xs font-medium leading-relaxed italic">
          Biểu đồ doanh thu đang tăng trưởng tốt. Bạn nên cân nhắc tung ra bộ
          sưu tập mới vào cuối tuần này để tối ưu lượng khách truy cập.
        </p>
      </div>
    </div>
  );
};

export default OperationBrief;
