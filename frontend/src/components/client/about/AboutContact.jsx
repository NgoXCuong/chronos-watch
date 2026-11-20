import { ArrowUpRight, Clock, Mail, MapPin, Phone } from 'lucide-react';
import { ADDRESS_LINES, EMAIL, EMAIL_HREF, HOTLINE, HOTLINE_TEL, MAP_EMBED_URL, SHOWROOM_HOURS } from '../../../constants/contact';
import { buttonVariants } from '../../ui/button-variants';

const ROWS = [
    { icon: <MapPin />, label: 'Địa chỉ', value: ADDRESS_LINES.join(', ') },
    { icon: <Clock />, label: 'Giờ mở cửa', value: `${SHOWROOM_HOURS.days} · ${SHOWROOM_HOURS.time}` },
    { icon: <Phone />, label: 'Tư vấn lựa chọn', value: HOTLINE, href: HOTLINE_TEL },
    { icon: <Mail />, label: 'Email', value: EMAIL, href: EMAIL_HREF },
];

export default function AboutContact() {
    return (
        <section id="contact" className="about-contact" aria-labelledby="about-contact-title">
            <div className="about-contact-copy">
                <p className="atelier-eyebrow">03 / Kết nối với Chronos</p>
                <h2 id="about-contact-title" className="atelier-section-title mt-4">Một cuộc trò chuyện.<br />Một lựa chọn vừa ý.</h2>
                <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground">Ghé thăm hoặc liên hệ cùng Chronos. Chúng tôi sẵn sàng giúp bạn tìm chiếc đồng hồ phù hợp.</p>
                <dl className="mt-6 divide-y divide-border">
                    {ROWS.map(({ icon, label, value, href }) => <div key={label} className="flex items-start gap-3 py-3.5"><span className="mt-0.5 text-primary [&>svg]:size-4" aria-hidden="true">{icon}</span><div><dt className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</dt><dd className="mt-1 text-[13px] leading-relaxed">{href ? <a href={href} className="font-medium hover:text-primary hover:underline">{value}</a> : value}</dd></div></div>)}
                </dl>
                <a href={HOTLINE_TEL} className={buttonVariants({ className: 'mt-6' })}>Trò chuyện với Chronos <ArrowUpRight size={16} /></a>
            </div>
            <div className="about-contact-map">
                <div className="flex items-center justify-between gap-2 border-b border-border bg-card px-5 py-4"><span className="text-[11px] font-semibold uppercase tracking-[.12em]">Chronos · Hà Nội</span><MapPin size={16} className="text-primary" aria-hidden="true" /></div>
                <iframe title="Bản đồ showroom Chronos" src={MAP_EMBED_URL} className="h-[360px] w-full border-0 lg:h-full lg:min-h-[440px] dark:invert dark:hue-rotate-180" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
            </div>
        </section>
    );
}
