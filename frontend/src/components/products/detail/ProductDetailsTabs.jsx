import React from 'react';
import {
    Cpu, Shield, Package, Truck,
    RotateCcw, Info, CheckCircle2,
    Clock, Globe, Wallet, Award,
    Ruler, MessageSquare
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';

// Import assets
import huongdan1 from '../../../assets/huongdan1.jpg';
import huongdan2 from '../../../assets/huongdan2.png';
import huongdan3 from '../../../assets/huongdan3.png';
import ProductReviews from './ProductReviews';

const ProductDetailsTabs = ({ product, isDark }) => {
    return (
        <div className="mt-6 md:mt-12">
            <Tabs defaultValue="specs" className="w-full">
                {/* Custom Luxury Tabs Navigation */}
                <div className="flex justify-center mb-6">
                    <TabsList className="bg-transparent border-b dark:border-white/5 border-zinc-100 rounded-none w-full max-w-2xl justify-around h-10 p-0">
                        <TabsTrigger
                            value="specs"
                            className={`relative rounded-none border-b-2 border-transparent data-[state=active]:border-amber-500 data-[state=active]:bg-transparent transition-all duration-500 px-8 h-full group
                                ${isDark ? 'text-zinc-500 data-[state=active]:text-white' : 'text-zinc-400 data-[state=active]:text-zinc-900'}`}
                        >
                            <div className="flex items-center gap-2.5">
                                <Cpu className="w-3.5 h-3.5 transition-transform group-hover:rotate-12" />
                                <span className="text-[14px] uppercase font-black  ">Thông số kỹ thuật</span>
                            </div>
                        </TabsTrigger>

                        <TabsTrigger
                            value="size"
                            className={`relative rounded-none border-b-2 border-transparent data-[state=active]:border-amber-500 data-[state=active]:bg-transparent transition-all duration-500 px-8 h-full group
                                ${isDark ? 'text-zinc-500 data-[state=active]:text-white' : 'text-zinc-400 data-[state=active]:text-zinc-900'}`}
                        >
                            <div className="flex items-center gap-2.5">
                                <Ruler className="w-3.5 h-3.5 transition-transform group-hover:rotate-12" />
                                <span className="text-[14px] uppercase font-black  ">Chọn Size</span>
                            </div>
                        </TabsTrigger>

                        <TabsTrigger
                            value="shipping"
                            className={`relative rounded-none border-b-2 border-transparent data-[state=active]:border-amber-500 data-[state=active]:bg-transparent transition-all duration-500 px-8 h-full group
                                ${isDark ? 'text-zinc-500 data-[state=active]:text-white' : 'text-zinc-400 data-[state=active]:text-zinc-900'}`}
                        >
                            <div className="flex items-center gap-2.5">
                                <Truck className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                                <span className="text-[14px] uppercase font-black  ">Đưa Đón</span>
                            </div>
                        </TabsTrigger>
                        <TabsTrigger
                            value="reviews"
                            className={`relative rounded-none border-b-2 border-transparent data-[state=active]:border-amber-500 data-[state=active]:bg-transparent transition-all duration-500 px-8 h-full group
                                ${isDark ? 'text-zinc-500 data-[state=active]:text-white' : 'text-zinc-400 data-[state=active]:text-zinc-900'}`}
                        >
                            <div className="flex items-center gap-2.5">
                                <MessageSquare className="w-3.5 h-3.5 transition-transform group-hover:rotate-12" />
                                <span className="text-[14px] uppercase font-black  ">Đánh Giá</span>
                            </div>
                        </TabsTrigger>
                    </TabsList>
                </div>

                {/* --- SPECIFICATIONS TAB --- */}
                <TabsContent value="specs" className="mt-0 animate-in fade-in duration-700 slide-in-from-bottom-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-20 gap-y-2">
                            {product.specifications ? (
                                Object.entries(product.specifications).map(([key, value]) => (
                                    <div key={key} className={`flex justify-between items-center py-2 border-b transition-all duration-500 group
                                        ${isDark ? 'border-white/[0.03] hover:border-amber-500/20' : 'border-zinc-100 hover:border-zinc-300'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-1 h-1 rounded-full bg-amber-500/40 group-hover:bg-amber-500 transition-colors"></div>
                                            <span className={`text-[10px] uppercase font-bold  transition-colors
                                                ${isDark ? 'text-zinc-500 group-hover:text-amber-500/80' : 'text-zinc-400 group-hover:text-amber-600/80'}`}>
                                                {key}
                                            </span>
                                        </div>
                                        <span className={`text-[11px] font-medium  ${isDark ? 'text-zinc-200' : 'text-zinc-800'}`}>
                                            {value}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-2 py-16 text-center">
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-zinc-100 dark:bg-white/5 mb-6">
                                        <Info className="w-5 h-5 text-zinc-400" />
                                    </div>
                                    <p className={`text-[12px] uppercase  font-bold ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                                        Đang cập nhật tinh hoa...
                                    </p>
                                </div>
                            )}

                            {/* Standard Brand & Warranty items */}
                            <div className={`flex justify-between items-center py-2 border-b transition-all duration-500 group
                                ${isDark ? 'border-white/[0.03] hover:border-amber-500/20' : 'border-zinc-100 hover:border-zinc-300'}`}>
                                <div className="flex items-center gap-3">
                                    <div className="w-1 h-1 rounded-full bg-amber-500/40 group-hover:bg-amber-500 transition-colors"></div>
                                    <span className={`text-[10px] uppercase font-bold  ${isDark ? 'text-zinc-500 group-hover:text-amber-500' : 'text-zinc-400 group-hover:text-amber-600'}`}>Thương hiệu</span>
                                </div>
                                <span className={`text-[11px] font-medium  ${isDark ? 'text-zinc-100' : 'text-zinc-800'}`}>
                                    {product.brand?.name}
                                </span>
                            </div>
                            <div className={`flex justify-between items-center py-2 border-b transition-all duration-500 group
                                ${isDark ? 'border-white/[0.03] hover:border-amber-500/20' : 'border-zinc-100 hover:border-zinc-300'}`}>
                                <div className="flex items-center gap-3">
                                    <div className="w-1 h-1 rounded-full bg-amber-500/40 group-hover:bg-amber-500 transition-colors"></div>
                                    <span className={`text-[10px] uppercase font-bold ${isDark ? 'text-zinc-500 group-hover:text-amber-500' : 'text-zinc-400 group-hover:text-amber-600'}`}>Bảo hành</span>
                                </div>
                                <span className={`text-[11px] font-medium ${isDark ? 'text-zinc-100' : 'text-zinc-800'}`}>
                                    24 Tháng đặc quyền
                                </span>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* --- SIZE GUIDE TAB --- */}
                <TabsContent value="size" className="mt-0 animate-in fade-in duration-700 slide-in-from-bottom-4">
                    <div className="max-w-5xl mx-auto py-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                            {[huongdan1, huongdan2, huongdan3].map((img, index) => (
                                <div key={index} className={`relative overflow-hidden border p-2 transition-all duration-700 group
                                    ${isDark ? 'border-white/5 bg-zinc-900/40 hover:bg-zinc-900/60' : 'border-zinc-100 bg-zinc-50/50 hover:bg-zinc-100/30'}`}>

                                    <div className="overflow-hidden bg-white">
                                        <img
                                            src={img}
                                            alt={`Hướng dẫn chọn size ${index + 1}`}
                                            className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-105"
                                        />
                                    </div>

                                    <div className="mt-4 pb-2 px-2 text-center">
                                        <p className={`text-[9px] uppercase font-black ${isDark ? 'text-amber-500/80' : 'text-amber-600/80'}`}>
                                            Bước 0{index + 1}
                                        </p>
                                        <p className={`text-[11px] font-medium mt-1 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                                            {index === 0 ? "Đo chu vi cổ tay" : index === 1 ? "Xác định đường kính" : "Lựa chọn mặt đồng hồ"}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className={`mt-12 p-8 border text-center ${isDark ? 'border-white/5 bg-zinc-900/20' : 'border-zinc-100 bg-zinc-50/30'}`}>
                            <p className={`text-[11px] leading-relaxed max-w-2xl mx-auto italic ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                                "Sự vừa vặn không chỉ nằm ở những con số, mà còn là cảm giác thư thái khi tuyệt phẩm Chronos ôm trọn lấy cổ tay bạn. Nếu bạn còn phân vân, các nghệ nhân của chúng tôi luôn sẵn sàng hỗ trợ trực tuyến."
                            </p>
                        </div>
                    </div>
                </TabsContent>

                {/* --- SHIPPING & SERVICE TAB --- */}
                <TabsContent value="shipping" className="mt-0 animate-in fade-in duration-700 slide-in-from-bottom-4">
                    <div className="max-w-4xl mx-auto py-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14">

                            {/* Concierge Delivery */}
                            <div className={`p-8 md:p-10 border transition-all duration-700 relative overflow-hidden group
                                ${isDark ? 'border-white/5 bg-zinc-900/60 hover:bg-zinc-900/80' : 'border-zinc-100 bg-zinc-50/80 hover:bg-zinc-100/50'}`}>

                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Globe className="w-20 h-20" />
                                </div>

                                <div className="relative z-10">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-amber-500/10 text-amber-500">
                                            <Clock className="w-5 h-5" />
                                        </div>
                                        <h3 className={`text-[11px] uppercase font-black ${isDark ? 'text-white' : 'text-zinc-900'}`}>Dự kiến hành trình</h3>
                                    </div>

                                    <div className="space-y-6">
                                        {[
                                            { zone: "Nội thành Hà Nội", time: "Trong 24 giờ hỏa tốc" },
                                            { zone: "Khu vực Miền Bắc/Trung", time: "1 - 3 ngày làm việc" },
                                            { zone: "Khu vực Miền Nam", time: "3 - 5 ngày làm việc" }
                                        ].map((item, i) => (
                                            <div key={i} className="flex justify-between items-center group/item pb-4 border-b border-zinc-500/5">
                                                <span className={`text-[11px] italic transition-colors font-medium ${isDark ? 'text-zinc-500 group-hover/item:text-zinc-400' : 'text-zinc-400 group-hover/item:text-zinc-500'}`}>
                                                    {item.zone}
                                                </span>
                                                <span className={`text-[11px] font-bold ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                                                    {item.time}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Service Promises */}
                            <div className={`p-8 md:p-10 border transition-all duration-700 relative overflow-hidden group
                                ${isDark ? 'border-white/5 bg-zinc-900/60 hover:bg-zinc-900/80' : 'border-zinc-100 bg-zinc-50/80 hover:bg-zinc-100/50'}`}>

                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Award className="w-20 h-20" />
                                </div>

                                <div className="relative z-10">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-amber-500/10 text-amber-500">
                                            <Wallet className="w-5 h-5" />
                                        </div>
                                        <h3 className={`text-[11px] uppercase font-black ${isDark ? 'text-white' : 'text-zinc-900'}`}>Đặc quyền thanh toán</h3>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex items-start gap-4">
                                            <div className="mt-1 group-hover:scale-110 transition-transform">
                                                <CheckCircle2 className="w-4 h-4 text-amber-500/70" />
                                            </div>
                                            <div>
                                                <p className={`text-[12px] font-bold mb-1 ${isDark ? 'text-zinc-200' : 'text-zinc-800'}`}>Miễn phí vận chuyển toàn cầu</p>
                                                <p className={`text-[10px] leading-relaxed ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>
                                                    Áp dụng cho mọi đơn hàng thanh toán trước 100% qua chuyển khoản hoặc thẻ tín dụng.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4 pt-4 border-t border-zinc-500/5">
                                            <div className="mt-1 group-hover:scale-110 transition-transform">
                                                <RotateCcw className="w-4 h-4 text-amber-500/70" />
                                            </div>
                                            <div>
                                                <p className={`text-[12px] font-bold mb-1 ${isDark ? 'text-zinc-200' : 'text-zinc-800'}`}>7 Ngày thử thách tuyệt mỹ</p>
                                                <p className={`text-[10px] leading-relaxed ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>
                                                    Chính sách đổi trả linh hoạt trong vòng 7 ngày nếu sản phẩm còn nguyên vẹn, đảm bảo sự hài lòng tuyệt đối.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="reviews" className="mt-0 animate-in fade-in duration-700 slide-in-from-bottom-4">
                    <ProductReviews productId={product.id} isDark={isDark} />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default ProductDetailsTabs;
