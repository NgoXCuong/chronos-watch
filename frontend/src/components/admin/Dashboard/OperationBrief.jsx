import React from "react";
import { AlertTriangle, Package, ExternalLink, ArrowRight } from "lucide-react";
import { Button } from "../../../components/ui/button";

const OperationBrief = ({ lowStockProducts, stats }) => {
  return (
    <div className="bg-white p-8 rounded-md border border-slate-100 shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-rose-50 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-rose-600" />
          </div>
          <h3 className="text-base font-bold text-slate-900 uppercase tracking-tight">
            Cảnh báo tồn kho
          </h3>
        </div>
        {stats?.low_stock_count > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-600 rounded-full border border-rose-100 shadow-sm shadow-rose-100/50">
            <span className="text-[10px] font-black uppercase flex items-center gap-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
              </span>
              {stats.low_stock_count} Sản phẩm
            </span>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        {lowStockProducts && lowStockProducts.length > 0 ? (
          <>
            <div className="space-y-2 overflow-y-auto pr-2 custom-scrollbar flex-1 max-h-[380px]">
              {lowStockProducts.map((prod, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-2.5 bg-white border border-slate-100 rounded-xl hover:border-rose-200 hover:shadow-sm transition-all group relative overflow-hidden"
                >
                  {/* Critical Indicator */}
                  {prod.stock <= 3 && (
                    <div className="absolute top-0 left-0 w-1 h-full bg-rose-600" title="Rất thấp" />
                  )}
                  
                  <div className="h-10 w-10 rounded-lg bg-slate-50 border border-slate-100 overflow-hidden shrink-0 group-hover:border-rose-200 transition-colors">
                    <img
                      src={prod.image_url}
                      alt={prod.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[11px] font-bold text-slate-800 truncate group-hover:text-rose-600 transition-colors">
                        {prod.name}
                      </p>
                      <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${prod.stock <= 3 ? 'bg-rose-100 text-rose-700' : 'bg-orange-50 text-orange-700'}`}>
                        {prod.stock}
                      </span>
                    </div>
                    
                    <div className="mt-1.5 flex items-center gap-2">
                      <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${prod.stock <= 3 ? 'bg-rose-600' : 'bg-orange-500'}`}
                          style={{ width: `${Math.max(10, (prod.stock / 15) * 100)}%` }}
                        />
                      </div>
                      <button 
                         onClick={() => window.location.href = `/admin/products/edit/${prod.id}`}
                         className="text-slate-400 hover:text-rose-600 transition-colors"
                      >
                        <ExternalLink size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-50">
              <Button
                variant="ghost"
                fullWidth
                className="w-full h-10 rounded-xl bg-slate-50 border border-slate-100 text-slate-600 text-[11px] font-bold uppercase hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all flex items-center justify-center gap-2 group/all"
                onClick={() => window.location.href = "/admin/products"}
              >
                Quản lý kho hàng
                <ArrowRight size={14} className="group-hover/all:translate-x-1 transition-transform" />
              </Button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center py-10 text-center bg-emerald-50/30 rounded-[2rem] border-2 border-dashed border-emerald-100 my-4">
            <div className="p-4 bg-white rounded-full shadow-sm mb-4">
               <Package className="h-8 w-8 text-emerald-500" />
            </div>
            <p className="text-sm font-bold text-emerald-800">
              Kho hàng an toàn
            </p>
            <p className="text-[10px] text-emerald-600 uppercase font-black mt-1 tracking-wider">
              Tất cả sản phẩm đều đủ hàng
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OperationBrief;
