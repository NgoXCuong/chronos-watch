import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Keyboard } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import FlashProductCard from "./FlashProductCard";
import "swiper/css";

export default function FlashSaleRail({ items, ended }) {
  const slider = useRef(null);
  const [bounds, setBounds] = useState({ start: true, end: true });
  const updateBounds = (instance) => {
    const start = Boolean(instance.isBeginning);
    const end = Boolean(instance.isEnd || instance.isLocked);
    setBounds((previous) => previous.start === start && previous.end === end ? previous : { start, end });
  };
  return <div className="flash-carousel">
    <div className="flash-carousel-toolbar">
      <p className="text-xs text-muted-foreground"><strong className="tabular-nums text-foreground">{items.length}</strong> sản phẩm trong đợt · Trượt để khám phá</p>
      <div className="flex shrink-0 gap-2">
        <Button variant="outline" size="icon" className="size-8" aria-label="Sản phẩm Flash Sale trước" disabled={bounds.start} onClick={() => slider.current?.slidePrev()}><ChevronLeft size={17} /></Button>
        <Button variant="outline" size="icon" className="size-8" aria-label="Sản phẩm Flash Sale tiếp theo" disabled={bounds.end} onClick={() => slider.current?.slideNext()}><ChevronRight size={17} /></Button>
      </div>
    </div>
    <Swiper modules={[A11y, Keyboard]} slidesPerView="auto" spaceBetween={12} centerInsufficientSlides watchOverflow keyboard={{ enabled: true, onlyInViewport: true }}
      speed={300} onSwiper={(instance) => { slider.current = instance; updateBounds(instance); }} onSlideChange={updateBounds} onResize={updateBounds} onBreakpoint={updateBounds} onSlidesUpdated={updateBounds}
      a11y={{ containerMessage: "Sản phẩm Flash Sale", itemRoleDescriptionMessage: "sản phẩm", slideLabelMessage: "{{index}} trên {{slidesLength}}" }}>
      {items.map((item) => <SwiperSlide key={item.id} className="flash-carousel-slide"><FlashProductCard item={item} ended={ended} /></SwiperSlide>)}
    </Swiper>
  </div>;
}
