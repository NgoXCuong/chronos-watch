import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import brandApi from "../../api/brand.api";
import SectionHead from "../market/SectionHead";

const LIMIT = 6;

const toRows = (data) =>
  data?.rows || (Array.isArray(data) ? data : data?.data || []);

const BrandTile = ({ brand }) => (
  <Link
    to={`/products?brand=${brand.id}`}
    className="group flex flex-col items-center gap-2 rounded-xl border border-border bg-card px-3 py-4 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-navy-300 hover:shadow-hover"
  >
    <span className="flex size-14 items-center justify-center overflow-hidden rounded-full bg-navy-50 ring-1 ring-navy-500/10">
      {brand.logo_url ? (
        <img
          src={brand.logo_url}
          alt={brand.name}
          loading="lazy"
          className="size-11 object-contain transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <span className="text-lg font-extrabold text-navy-600">
          {brand.name.charAt(0).toUpperCase()}
        </span>
      )}
    </span>
    <span className="w-full truncate text-center text-[13px] font-bold text-navy-900">
      {brand.name}
    </span>
    <span className="text-[11px] text-muted-foreground">
      {brand.product_count ? `${brand.product_count} sản phẩm` : brand.country || "Chronos"}
    </span>
  </Link>
);

/** Dải thương hiệu nổi bật — logo thật từ /brands, click lọc sản phẩm theo hãng. */
const BrandStrip = () => {
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
    <section>
      <SectionHead
        eyebrow="Thương hiệu"
        title="Phân phối chính hãng"
        to="/brands"
        label="Xem tất cả"
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {brands.map((brand) => (
          <BrandTile key={brand.id} brand={brand} />
        ))}
      </div>
    </section>
  );
};

export default BrandStrip;
