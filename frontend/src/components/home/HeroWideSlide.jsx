import { Link } from "react-router-dom";
export default function HeroWideSlide({ slide, onLoad, priority = false }) {
  return <Link to={slide.link || "/products"} aria-label={slide.alt || "Xem chương trình"} className="relative block h-full w-full overflow-hidden bg-muted/30">
    <img src={slide.image} alt="" aria-hidden="true" className="absolute inset-0 size-full scale-110 object-cover opacity-15 blur-2xl" />
    <img src={slide.image} alt={slide.alt || ""} onLoad={onLoad} loading={priority ? "eager" : "lazy"} className="relative h-full w-full object-contain" />
  </Link>;
}
