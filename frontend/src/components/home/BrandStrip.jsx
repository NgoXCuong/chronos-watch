import BrandMark from "./BrandMark";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import brandApi from "../../api/brand.api";

const LIMIT = 6;

const toRows = (data) =>
  data?.rows || (Array.isArray(data) ? data : data?.data || []);

const BrandTile = ({ brand }) => (
  <Link
    to={`/products?brand=${brand.id}`}
    className="home-brand"
    aria-label={`Khám phá đồng hồ ${brand.name}`}
  >
    <BrandMark brand={brand} />
  </Link>
);

/** Dải thương hiệu nổi bật — logo thật từ /brands, click lọc sản phẩm theo hãng. */
const BrandStrip = () => {
  const [paused, setPaused] = useState(false);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    brandApi
      .getAll({ limit: LIMIT, sort: "product_count", dir: "desc" })
      .then((data) => alive && setBrands(toRows(data).slice(0, LIMIT)))
      .catch(() => alive && setBrands([]))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  if (loading) {
    return (
      <section>
        <div className="mb-5 h-[52px]" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {[...Array(LIMIT)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-xl border border-border bg-card px-3 py-6"
            >
              <div className="mx-auto size-14 rounded-full bg-navy-100" />
              <div className="mx-auto mt-3 h-3 w-2/3 rounded bg-navy-100" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (brands.length === 0) return null;

  return (
    <section className="home-brand-strip" aria-label="Thương hiệu tại Chronos">
      <div className="home-brand-intro">
        <span className="home-eyebrow">THE BRAND SELECTION</span>
        <Link to="/brands">Khám phá thương hiệu →</Link>
      </div>
      <div className="brand-marquee" data-paused={paused || undefined}>
        <div className="brand-track">
          <div className="brand-run-group">
            {brands.map((brand) => (
              <BrandTile key={brand.id} brand={brand} />
            ))}
          </div>
          <div className="brand-run-group" aria-hidden="true">
            {brands.map((brand) => (
              <div key={brand.id} className="home-brand">
                <BrandMark brand={brand} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="size-8 shrink-0"
        aria-label={paused ? "Chạy dải thương hiệu" : "Dừng dải thương hiệu"}
        onClick={() => setPaused(!paused)}
      >
        {paused ? <Play size={14} /> : <Pause size={14} />}
      </Button>
    </section>
  );
};
export default BrandStrip;
