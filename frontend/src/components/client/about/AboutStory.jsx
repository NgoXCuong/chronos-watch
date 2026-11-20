import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import classicWatch from '../../../assets/dong-ho-co.jpg';

const PRINCIPLES = [
    { title: 'Hiểu điều bạn lựa chọn', text: 'Loại máy, mặt kính, kích thước và khả năng chống nước được trình bày trong từng trang sản phẩm.' },
    { title: 'Rõ ràng trong từng mức giá', text: 'Giá bán và ưu đãi được hiển thị trước khi bạn quyết định, xuyên suốt từ sản phẩm đến giỏ hàng.' },
    { title: 'Gắn bó sau khi mua', text: 'Phiếu bảo hành điện tử giúp bạn tra cứu thời hạn và gửi yêu cầu hỗ trợ ngay trong tài khoản.' },
];

export default function AboutStory() {
    return (
        <section className="about-story" aria-labelledby="about-story-title">
            <figure className="about-story-image">
                <img src={classicWatch} alt="Các chi tiết cấu thành bộ máy đồng hồ cơ" loading="lazy" />
                <figcaption><span className="text-[10px] uppercase tracking-[.15em] text-navy-200">Bên trong mỗi chuyển động</span><p className="mt-2 text-lg font-medium text-white">Sự chính xác tạo nên giá trị.</p></figcaption>
            </figure>
            <div>
                <p className="atelier-eyebrow">01 / Điều chúng tôi tin</p>
                <h2 id="about-story-title" className="atelier-section-title mt-4">Bắt đầu từ chiếc đồng hồ.<br />Gắn bó bằng sự an tâm.</h2>
                <p className="mt-5 text-sm leading-7 text-muted-foreground">Cảm giác tìm được một chiếc đồng hồ phù hợp luôn rất riêng. Vì thế, Chronos đặt sự rõ ràng và trải nghiệm của bạn ở trung tâm: dễ tìm kiếm, dễ so sánh, dễ lựa chọn.</p>
                <div className="mt-6 divide-y divide-border">
                    {PRINCIPLES.map(({ title, text }, i) => <div key={title} className="flex gap-4 py-4"><span className="pt-0.5 text-xs tabular-nums text-muted-foreground">0{i + 1}</span><div><h3 className="text-sm font-semibold">{title}</h3><p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{text}</p></div></div>)}
                </div>
                <Link to="/products" className="atelier-text-link mt-5">Tìm chiếc đồng hồ của bạn <ArrowUpRight /></Link>
            </div>
        </section>
    );
}
