import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Banner ngang trong KHUNG CAO CỐ ĐỊNH: ảnh hiển thị bằng `object-contain` nên giữ nguyên
 * tỷ lệ — không cắt mất chữ như `object-cover` trong khung dọc, không giãn méo.
 * Phần letterbox hai bên lấp bằng chính ảnh phóng to + làm mờ, tăng độ sáng để không
 * thành những dải xám tối. Ảnh chính có drop-shadow nhẹ để tách khỏi nền.
 * Không đè chữ từ DB lên ảnh: creative ngang đã có sẵn tiêu đề/giảm giá trong file.
 */
const HeroWideSlide = ({ slide, onLoad, priority = false }) => (
    <Link
        to={slide.link || '/products'}
        aria-label={slide.alt || 'Xem chi tiết ưu đãi'}
        className="hero-anim-in group relative block h-full w-full overflow-hidden bg-navy-950"
    >
        {/* Nền mờ: lấy chính ảnh banner, phóng to + blur để lấp letterbox bằng màu của ảnh. */}
        <img
            src={slide.image}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full scale-125 object-cover object-center opacity-75 blur-3xl saturate-150"
        />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-navy-950/20 via-transparent to-navy-950/35" />

        {/* Ảnh chính: giữ nguyên tỷ lệ, không crop, không scale khi hover để tránh làm mờ. */}
        <img
            src={slide.image}
            alt={slide.alt || ''}
            onLoad={onLoad}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            decoding="async"
            draggable={false}
            className="relative z-10 h-full w-full object-contain object-center drop-shadow-[0_28px_50px_rgba(7,19,34,0.42)] transition-[filter] duration-500 group-hover:brightness-105"
        />
    </Link>
);

export default HeroWideSlide;
