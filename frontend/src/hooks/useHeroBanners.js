import { useEffect, useState } from "react";
import bannerApi from "../api/banner.api";
import { bannerImageUrl } from "../utils/bannerImage";
import { parseBannerTitle } from "../utils/bannerForm";

export default function useHeroBanners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [interacting, setInteracting] = useState(false);
  useEffect(() => {
    let alive = true;
    bannerApi.getActive().then((data) => {
      if (alive) setBanners((Array.isArray(data) ? data : []).filter((b) => b.image_url).map((b) => ({
        id: b.id, image: bannerImageUrl(b.image_url), link: b.link_url || "/products",
        title: parseBannerTitle(b.title || "").titleLines.join(" ") || "Bộ sưu tập Chronos",
      })));
    }).catch(() => {}).finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);
  useEffect(() => {
    if (paused || interacting || banners.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => setCurrent((n) => (n + 1) % banners.length), 7000);
    return () => clearInterval(timer);
  }, [paused, interacting, banners.length]);
  const index = banners.length ? current % banners.length : 0;
  return { banners, loading, index, slide: banners[index], paused, setPaused, setInteracting,
    previous: () => setCurrent((index + banners.length - 1) % banners.length),
    next: () => setCurrent((index + 1) % banners.length), goTo: setCurrent };
}
