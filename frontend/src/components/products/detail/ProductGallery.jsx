import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade } from 'swiper/modules';
import { ChevronLeft, ChevronRight, Watch } from 'lucide-react';
import { cn } from '../../../lib/utils';
import 'swiper/css';
import 'swiper/css/effect-fade';

/**
 * Thư viện ảnh: một ảnh chính + rail thumbnail. Ảnh đầu tiên luôn là ảnh đại diện
 * (image_url) do trang cha xếp sẵn; thumbnail đứng dọc bên trái ở desktop để không
 * bị đẩy xuống dưới màn hình, còn mobile/tablet thì nằm ngang bên dưới.
 * Không autoplay: ảnh sản phẩm phải đứng yên cho khách xem, tránh việc ảnh chính
 * tự nhảy sang ảnh macro/dây khi khách đang đọc thông tin.
 */
const ProductGallery = ({ product, images, discount }) => {
    const [swiper, setSwiper] = useState(null);
    const [active, setActive] = useState(0);
    const hasMultiple = images.length > 1;

    const go = (step) => {
        if (!swiper) return;
        if (step < 0) swiper.slidePrev();
        else swiper.slideNext();
    };

    return (
        <div className="flex flex-col gap-3 xl:flex-row">
            {hasMultiple && (
                <div className="order-2 grid grid-cols-5 gap-2 sm:grid-cols-6 xl:order-1 xl:w-20 xl:shrink-0 xl:grid-cols-1 xl:content-start xl:gap-2.5">
                    {images.map((img, idx) => (
                        <button
                            key={`${img}-thumb-${idx}`}
                            type="button"
                            onClick={() => swiper?.slideTo(idx)}
                            aria-label={`Xem ảnh ${idx + 1}`}
                            aria-current={active === idx ? 'true' : undefined}
                            className={cn(
                                'aspect-square cursor-pointer overflow-hidden rounded-lg border bg-navy-50 p-1 transition-colors',
                                active === idx
                                    ? 'border-navy-600 ring-1 ring-navy-600/25'
                                    : 'border-border hover:border-navy-300'
                            )}
                        >
                            <img
                                src={img}
                                alt=""
                                loading="lazy"
                                decoding="async"
                                draggable={false}
                                className={cn(
                                    'h-full w-full select-none object-contain transition-opacity',
                                    active === idx ? 'opacity-100' : 'opacity-65 hover:opacity-100'
                                )}
                            />
                        </button>
                    ))}
                </div>
            )}

            <div className="relative order-1 min-w-0 flex-1 overflow-hidden rounded-xl border border-border bg-navy-50 shadow-card xl:order-2">
                {discount > 0 && (
                    <div className="absolute left-4 top-4 z-20 rounded-md bg-sale-soft px-2.5 py-1 text-[12px] font-extrabold uppercase tracking-[0.02em] text-sale">
                        -{discount}%
                    </div>
                )}

                {images.length === 0 ? (
                    <div className="flex aspect-square w-full items-center justify-center text-navy-300">
                        <Watch size={54} strokeWidth={1.5} aria-hidden="true" />
                    </div>
                ) : (
                    <Swiper
                        onSwiper={setSwiper}
                        onSlideChange={(instance) => setActive(instance.activeIndex)}
                        spaceBetween={0}
                        effect="fade"
                        fadeEffect={{ crossFade: true }}
                        modules={[EffectFade]}
                        className="aspect-square w-full"
                    >
                        {images.map((img, idx) => (
                            <SwiperSlide key={`${img}-${idx}`}>
                                <div className="flex h-full w-full items-center justify-center p-4 md:p-8">
                                    <img
                                        src={img}
                                        alt={`${product.name} — ảnh ${idx + 1}`}
                                        loading={idx === 0 ? 'eager' : 'lazy'}
                                        decoding="async"
                                        draggable={false}
                                        className="max-h-full max-w-full select-none object-contain"
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                )}

                {hasMultiple && (
                    <>
                        <button
                            type="button"
                            onClick={() => go(-1)}
                            disabled={active === 0}
                            aria-label="Ảnh trước"
                            className="absolute left-3 top-1/2 z-20 flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-border bg-card/85 text-navy-700 shadow-sm backdrop-blur-sm transition-opacity hover:bg-card disabled:cursor-not-allowed disabled:opacity-30"
                        >
                            <ChevronLeft size={18} strokeWidth={2.2} aria-hidden="true" />
                        </button>
                        <button
                            type="button"
                            onClick={() => go(1)}
                            disabled={active === images.length - 1}
                            aria-label="Ảnh sau"
                            className="absolute right-3 top-1/2 z-20 flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-border bg-card/85 text-navy-700 shadow-sm backdrop-blur-sm transition-opacity hover:bg-card disabled:cursor-not-allowed disabled:opacity-30"
                        >
                            <ChevronRight size={18} strokeWidth={2.2} aria-hidden="true" />
                        </button>

                        <span className="absolute bottom-3 right-3 z-20 rounded-md bg-navy-950/65 px-2 py-0.5 text-[11px] font-semibold tabular-nums text-white backdrop-blur-sm">
                            {active + 1} / {images.length}
                        </span>
                    </>
                )}
            </div>
        </div>
    );
};

export default ProductGallery;
