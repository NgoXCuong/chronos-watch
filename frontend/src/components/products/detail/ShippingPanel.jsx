import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Banknote, Clock, PackageCheck, RefreshCw, ShieldCheck, Truck } from 'lucide-react';

const ZONES = [
    { zone: 'Nội thành Hà Nội', time: 'Trong 24 giờ' },
    { zone: 'Miền Bắc / miền Trung', time: '1 – 3 ngày làm việc' },
    { zone: 'Miền Nam', time: '3 – 5 ngày làm việc' },
];

const DELIVERY = [
    { icon: Truck, title: 'Phí vận chuyển', body: 'Miễn phí cho mọi đơn hàng trên toàn quốc.' },
    { icon: PackageCheck, title: 'Kiểm tra hàng', body: 'Được mở hộp kiểm tra trước khi thanh toán cho nhân viên giao.' },
    { icon: RefreshCw, title: 'Đổi trả', body: 'Trong 7 ngày kể từ khi nhận hàng, sản phẩm còn nguyên vẹn và còn tem niêm phong.' },
];

const PAYMENT = {
    icon: Banknote,
    title: 'Thanh toán',
    body: 'Nhận hàng khi thanh toán (COD) hoặc chuyển khoản qua SePay / VNPay.',
};

const Card = ({ icon: Icon, title, children }) => (
    <section className="rounded-xl border border-border bg-card p-5 shadow-card">
        <h3 className="mb-4 flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.02em] text-navy-700">
            <Icon size={16} strokeWidth={2} className="text-navy-500" aria-hidden="true" />
            {title}
        </h3>
        {children}
    </section>
);

const Bullet = ({ icon: Icon, title, body }) => (
    <li className="flex gap-2.5">
        <Icon size={15} strokeWidth={2} className="mt-0.5 shrink-0 text-navy-500" aria-hidden="true" />
        <div>
            <p className="text-[13px] font-bold text-foreground">{title}</p>
            <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{body}</p>
        </div>
    </li>
);

/** Điều khoản giao nhận — mốc thời gian là dự kiến, không cam kết giờ chính xác. */
const ShippingPanel = ({ product }) => (
    <div className="grid grid-cols-1 gap-4 py-2 md:grid-cols-2 xl:grid-cols-3">
        <Card icon={Clock} title="Thời gian giao dự kiến">
            <ul className="space-y-0.5">
                {ZONES.map((item) => (
                    <li key={item.zone} className="flex items-baseline justify-between gap-4 border-b border-border py-2 last:border-b-0">
                        <span className="text-[13px] text-muted-foreground">{item.zone}</span>
                        <span className="shrink-0 text-right text-[13px] font-semibold text-foreground">{item.time}</span>
                    </li>
                ))}
            </ul>
        </Card>

        <Card icon={Truck} title="Vận chuyển & đổi trả">
            <ul className="space-y-3.5">
                {DELIVERY.map((item) => (
                    <Bullet key={item.title} {...item} />
                ))}
            </ul>
        </Card>

        <Card icon={ShieldCheck} title="Bảo hành & thanh toán">
            <p className="text-[13px] font-semibold text-foreground">
                {product?.warranty_months ? `Bảo hành chính hãng ${product.warranty_months} tháng` : 'Bảo hành theo chính sách hãng'}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Phiếu bảo hành điện tử được kích hoạt theo đơn hàng và theo dõi tại mục Bảo hành của tài khoản.
            </p>
            <Link
                to="/warranties"
                className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-navy-600 transition-colors hover:text-navy-700"
            >
                Tra cứu phiếu bảo hành
                <ArrowUpRight size={14} strokeWidth={2} aria-hidden="true" />
            </Link>
            <div className="mt-4 border-t border-border pt-4">
                <Bullet {...PAYMENT} />
            </div>
        </Card>
    </div>
);

export default ShippingPanel;
