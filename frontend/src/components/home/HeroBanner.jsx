import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import bannerApi from "../../api/banner.api";
import { parseBannerTitle } from "../../utils/bannerForm";
import { bannerImageUrl } from "../../utils/bannerImage";
import HeroWideSlide from "./HeroWideSlide";
import { useImageRatio } from "../../hooks/useImageRatio";
import banner1 from "../../assets/banner1.avif";
import banner2 from "../../assets/banner2.avif";
import banner3 from "../../assets/banner3.avif";

// Dữ liệu mặc định khi chưa có banner trong CSDL (quản lý tại /admin/banners)
const defaultSlides = [
  {
    id: 1,
    image: banner1,
    eyebrow: "Bộ Sưu Tập Mới 2026",
    titleLines: ["NGHỆ", "THUẬT", "CỦA THỜI", "GIAN"],
    accentLines: [false, true, false, false],
    subtitle:
      "Từng chiếc đồng hồ là một tác phẩm nghệ thuật tỉ mỉ, được chế tác bởi những nghệ nhân tài ba với hơn 150 năm kinh nghiệm.",
  },
  {
    id: 2,
    image: banner2,
    eyebrow: "Di Sản Thụy Sĩ",
    titleLines: ["KỶ", "NGUYÊN", "MỚI CỦA", "ĐẲNG CẤP"],
    accentLines: [false, true, false, false],
    subtitle:
      "Sự hoàn hảo được đo đếm bằng từng mili-giây. Di sản Thụy Sĩ hơn thế kỷ trong từng chi tiết được trau chuốt kỹ lưỡng.",
  },
  {
    id: 3,
    image: banner3,
    eyebrow: "Phiên bản giới hạn",
    titleLines: ["TINH", "TẾ", "VÀ", "ĐỘC BẢN"],
    accentLines: [false, false, false, true],
    subtitle:
      "Chỉ dành cho những ai trân quý sự hoàn hảo. Các Phiên bản giới hạn được đánh số thủ công và đi kèm chứng nhận độc quyền.",
  },
].map((slide) => ({ ...slide, alt: slide.titleLines.join(" ") }));

// Quy ước tách tiêu đề lưu trong DB thành các dòng hiển thị nằm ở utils/bannerForm
// (dùng chung với form ở /admin/banners): mỗi dòng cách nhau "|", dòng bắt đầu "!" tô màu nhấn

const HeroBanner = () => {
  const [dbBanners, setDbBanners] = useState([]);
  const slides = dbBanners.length
    ? dbBanners.map((b) => {
        const parsed = parseBannerTitle(b.title);
        return {
          id: b.id,
          image: bannerImageUrl(b.image_url),
          eyebrow: b.eyebrow || "",
          ...parsed,
          alt: parsed.titleLines.join(" "),
          subtitle: b.subtitle || "",
          link: b.link_url || "/products",
        };
      })
    : defaultSlides;
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  // Banner từ CSDL về có thể làm slider ngắn hơn (3 mặc định → 1), nên chỉ số phải
  // được clamp ngay khi render thay vì sửa state trong effect
  const index = current < slides.length ? current : 0;

  useEffect(() => {
    bannerApi
      .getActive()
      .then((data) => setDbBanners(Array.isArray(data) ? data : []))
      .catch(() => setDbBanners([]));
  }, []);

  const goTo = (idx) => {
    if (transitioning || idx === index) return;
    setTransitioning(true);
    setTimeout(() => {
      setCurrent(idx);
      setTransitioning(false);
    }, 400);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (!transitioning) goTo((index + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [index, transitioning]);

  const slide = slides[index];
  // Khung hero cao CỐ ĐỊNH; ảnh ngang (creative dựng sẵn chữ) hiển thị nguyên vẹn bằng
  // object-contain, ảnh dọc/vuông giữ bố cục chữ đè nền của thiết kế gốc.
  const { wide, onImageLoad } = useImageRatio(slide.image);

  return (
    <section className="hero-slider relative flex h-[460px] w-full flex-col overflow-hidden bg-navy-950 md:h-[580px] lg:h-[620px]">
      {wide ? (
        <div
          className={`h-full w-full transition-opacity duration-300 ${transitioning ? "opacity-0" : "opacity-100"}`}
        >
          <HeroWideSlide
            key={`wide-${slide.id ?? index}`}
            slide={slide}
            onLoad={onImageLoad}
            priority={index === 0}
          />
        </div>
      ) : (
        <>
        {/* Background image + overlay navy chuẩn design system */}
        <div
          className={`absolute inset-0 transition-opacity duration-700 ${transitioning ? "opacity-0" : "opacity-100"}`}
        >
          <img
            src={slide.image}
            alt=""
            onLoad={onImageLoad}
            className="h-full w-full object-cover object-center brightness-[0.45] saturate-[0.85]"
          />
          <div className="absolute inset-0 bg-linear-to-r from-navy-950/95 via-navy-900/80 to-navy-800/30"></div>
          <div className="absolute inset-0 bg-linear-to-t from-navy-950/80 via-transparent to-navy-950/30"></div>
        </div>

        {/* Content */}
        <div className="hero-content-padding relative z-10 mx-auto flex w-full flex-1 flex-col px-6 pt-6 pb-5 md:px-10 md:pt-8">
          <div className="flex flex-1 flex-col gap-8 md:flex-row md:gap-0">
            {/* Left: Text */}
            <div className="flex w-full min-w-0 flex-1 flex-col justify-center overflow-hidden md:justify-evenly xl:w-[58%] xl:flex-none xl:pr-8">
              {/* Eyebrow */}
              <div
                key={`ey-${index}`}
                className="hero-anim-in mb-3 flex items-center gap-3 md:mb-4"
              >
                <Clock className="h-3.5 w-3.5 text-navy-300" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-navy-100 md:text-xs">
                  {slide.eyebrow}
                </span>
              </div>

              {/* Headline */}
              <h1
                key={`h1-${index}`}
                className="hero-anim-in delay-100 mb-3 text-[clamp(1.75rem,3vw_+_1rem,3.75rem)] font-extrabold leading-[0.95] text-white md:mb-2 hero-title-text"
              >
                {slide.titleLines.map((line, i) => (
                  <span
                    key={i}
                    className={`block whitespace-nowrap ${slide.accentLines[i] ? "text-navy-300" : "text-white"}`}
                  >
                    {line}
                  </span>
                ))}
              </h1>

              {/* Divider */}
              <div
                key={`dv-${index}`}
                className="hero-anim-in delay-200 mb-4 flex items-center gap-4 md:mb-0"
              >
                <div className="h-px w-12 bg-navy-300/60"></div>
                <div className="h-2 w-2 rounded-full bg-navy-300/40"></div>
              </div>

              {/* Subtitle */}
              <p
                key={`sb-${index}`}
                className="hero-anim-in delay-300 mb-5 w-full max-w-none text-[13px] leading-relaxed text-navy-100 md:mb-0 md:text-[clamp(0.8rem,0.7vw_+_0.55rem,1rem)] hero-subtitle"
              >
                {slide.subtitle}
              </p>

              {/* CTA — nút buy trên nền tối: đảo màu trắng ↔ navy */}
              <div className="hero-anim-in delay-400 mt-auto flex items-start md:mt-0">
                <Link
                  to={slide.link || "/products"}
                  className={`${buttonVariants({ variant: "buy", size: "lg" })} border-white bg-white text-navy-800 hover:bg-navy-600 hover:border-navy-600 hover:text-white`}
                >
                  Khám Phá Bộ Sưu Tập
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Right: Image showcase */}
            <div className="relative hidden min-w-0 flex-1 flex-col items-center justify-center xl:flex">
              <div
                key={`img-${index}`}
                className={`hero-img-anim relative w-full max-w-md overflow-hidden rounded-xl shadow-navy hero-image-box ${transitioning ? "opacity-0 scale-95" : ""}`}
                style={{ aspectRatio: "3/4", maxHeight: "calc(100% - 1.5rem)" }}
              >
                {/* Corner decorations — viền vát chamfer navy */}
                <div className="absolute -top-3 -right-3 z-10 h-20 w-20 border-t-2 border-r-2 border-navy-300/50"></div>
                <div className="absolute -bottom-3 -left-3 z-10 h-20 w-20 border-b-2 border-l-2 border-navy-300/50"></div>

                <img
                  src={slide.image}
                  alt=""
                  className="h-full w-full scale-105 object-cover object-center"
                />
                <div className="absolute inset-0 bg-linear-to-t from-navy-950/70 via-transparent to-transparent"></div>

                {/* Floating badge — kính mờ navy */}
                <div className="absolute bottom-6 left-6 right-6 rounded-lg border border-white/10 bg-navy-950/60 px-4 py-3 backdrop-blur-md">
                  <p className="text-base uppercase tracking-[0.18em] text-navy-300 mb-1">
                    Chronos Collection
                  </p>
                  <p className="text-md font-medium text-white">
                    {slide.eyebrow}
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
        </>
      )}

      {/* Vertical slide indicators — luôn hiện trên desktop, không phụ thuộc khung ảnh */}
      <div className="absolute top-0 right-0 z-20 hidden flex-col gap-2 py-4 md:flex">
        {slides.map((_, i) => (
          <button
            key={i}
            aria-label={`Chuyển đến slide ${i + 1}`}
            onClick={() => goTo(i)}
            className={`transition-all duration-500 rounded-full ${i === index ? "h-10 w-1.5 bg-navy-300" : "h-3 w-1.5 bg-white/20 hover:bg-white/40"}`}
          />
        ))}
      </div>

      {/* Mobile dots */}
      <div className="relative z-10 flex justify-center gap-2 pb-6 md:hidden">
        {slides.map((_, i) => (
          <button
            key={i}
            aria-label={`Chuyển đến slide ${i + 1}`}
            onClick={() => goTo(i)}
            className={`transition-all duration-500 rounded-full ${i === index ? "h-1.5 w-8 bg-navy-300" : "h-1.5 w-1.5 bg-white/30"}`}
          />
        ))}
      </div>

      <style>{`
                @keyframes heroIn {
                    from { opacity: 0; transform: translateY(24px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes heroImgIn {
                    from { opacity: 0; transform: scale(0.96) translateX(20px); }
                    to { opacity: 1; transform: scale(1) translateX(0); }
                }
                .hero-anim-in { animation: heroIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; }
                .hero-img-anim { animation: heroImgIn 1s cubic-bezier(0.16, 1, 0.3, 1) both; }
                .delay-100 { animation-delay: 0.1s; }
                .delay-200 { animation-delay: 0.2s; }
                .delay-300 { animation-delay: 0.35s; }
                .delay-400 { animation-delay: 0.5s; }
                @media (prefers-reduced-motion: reduce) {
                    .hero-anim-in, .hero-img-anim { animation: none; }
                }
            `}</style>
    </section>
  );
};

export default HeroBanner;
