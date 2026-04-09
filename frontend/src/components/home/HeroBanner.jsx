import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import banner1 from "../../assets/banner1.avif";
import banner2 from "../../assets/banner2.avif";
import banner3 from "../../assets/banner3.avif";

const slides = [
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
];

const HeroBanner = () => {
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const goTo = (idx) => {
    if (transitioning || idx === current) return;
    setTransitioning(true);
    setTimeout(() => {
      setCurrent(idx);
      setTransitioning(false);
    }, 400);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (!transitioning) goTo((current + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [current, transitioning]);

  const slide = slides[current];

  return (
    <section
      className={`relative w-full h-[calc(100vh-64px)] md:h-[calc(100vh-104px)] overflow-hidden flex flex-col transition-colors duration-500 ${isDark ? "bg-[#080808]" : "bg-stone-50"}`}
    >
      {/* Background image */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${transitioning ? "opacity-0" : "opacity-100"}`}
      >
        <img
          src={slide.image}
          alt=""
          className="w-full h-full object-cover object-center"
          style={{
            filter: isDark
              ? "brightness(0.22) saturate(0.8)"
              : "brightness(0.55) saturate(0.7)",
          }}
        />
        {/* Overlay */}
        <div
          className={`absolute inset-0 ${
            isDark
              ? "bg-linear-to-r from-[#080808] via-[#080808]/85 to-transparent"
              : "bg-linear-to-r from-stone-50 via-stone-50/80 to-transparent"
          }`}
        ></div>
        <div
          className={`absolute inset-0 ${
            isDark
              ? "bg-linear-to-t from-[#080808]/70 via-transparent to-[#080808]/30"
              : "bg-linear-to-t from-stone-50/60 via-transparent to-stone-50/20"
          }`}
        ></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col max-w-350 mx-auto w-full px-6 md:px-16 pt-8 md:pt-12 pb-6 hero-content-padding">
        <div className="flex-1 flex flex-col md:flex-row gap-8 md:gap-0">
          {/* Left: Text */}
          <div className="flex-1 flex flex-col justify-center md:pr-16 md:max-w-[55%]">
            {/* Eyebrow */}
            <div
              key={`ey-${current}`}
              className="hero-anim-in flex items-center gap-3 mb-6 md:mb-8"
            >
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-[10px] md:text-[11px]  uppercase font-semibold text-amber-500">
                {slide.eyebrow}
              </span>
            </div>

            {/* Headline */}
            <h1
              key={`h1-${current}`}
              className="hero-anim-in delay-100 text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9]  mb-4 md:mb-8 hero-title-text"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              {slide.titleLines.map((line, i) => (
                <span
                  key={i}
                  className={`block ${slide.accentLines[i] ? "text-amber-500" : isDark ? "text-white" : "text-zinc-900"}`}
                >
                  {line}
                </span>
              ))}
            </h1>

            {/* Divider */}
            <div
              key={`dv-${current}`}
              className="hero-anim-in delay-200 flex items-center gap-4 mb-6"
            >
              <div className="w-12 h-px bg-amber-500/50"></div>
              <div className="w-2 h-2 rounded-full bg-amber-500/30"></div>
            </div>

            {/* Subtitle */}
            <p
              key={`sb-${current}`}
              className={`hero-anim-in delay-300 text-sm md:text-base leading-relaxed max-w-md mb-8 md:mb-12 hero-subtitle ${isDark ? "text-zinc-400" : "text-zinc-600"}`}
            >
              {slide.subtitle}
            </p>

            {/* GLOBAL CTA */}
            <div className="hero-anim-in delay-400 flex items-start mt-auto md:mt-0">
              <Link
                to="/products"
                className="group flex items-center justify-center gap-3 px-10 py-4.5 bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-bold uppercase transition-all duration-500 hover:shadow-[0_10px_30px_rgba(217,119,6,0.3)]"
              >
                Khám Phá Bộ Sưu Tập
                <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Right: Image showcase */}
          <div className="hidden md:flex flex-col justify-center items-center flex-1 relative">
            {/* ĐỔI max-w-sm THÀNH max-w-md HOẶC max-w-lg ĐỂ KHUNG TO RA */}
            <div
              key={`img-${current}`}
              className={`hero-img-anim relative w-full max-w-md overflow-hidden hero-image-box ${transitioning ? "opacity-0 scale-95" : ""}`}
              style={{ aspectRatio: "3/4" }}
            >
              {/* Corner decorations */}
              <div className="absolute -top-3 -right-3 w-20 h-20 border-t-2 border-r-2 border-amber-500/40 z-10"></div>
              <div className="absolute -bottom-3 -left-3 w-20 h-20 border-b-2 border-l-2 border-amber-500/40 z-10"></div>

              {/* THÊM scale-105 HOẶC scale-110 ĐỂ ZOOM ẢNH BÊN TRONG TO HƠN */}
              <img
                src={slide.image}
                alt=""
                className="w-full h-full object-cover object-center scale-105"
                style={{ filter: "brightness(0.88) contrast(1.05)" }}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent"></div>

              {/* Floating badge */}
              <div className="absolute bottom-6 left-6 right-6 bg-black/55 backdrop-blur-xl border border-white/10 px-4 py-3">
                <p className="text-base text-amber-500 uppercase mb-1">
                  Chronos Collection
                </p>
                <p className="text-md text-white font-medium">
                  {slide.eyebrow}
                </p>
              </div>
            </div>

            {/* Vertical slide indicators */}
            <div className="absolute top-0 right-0 flex flex-col gap-2 py-4">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`transition-all duration-500 rounded-full ${i === current ? "w-1.5 h-10 bg-amber-500" : `w-1.5 h-3 ${isDark ? "bg-white/20 hover:bg-white/40" : "bg-zinc-900/15 hover:bg-zinc-900/30"}`}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile dots */}
      <div className="relative z-10 flex md:hidden justify-center gap-2 pb-6">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`transition-all duration-500 rounded-full ${i === current ? "w-8 h-1.5 bg-amber-500" : `w-1.5 h-1.5 ${isDark ? "bg-white/30" : "bg-zinc-900/20"}`}`}
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

                /* Height-based responsiveness for zoom levels like 125% or small screens */
                @media (max-height: 820px) {
                    .hero-title-text { font-size: clamp(2rem, 8vh, 4rem) !important; line-height: 1 !important; }
                    .hero-content-padding { padding-top: 1.5rem !important; padding-bottom: 1rem !important; }
                    .hero-stats-padding { pt: 0.5rem !important; }
                    .hero-image-box { max-height: 50vh !important; }
                }
                @media (max-height: 700px) {
                    .hero-subtitle { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 1rem !important; }
                    .hero-stats-bar { display: none; } /* Hide stats on extremely short screens to favor main CTA */
                }
            `}</style>
    </section>
  );
};

export default HeroBanner;
