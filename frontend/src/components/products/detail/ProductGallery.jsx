import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, FreeMode, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import 'swiper/css/effect-fade';

const ProductGallery = ({ product, images, discount, isDark, thumbsSwiper, setThumbsSwiper }) => {
    return (
        <div className="space-y-6">
            <div className={`group relative aspect-square overflow-hidden border ${isDark ? 'border-white/5 bg-zinc-900/50' : 'border-zinc-100 bg-zinc-50/50'} transition-all duration-700`}>
                {discount && (
                    <div className="absolute top-8 left-8 z-20 bg-amber-600 text-white text-[12px] font-bold px-4 py-2 uppercase shadow-2xl">
                        Ưu đãi -{discount}%
                    </div>
                )}
                <Swiper
                    spaceBetween={0}
                    navigation={true}
                    effect={'fade'}
                    thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                    modules={[FreeMode, Navigation, Thumbs, EffectFade, Autoplay]}
                    className="h-full w-full"
                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                >
                    {images.map((img, idx) => (
                        <SwiperSlide key={idx}>
                            <div className="w-full h-full p-4 md:p-12 flex items-center justify-center">
                                <img
                                    src={img}
                                    alt={`${product.name} view ${idx + 1}`}
                                    className="max-w-full max-h-full object-contain transition-transform duration-1000 group-hover:scale-110"
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* Interactive Thumbnails */}
            {images.length > 1 && (
                <div className="pt-2">
                    <Swiper
                        onSwiper={setThumbsSwiper}
                        spaceBetween={16}
                        slidesPerView={4}
                        breakpoints={{
                            640: { slidesPerView: 5 },
                            1024: { slidesPerView: 6 }
                        }}
                        freeMode={true}
                        watchSlidesProgress={true}
                        modules={[FreeMode, Navigation, Thumbs]}
                        className="thumbs-swiper-luxury"
                    >
                        {images.map((img, idx) => (
                            <SwiperSlide key={idx} className="cursor-pointer overflow-hidden border border-transparent transition-all hover:border-amber-500/50">
                                <div className={`aspect-square p-2 ${isDark ? 'bg-zinc-900/80' : 'bg-zinc-50'}`}>
                                    <img src={img} alt="" className="w-full h-full object-contain opacity-50 hover:opacity-100 transition-opacity" />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            )}
        </div>
    );
};

export default ProductGallery;
