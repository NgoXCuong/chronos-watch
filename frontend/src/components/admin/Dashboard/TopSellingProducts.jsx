import { TrendingUp, ChevronRight, Award, Trophy, Medal } from "lucide-react";
import { Button } from "../../../components/ui/button";

const TopSellingProducts = ({ products, navigate, formatCurrency }) => {
  // Take top 3 for ranking view
  const top3 = products?.slice(0, 3) || [];

  return (
    <div className="bg-white p-8 rounded-md border border-slate-100 shadow-sm overflow-hidden h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-50 rounded-lg">
            <TrendingUp size={20} className="text-emerald-500" />
          </div>
          <h3 className="text-base font-bold text-slate-900 uppercase tracking-tight">
            Top sản phẩm bán chạy
          </h3>
        </div>
        <Button
          variant="ghost"
          onClick={() => navigate("/admin/products")}
          className="text-[11px] font-bold text-emerald-600 uppercase bg-emerald-50/50 hover:bg-emerald-50 px-3 h-8 rounded-lg group/btn transition-all duration-300"
        >
          Xem kho hàng{" "}
          <ChevronRight className="h-3 w-3 ml-1 group-hover/btn:translate-x-0.5 transition-transform" />
        </Button>
      </div>

      <div className="flex-1">
        {top3.length > 0 ? (
          <div className="grid grid-cols-3 gap-4 items-end pt-4 pb-2">
            {/* Rank 2 */}
            {top3[1] && (
              <div 
                className="flex flex-col items-center group cursor-pointer"
                onClick={() => navigate(`/admin/products/edit/${top3[1].id}`)}
              >
                <div className="relative mb-4">
                  <div className="h-16 w-16 md:h-20 md:w-20 rounded-2xl bg-white border-2 border-slate-100 p-1 overflow-hidden shadow-sm group-hover:border-slate-300 transition-all">
                    <img
                      src={top3[1].image_url}
                      alt={top3[1].name}
                      className="h-full w-full object-cover rounded-xl"
                    />
                  </div>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-slate-400 text-white p-1 rounded-full border-2 border-white shadow-sm">
                    <Medal size={12} className="fill-white/20" />
                  </div>
                </div>
                <div className="w-full text-center space-y-1">
                  <p className="text-[11px] font-bold text-slate-800 line-clamp-1 h-4">
                    {top3[1].name}
                  </p>
                  <div className="h-16 md:h-20 bg-slate-50 rounded-t-xl flex flex-col items-center justify-center border-x border-t border-slate-100 group-hover:bg-slate-100 transition-colors">
                    <span className="text-xl font-black text-slate-400">2</span>
                    <div className="mt-1">
                      <span className="text-[12px] font-black text-slate-600">{top3[1].sold_count}</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase ml-1">Bán</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Rank 1 */}
            {top3[0] && (
              <div 
                className="flex flex-col items-center group cursor-pointer z-10"
                onClick={() => navigate(`/admin/products/edit/${top3[0].id}`)}
              >
                <div className="relative mb-4 scale-110">
                  <div className="h-20 w-20 md:h-24 md:w-24 rounded-2xl bg-white border-2 border-amber-200 p-1.5 overflow-hidden shadow-md group-hover:border-amber-400 transition-all">
                    <img
                      src={top3[0].image_url}
                      alt={top3[0].name}
                      className="h-full w-full object-cover rounded-xl"
                    />
                  </div>
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-amber-500 animate-bounce">
                    <Trophy size={24} className="fill-amber-500/20" />
                  </div>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-500 text-white p-1.5 rounded-full border-2 border-white shadow-md">
                    <Award size={14} className="fill-white/20" />
                  </div>
                </div>
                <div className="w-full text-center space-y-1">
                  <p className="text-xs font-black text-slate-900 line-clamp-1 h-4">
                    {top3[0].name}
                  </p>
                  <div className="h-24 md:h-32 bg-gradient-to-b from-amber-50 to-amber-100/50 rounded-t-2xl flex flex-col items-center justify-center border-x border-t border-amber-200 group-hover:from-amber-100 transition-colors shadow-inner">
                    <span className="text-3xl font-black text-amber-600 drop-shadow-sm">1</span>
                    <div className="mt-1 bg-white px-2 py-0.5 rounded-full shadow-sm">
                      <span className="text-[14px] font-black text-amber-700">{top3[0].sold_count}</span>
                      <span className="text-[10px] font-bold text-amber-600/70 uppercase ml-1">Đã bán</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Rank 3 */}
            {top3[2] && (
              <div 
                className="flex flex-col items-center group cursor-pointer"
                onClick={() => navigate(`/admin/products/edit/${top3[2].id}`)}
              >
                <div className="relative mb-4">
                  <div className="h-16 w-16 md:h-20 md:w-20 rounded-2xl bg-white border-2 border-orange-50 p-1 overflow-hidden shadow-sm group-hover:border-orange-200 transition-all">
                    <img
                      src={top3[2].image_url}
                      alt={top3[2].name}
                      className="h-full w-full object-cover rounded-xl"
                    />
                  </div>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-orange-400 text-white p-1 rounded-full border-2 border-white shadow-sm">
                    <Medal size={12} className="fill-white/20" />
                  </div>
                </div>
                <div className="w-full text-center space-y-1">
                  <p className="text-[11px] font-bold text-slate-800 line-clamp-1 h-4">
                    {top3[2].name}
                  </p>
                  <div className="h-12 md:h-16 bg-orange-50/50 rounded-t-xl flex flex-col items-center justify-center border-x border-t border-orange-100 group-hover:bg-orange-50 transition-colors">
                    <span className="text-lg font-black text-orange-400">3</span>
                    <div className="mt-0.5">
                      <span className="text-[11px] font-black text-orange-600">{top3[2].sold_count}</span>
                      <span className="text-[9px] font-bold text-orange-400 uppercase ml-1">Bán</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="h-40 flex flex-col items-center justify-center text-slate-400 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-100">
             <Trophy size={32} className="mb-2 opacity-20" />
             <p className="text-sm font-medium">Chưa có dữ liệu xếp hạng</p>
          </div>
        )}
      </div>

      {products?.length > 3 && (
        <div className="mt-4 pt-4 border-t border-slate-50">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase">
             <span>Các sản phẩm khác</span>
             <span>Doanh số</span>
          </div>
          <div className="mt-2 space-y-2 max-h-[80px] overflow-y-auto pr-1 custom-scrollbar">
             {products.slice(3, 6).map((product, idx) => (
               <div 
                  key={idx} 
                  className="flex items-center justify-between group cursor-pointer hover:bg-slate-50 p-1.5 rounded-lg transition-colors"
                  onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-slate-300 w-3">{idx + 4}</span>
                    <p className="text-[11px] font-medium text-slate-600 truncate max-w-[120px]">{product.name}</p>
                  </div>
                  <span className="text-[11px] font-black text-slate-700">{product.sold_count}</span>
               </div>
             ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TopSellingProducts;
