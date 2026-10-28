import React from 'react';
import { Award, RefreshCw, ShieldCheck, Truck } from 'lucide-react';

/**
 * Dải cam kết dưới khối mua. Mọi dòng đều ứng với thứ dự án thật sự có:
 * số tháng bảo hành lấy từ sản phẩm, đổi trả 7 ngày theo chính sách, phiếu bảo hành
 * điện tử tra cứu ở /warranties — không bịa "bảo hành quốc tế 2 năm".
 */
const ProductTrustFeatures = ({ product }) => {
    const months = Number(product?.warranty_months) || 12;
    const items = [
        { icon: ShieldCheck, title: 'Cam kết chính hãng', sub: 'Full box, tem niêm phong' },
        { icon: Award, title: `Bảo hành ${months} tháng`, sub: 'Phiếu điện tử tra cứu online' },
        { icon: RefreshCw, title: 'Đổi trả trong 7 ngày', sub: 'Sản phẩm còn nguyên vẹn' },
        { icon: Truck, title: 'Giao hàng toàn quốc', sub: 'Miễn phí vận chuyển' },
    ];

    return (
        <div className="mt-6 grid grid-cols-2 gap-3 border-t border-border pt-6">
            {items.map(({ icon: Icon, title, sub }) => (
                <div key={title} className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-navy-50 text-navy-600">
                        <Icon size={16} strokeWidth={2} aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                        <p className="truncate text-[13px] font-bold text-foreground">{title}</p>
                        <p className="truncate text-xs text-muted-foreground">{sub}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductTrustFeatures;
