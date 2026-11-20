import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import bannerApi from "../../api/banner.api";
import { parseBannerTitle } from "../../utils/bannerForm";
import { bannerImageUrl } from "../../utils/bannerImage";
import { defaultSlides } from "../../constants/homeSlides";
import { useImageRatio } from "../../hooks/useImageRatio";
import HeroWideSlide from "./HeroWideSlide";

export default function HeroBanner() {
  const [banners, setBanners] = useState([]);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const slides = banners.length ? banners.map((b) => ({
    id: b.id, image: bannerImageUrl(b.image_url), ...parseBannerTitle(b.title),
    eyebrow: b.eyebrow, subtitle: b.subtitle, link: b.link_url || "/products",
  })) : defaultSlides;
  const index = current % slides.length;
  const slide = slides[index];
  const { wide, onImageLoad } = useImageRatio(slide.image);

  useEffect(() => {
    let alive = true;
    bannerApi.getActive().then((data) => {
      if (alive) setBanners(Array.isArray(data) ? data : []);
    }).catch(() => {});
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    if (paused || hovered || slides.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => setCurrent((n) => (n + 1) % slides.length), 7000);
    return () => clearInterval(timer);
  }, [paused, hovered, slides.length]);

  return (
    <section aria-label="Bộ sưu tập nổi bật" aria-roledescription="băng chuyền"
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setHovered(true)}
      onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setHovered(false); }}
      className={cn("relative flex flex-col overflow-hidden rounded-xl border border-border bg-card text-foreground shadow-card", wide ? "h-[300px] sm:h-[400px] lg:h-[420px]" : "min-h-[490px] md:min-h-[540px]")}>
      <div className="flex items-center justify-between border-b border-border px-6 py-4 text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
        <span>Chronos / The watch edit</span><span className="tabular-nums">0{index + 1} — 0{slides.length}</span>
      </div>
      {wide ? (
        <div className="min-h-0 min-w-0 flex-1">
          <HeroWideSlide key={slide.id} slide={{ ...slide, alt: slide.titleLines.join(" ") }} onLoad={onImageLoad} priority={index === 0} />
        </div>
      ) : (
        <div key={slide.id} className="home-hero-enter grid flex-1 items-center gap-6 bg-muted/30 px-6 py-8 md:grid-cols-[1.1fr_1fr] md:px-10">
          <div className="relative z-10">
            <p className="mb-5 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              <span className="h-px w-6 bg-navy-300" />{slide.eyebrow || "Tuyển chọn bởi Chronos"}
            </p>
            <h2 className="max-w-lg text-[36px] font-extrabold leading-[1.06] tracking-tight md:text-[44px]">
              {slide.titleLines.map((line, i) => (
                <span key={i} className={cn("mr-2 inline", slide.accentLines[i] && "text-primary")}>{line} </span>
              ))}
            </h2>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">{slide.subtitle}</p>
            <Link to={slide.link || "/products"} className={cn(buttonVariants({ variant: "buy" }), "mt-7")}>
              Khám phá bộ sưu tập <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="relative mx-auto hidden h-[330px] w-full max-w-[300px] md:block">
            <div className="absolute -inset-3 rounded-t-full border border-navy-300/25" />
            <img src={slide.image} alt={slide.titleLines.join(" ")} onLoad={onImageLoad} fetchPriority="high"
              className="relative h-full w-full rounded-t-full rounded-b-lg object-cover shadow-hover" />
            <span className="absolute -bottom-3 -left-3 flex size-16 items-center justify-center rounded-full border border-border bg-card text-primary text-[10px] font-semibold uppercase tracking-widest">CW / 01</span>
          </div>
          <img src={slide.image} alt="" onLoad={onImageLoad} className="mt-3 h-44 w-full rounded-lg object-cover md:hidden" />
        </div>
      )}
      <div className="relative flex items-center justify-between gap-2 border-t border-border px-6 py-3">
        <Link to="/products" className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">Dấu ấn trên cổ tay <ArrowRight size={14} /></Link>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" aria-label={paused ? "Tự động chuyển banner" : "Dừng tự động chuyển banner"} onClick={() => setPaused(!paused)} className="size-8 text-muted-foreground hover:bg-accent hover:text-foreground">{paused ? <Play size={14} /> : <Pause size={14} />}</Button>
          <Button variant="ghost" size="icon" aria-label="Banner trước" onClick={() => setCurrent((index + slides.length - 1) % slides.length)} className="size-8 text-muted-foreground hover:bg-accent hover:text-foreground"><ChevronLeft size={16} /></Button>
          <Button variant="ghost" size="icon" aria-label="Banner tiếp theo" onClick={() => setCurrent((index + 1) % slides.length)} className="size-8 text-muted-foreground hover:bg-accent hover:text-foreground"><ChevronRight size={16} /></Button>
        </div>
      </div>
    </section>
  );
}
