import "../../../styles/home.css";
import "../../../styles/home-details.css";
import "../../../styles/home-refinements.css";
import "../../../styles/home-polish.css";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import SignatureHero from "../../../components/home/SignatureHero";
import CollectionGallery from "../../../components/home/CollectionGallery";

import ProductRail from "../../../components/home/ProductRail";
import HomeSupport from "../../../components/home/HomeSupport";
import BrandStrip from "../../../components/home/BrandStrip";
import Testimonials from "../../../components/home/Testimonials";
import TrustBar from "../../../components/market/TrustBar";
import FlashSalePanel from "../../../components/market/FlashSalePanel";
import PromoBanner from "../../../components/market/PromoBanner";
import HomeVouchers from '../../../components/home/HomeVouchers';
import { useCategories } from "../../../hooks/useCategories";

export default function HomePage() {
  const { categories } = useCategories();
  const { hash } = useLocation();
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth" });
  }, [hash]);
  return (
    <div className="chronos-home bg-card text-foreground">
      <div className="home-shell">
        <SignatureHero />
        <div className="home-trust"><TrustBar /></div>
        <BrandStrip />
        <FlashSalePanel />
        <HomeVouchers />
        <CollectionGallery categories={categories} />
        <ProductRail eyebrow="THE MOST WANTED" title="Những thiết kế được yêu thích" sort="sold_count" dir="desc" limit={8} />
        <PromoBanner />
        <ProductRail eyebrow="A NEW CHAPTER" title="Thêm một lựa chọn. Thêm một dấu ấn." sort="created_at" dir="desc" limit={8} />
        <Testimonials />
      </div>
      <HomeSupport />
    </div>
  );
}
