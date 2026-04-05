import React from 'react';
import { Award, Truck, RotateCcw, ShieldCheck } from 'lucide-react';

const ProductTrustFeatures = ({ isDark }) => {
    const trustItems = [
        { icon: <Award className="w-5 h-5" />, title: "Chất lượng tuyệt mỹ", desc: "Cam kết chính hãng 100%" },
        { icon: <Truck className="w-5 h-5" />, title: "Đặc quyền vận chuyển", desc: "Giao hàng hỏa tốc toàn cầu" },
        { icon: <RotateCcw className="w-5 h-5" />, title: "Đổi trả thượng lưu", desc: "7 ngày đổi trả không lý do" },
        { icon: <ShieldCheck className="w-5 h-5" />, title: "Bảo hiểm thời gian", desc: "2 năm bảo hành quốc tế" }
    ];

    return (
        <div className="grid grid-cols-2 gap-6 pt-10 border-t dark:border-white/5 border-zinc-100">
            {trustItems.map((item, index) => (
                <div key={index} className="flex items-center gap-4 group">
                    <div className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center bg-zinc-100 dark:bg-white/5 text-amber-500 group-hover:scale-110 transition-transform duration-500">
                        {item.icon}
                    </div>
                    <div>
                        <h4 className={`text-[14px] uppercase font-bold ${isDark ? 'text-zinc-200' : 'text-zinc-900'}`}>{item.title}</h4>
                        <p className={`text-[12px] ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>{item.desc}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductTrustFeatures;
