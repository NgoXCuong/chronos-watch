import { Link } from 'react-router-dom';
import { ArrowUpRight, ShieldCheck } from 'lucide-react';
import { buttonVariants } from '../../ui/button-variants';
import watchPortrait from '../../../assets/anh-minh-hoa.jpg';

export default function AboutHero({ stats, loading }) {
    const metrics = [
        { value: stats.brandCount, label: 'Thương hiệu tuyển chọn' },
        { value: stats.countryCount, label: 'Quốc gia chế tác' },
        { value: stats.productCount, label: 'Thiết kế trong danh mục' },
    ];
    return (
        <header className="about-intro">
            <div className="about-intro-grid">
                <div className="about-intro-copy">
                    <p className="atelier-eyebrow">The Chronos story</p>
                    <h1 className="atelier-title mt-5">Dành cho những<br />khoảnh khắc <span className="text-foreground">của bạn.</span></h1>
                    <p className="mt-5 max-w-lg text-sm leading-7 text-muted-foreground">Một chiếc đồng hồ không chỉ để xem giờ. Đó là cách bạn thể hiện mình, trân trọng hiện tại và ghi dấu những điều đáng nhớ.</p>
                    <p className="mt-3 max-w-lg text-sm leading-7 text-muted-foreground">Chronos giúp bạn tìm thấy thiết kế ấy, với thông tin rõ ràng và trải nghiệm mua sắm an tâm từ lựa chọn đầu tiên đến khi đeo trên tay.</p>
                    <div className="mt-7 flex flex-wrap items-center gap-5">
                        <Link to="/products" className={buttonVariants({ size: 'lg' })}>Khám phá đồng hồ <ArrowUpRight size={16} /></Link>
                        <Link to="/brands" className="atelier-text-link">Các thương hiệu <ArrowUpRight /></Link>
                    </div>
                    <p className="mt-8 flex items-center gap-2 text-xs text-muted-foreground"><ShieldCheck size={16} className="text-foreground" aria-hidden="true" />Chính hãng · Minh bạch · Đồng hành</p>
                </div>
                <figure className="about-intro-image">
                    <img src={watchPortrait} alt="Cận cảnh mặt số xanh và dây thép của một chiếc đồng hồ chronograph" className="size-full object-cover" fetchPriority="high" />
                    <figcaption><span className="text-[9px] uppercase tracking-[.18em]">The art of time</span><span className="mt-1 block text-sm font-medium">Tinh tế trong từng chi tiết.</span></figcaption>
                    <span className="about-photo-index" aria-hidden="true">CHRONOS / 01</span>
                </figure>
            </div>
            <dl className="about-metrics">
                {metrics.map(({ value, label }) => <div key={label}><dd className="text-4xl font-semibold tabular-nums tracking-tight">{loading ? '—' : value.toLocaleString('vi-VN')}</dd><dt className="mt-2 text-xs text-muted-foreground">{label}</dt></div>)}
                <div className="about-metrics-note"><ShieldCheck size={23} strokeWidth={1.5} aria-hidden="true" /><p className="text-sm leading-relaxed">Chọn đồng hồ.<br /><span className="font-semibold">Chọn sự an tâm.</span></p></div>
            </dl>
        </header>
    );
}
