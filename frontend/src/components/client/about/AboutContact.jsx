import React from 'react';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import {
    ADDRESS_LINES,
    EMAIL,
    EMAIL_HREF,
    HOTLINE,
    HOTLINE_TEL,
    MAP_EMBED_URL,
    SHOWROOM_HOURS,
} from '../../../constants/contact';

const ROWS = [
    { icon: MapPin, label: 'Showroom', lines: ADDRESS_LINES },
    { icon: Clock, label: 'Giờ mở cửa', lines: [SHOWROOM_HOURS.days, SHOWROOM_HOURS.time] },
    { icon: Phone, label: 'Hotline', lines: [HOTLINE], href: HOTLINE_TEL },
    { icon: Mail, label: 'Email', lines: [EMAIL], href: EMAIL_HREF },
];

const Row = ({ icon: Icon, label, lines, href }) => (
    <div className="rounded-xl border border-border bg-card p-4 shadow-card">
        <p className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.02em] text-navy-700">
            <Icon size={15} strokeWidth={2} className="text-navy-500" aria-hidden="true" />
            {label}
        </p>
        {lines.map((line) =>
            href ? (
                <a key={line} href={href} className="mt-1.5 block text-[13px] font-semibold text-foreground transition-colors hover:text-navy-600">
                    {line}
                </a>
            ) : (
                <p key={line} className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
                    {line}
                </p>
            ),
        )}
    </div>
);

/** Liên hệ + bản đồ. Ảnh nền map của Google tự đảo màu ở giao diện tối bằng filter. */
const AboutContact = () => (
    <section className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.02em] text-navy-600">Liên hệ</p>
            <h2 className="mt-2 mb-4 text-2xl font-bold leading-tight text-foreground md:text-[28px]">
                Ghé cửa hàng, hoặc gọi trước khi đặt
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
                {ROWS.map((row) => (
                    <Row key={row.label} {...row} />
                ))}
            </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-navy-50 shadow-card">
            <iframe
                title="Bản đồ showroom Chronos"
                src={MAP_EMBED_URL}
                className="h-[360px] w-full border-0 lg:h-full lg:min-h-[420px] dark:invert dark:hue-rotate-180"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
            />
        </div>
    </section>
);

export default AboutContact;
