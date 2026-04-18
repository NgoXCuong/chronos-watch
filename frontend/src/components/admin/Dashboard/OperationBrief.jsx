import React from "react";
import { AlertTriangle, Package } from "lucide-react";
import { Button } from "../../../components/ui/button";

const OperationBrief = ({ lowStockProducts, stats }) => {
  return (
    <div className="bg-white p-8 rounded-md border border-slate-100 shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-rose-600">
          <AlertTriangle className="h-5 w-5" />
          <h3 className="text-base font-bold text-slate-900 uppercase">
            Cảnh báo tồn kho
          </h3>
        </div>
        {stats?.low_stock_count > 0 && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-rose-50 text-rose-600 rounded-lg border border-rose-100 animate-pulse">
            <span className="text-[10px] font-black uppercase">
              {stats.low_stock_count} Sản phẩm thấp
            </span>
          </div>
        )}
      </div>

      <div className="space-y-3 flex-1">
        {lowStockProducts && lowStockProducts.length > 0 ? (
          <>
            {lowStockProducts.map((prod, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 p-3 bg-white border border-slate-100 rounded-2xl hover:shadow-md transition-all group"
              >
                <div className="h-12 w-12 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden shrink-0 group-hover:border-rose-200 transition-colors">
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
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden max-w-[80px]">
                      <div
                        className="h-full bg-rose-500 rounded-full"
                        style={{ width: `${Math.min(100, (prod.stock / 10) * 100)}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-rose-600 uppercase">
                      Còn {prod.stock} sp
                    </span>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 rounded-lg text-[10px] font-bold uppercase border-slate-100 px-3 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all shrink-0"
                  onClick={() => window.location.href = `/admin/products/edit/${prod.id}`}
                >
                  Nhập
                </Button>
              </div>
            ))}
            
            {stats?.low_stock_count > lowStockProducts.length && (
              <Button
                variant="ghost"
                fullWidth
                className="w-full mt-2 h-10 rounded-xl border border-dashed border-slate-200 text-slate-500 text-[11px] font-bold uppercase hover:bg-slate-50 hover:text-slate-900 transition-all"
                onClick={() => window.location.href = "/admin/products"}
              >
                Xem tất cả {stats.low_stock_count} sản phẩm thấp
              </Button>
            )}
          </>
        ) : (
          <div className="py-10 text-center bg-emerald-50/50 rounded-[2rem] border-2 border-dashed border-emerald-100 my-auto">
            <Package className="h-8 w-8 text-emerald-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-emerald-800">
              Kho hàng đang ổn định
            </p>
            <p className="text-[10px] text-emerald-600 uppercase font-medium">
              Tất cả sản phẩm đều đủ hàng
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OperationBrief;
