import { Link } from "react-router-dom";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import useHeroBanners from "../../hooks/useHeroBanners";
import watchImage from "../../assets/hero-banner-sp.avif";

export default function SignatureHero() {
  const hero = useHeroBanners();
  return (
    <section className="signature-hero home-hero-enter" aria-labelledby="signature-title">
      <div className="signature-copy">
        <p className="home-eyebrow"><span className="h-px w-8 bg-primary" /> CHRONOS — THE WATCH EDIT</p>
        <h1 id="signature-title">Thời gian trôi.<br /><span>Dấu ấn ở lại.</span></h1>
        <p className="signature-description">Không chỉ là một chiếc đồng hồ.<br />Là phong cách, là cá tính, là câu chuyện của bạn.</p>
        <div className="mt-7 flex flex-wrap items-center gap-5">
          <Link to="/products" className={cn(buttonVariants({ size: "lg" }), "text-xs tracking-wide")}>Khám phá bộ sưu tập <ArrowUpRight size={17} /></Link>
          <Link to="/about" className="border-b border-border pb-1 text-xs font-medium text-foreground">Câu chuyện Chronos</Link>
        </div>
        <div className="signature-assurance"><ShieldCheck size={18} /><span>Đồng hồ chính hãng · An tâm từng lựa chọn</span></div>
      </div>
      <div className="signature-visual signature-banner" aria-label="Banner nổi bật" aria-roledescription="băng chuyền"
        onMouseEnter={() => hero.setInteracting(true)} onMouseLeave={() => hero.setInteracting(false)}
        onFocusCapture={() => hero.setInteracting(true)} onBlurCapture={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) hero.setInteracting(false); }}>
        {hero.loading ? <div className="size-full animate-pulse bg-muted" aria-label="Đang tải banner" /> : (
          <Link to={hero.slide?.link || "/products"} className="signature-banner-link">
            <img key={hero.slide?.id || "fallback"} src={hero.slide?.image || watchImage} alt={hero.slide?.title || "Khám phá bộ sưu tập Chronos"} fetchPriority="high" className="home-hero-enter" />
          </Link>
        )}
        {hero.banners.length > 1 && <div className="signature-banner-indicators" aria-label="Chuyển banner">
          {hero.banners.map((banner, i) => <button key={banner.id} onClick={() => hero.goTo(i)} aria-label={`Xem banner ${i + 1}`} aria-current={hero.index === i ? "true" : undefined} className={cn("signature-banner-dash", hero.index === i && "active")} />)}
        </div>}
      </div>

    </section>
  );
}
