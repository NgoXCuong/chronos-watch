import { TrendingUp, ChevronRight, Award } from "lucide-react";
import { Button } from "../../../components/ui/button";

const TopSellingProducts = ({ products, navigate, formatCurrency }) => {
  return (
    <div className="bg-white p-8 rounded-md border border-slate-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <TrendingUp size={18} className="text-emerald-500" />
          <h3 className="text-base font-bold text-slate-900 uppercase">
            Top sản phẩm bán chạy
          </h3>
        </div>
        <Button
          variant="ghost"
          onClick={() => navigate("/admin/products")}
          className="text-[11px] font-black text-emerald-600 uppercase bg-emerald-50/50 hover:bg-emerald-50 px-3 h-8 rounded-lg group/btn transition-all duration-300"
        >
          Xem kho hàng{" "}
          <ChevronRight className="h-3 w-3 ml-1 group-hover/btn:translate-x-0.5 transition-transform" />
        </Button>
      </div>
      <div className="space-y-3">
        {products && products.length > 0 ? (
          products.map((product, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2 bg-slate-50/50 rounded-2xl border border-transparent hover:border-emerald-200 transition-all cursor-pointer group"
              onClick={() => navigate(`/admin/products/edit/${product.id}`)}
            >
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden group-hover:border-emerald-400 transition-all shadow-sm shrink-0">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-slate-300 font-bold text-[10px] italic">
                      #{product.id}
                    </span>
                  )}
                  {idx === 0 && (
                     <div className="absolute top-0 right-0 p-0.5 bg-amber-400 rounded-bl-lg">
                        <Award size={10} className="text-white fill-white" />
                     </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate">
                    {product.name}
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium truncate max-w-50">
                    Kho: {product.stock} sp
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-emerald-600">
                  {product.sold_count}
                </p>
                <span className="text-[10px] font-bold uppercase text-slate-400">
                  Đã bán
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="py-10 text-center text-sm text-slate-500 mt-1">
            Chưa có dữ liệu bán hàng
          </div>
        )}
      </div>
    </div>
  );
};

export default TopSellingProducts;
