import { Link } from 'react-router-dom';
import { ArrowUpRight, RotateCcw, ShieldCheck, SlidersHorizontal } from 'lucide-react';
import { HOTLINE_TEL } from '../../../constants/contact';

const VALUES = [
    { icon: <ShieldCheck size={25} strokeWidth={1.5} />, title: 'An tâm dài lâu', body: 'Theo dõi phiếu bảo hành điện tử, thời hạn và yêu cầu hỗ trợ trong tài khoản của bạn.', to: '/warranties', link: 'Tra cứu bảo hành' },
    { icon: <SlidersHorizontal size={25} strokeWidth={1.5} />, title: 'Lựa chọn có cơ sở', body: 'Tìm kiếm theo thương hiệu, bộ máy và thông số để chọn mẫu phù hợp với nhu cầu của bạn.', to: '/products', link: 'Khám phá danh mục' },
    { icon: <RotateCcw size={25} strokeWidth={1.5} />, title: 'Luôn có người đồng hành', body: 'Kiểm tra hàng trước khi nhận. Hỗ trợ đổi trả trong 7 ngày với sản phẩm còn nguyên vẹn, đủ điều kiện.', href: HOTLINE_TEL, link: 'Liên hệ tư vấn' },
];

export default function AboutValues() {
    return (
        <section className="about-values" aria-labelledby="about-values-title">
            <div className="flex flex-wrap items-end justify-between gap-5">
                <div><p className="atelier-eyebrow text-navy-200">02 / Trải nghiệm Chronos</p><h2 id="about-values-title" className="atelier-section-title mt-4 text-white">Giá trị ở từng điểm chạm.</h2></div>
                <p className="max-w-sm text-sm leading-relaxed text-navy-200">Một trải nghiệm trọn vẹn, từ lúc khám phá đến những ngày đồng hành cùng chiếc đồng hồ của bạn.</p>
            </div>
            <div className="mt-10 grid gap-7 md:grid-cols-3 md:gap-10">
                {VALUES.map(({ icon, title, body, to, href, link }, i) => (
                    <article key={title} className="flex flex-col border-t border-navy-700 pt-6">
                        <div className="flex items-center justify-between text-navy-200"><span aria-hidden="true">{icon}</span><span className="text-[10px] tabular-nums">0{i + 1}</span></div>
                        <h3 className="mt-5 text-xl font-medium text-white">{title}</h3>
                        <p className="mb-6 mt-3 text-[13px] leading-7 text-navy-200">{body}</p>
                        {to ? <Link to={to} className="about-value-link">{link}<ArrowUpRight size={15} /></Link> : <a href={href} className="about-value-link">{link}<ArrowUpRight size={15} /></a>}
                    </article>
                ))}
            </div>
        </section>
    );
}
