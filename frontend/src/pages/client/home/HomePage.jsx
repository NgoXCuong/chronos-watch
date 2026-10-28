import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import HeroBanner from "../../../components/home/HeroBanner";
import ProductRail from "../../../components/home/ProductRail";
import Newsletter from "../../../components/home/Newsletter";
import BrandStrip from "../../../components/home/BrandStrip";
import Testimonials from "../../../components/home/Testimonials";
import CategorySidebar from "../../../components/market/CategorySidebar";
import TrustBar from "../../../components/market/TrustBar";
import CategoryCircleRow from "../../../components/market/CategoryCircleRow";
import FlashSalePanel from "../../../components/market/FlashSalePanel";
import PromoBanner from "../../../components/market/PromoBanner";
import SectionHead from "../../../components/market/SectionHead";
import { useCategories } from "../../../hooks/useCategories";

/** Trang chủ bố cục sàn TMĐT: hero+sidebar → tin cậy → danh mục → flash sale → bán chạy → mới về → hãng → promo → đánh giá → newsletter. */
const HomePage = () => {
  const { categories, loading } = useCategories();
  const { hash } = useLocation();

  useEffect(() => {
    if (hash === "#flash-sale") {
      document
        .getElementById("flash-sale")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  }, [hash]);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full space-y-10 px-12 py-10 md:px-16 lg:px-24">
        {/* Sidebar danh mục + hero carousel */}
        <div className="flex items-start gap-4">
          <CategorySidebar
            categories={categories}
            loading={loading}
            className="hidden lg:block"
          />
          <div className="min-w-0 flex-1 overflow-hidden rounded-xl border border-border shadow-card">
            <HeroBanner />
          </div>
        </div>

        <TrustBar />

        <section>
          <SectionHead
            eyebrow="Danh mục"
            title="Mua theo phong cách"
            to={null}
          />
          <CategoryCircleRow categories={categories} loading={loading} />
        </section>

        <FlashSalePanel />

        <ProductRail
          eyebrow="Bán chạy"
          title="Được mua nhiều nhất"
          sort="sold_count"
          dir="desc"
        />

        <ProductRail
          eyebrow="Nổi bật"
          title="Sản phẩm chọn lọc"
          sort="created_at"
          dir="desc"
        />

        <BrandStrip />

        <PromoBanner />

        <Testimonials />
      </div>

      <Newsletter />
    </div>
  );
};

export default HomePage;
