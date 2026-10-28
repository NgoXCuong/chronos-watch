import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, RefreshCw, ShieldCheck, SlidersHorizontal } from 'lucide-react';
import { HOTLINE_TEL } from '../../../constants/contact';

const VALUES = [
    {
        icon: ShieldCheck,
        title: 'Bảo hành tra được',
        body: 'Đơn giao thành công sinh phiếu bảo hành điện tử gắn với tài khoản của bạn, kèm thời hạn của từng sản phẩm.',
        to: '/warranties',
        link: 'Xem phiếu bảo hành của tôi',
    },
    {
        icon: SlidersHorizontal,
        title: 'Thông số công khai',
        body: 'Loại máy, chất liệu kính, độ chống nước, kích thước mặt hiển thị cho từng mẫu và dùng để lọc sản phẩm.',
        to: '/products',
        link: 'Lọc sản phẩm theo thông số',
    },
    {
        icon: RefreshCw,
        title: 'Nhận hàng rồi mới trả tiền',
        body: 'Kiểm tra hàng trước khi thanh toán, đổi trả trong 7 ngày nếu sản phẩm còn nguyên vẹn và còn tem niêm phong.',
        href: HOTLINE_TEL,
        link: 'Gọi hotline kiểm tra điều kiện',
    },
];

/** Ba giá trị cốt lõi — mỗi thẻ trỏ tới đúng nơi trên site nơi cam kết đó được thực hiện. */
const AboutValues = () => (
    <section>
        <p className="text-[12px] font-bold uppercase tracking-[0.02em] text-navy-600">Nguyên tắc bán hàng</p>
        <h2 className="mt-2 mb-5 text-2xl font-bold leading-tight text-foreground md:text-[28px]">
            Ba điều chúng tôi giữ được, và chỉ ra được trên site
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {VALUES.map(({ icon: Icon, title, body, to, href, link }) => (
                <article key={title} className="flex h-full flex-col rounded-xl border border-border bg-card p-5 shadow-card">
                    <span className="flex size-10 items-center justify-center rounded-lg bg-navy-50 text-navy-600">
                        <Icon size={19} strokeWidth={2} aria-hidden="true" />
                    </span>
                    <h3 className="mt-3 text-[15px] font-bold text-foreground">{title}</h3>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{body}</p>
                    {to && (
                        <Link
                            to={to}
                            className="group mt-auto flex items-center gap-1 pt-4 text-[12px] font-semibold text-navy-600 transition-colors hover:text-navy-800"
                        >
                            {link}
                            <ArrowRight size={13} strokeWidth={2} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
                        </Link>
                    )}
                    {href && (
                        <a
                            href={href}
                            className="group mt-auto flex items-center gap-1 pt-4 text-[12px] font-semibold text-navy-600 transition-colors hover:text-navy-800"
                        >
                            {link}
                            <ArrowRight size={13} strokeWidth={2} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
                        </a>
                    )}
                </article>
            ))}
        </div>
    </section>
);

export default AboutValues;
