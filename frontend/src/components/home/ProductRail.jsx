import React, { useEffect, useState } from "react";
import productApi from "../../api/product.api";
import ProductCard from "../market/ProductCard";
import SectionHead from "../market/SectionHead";

const toRows = (data) =>
  data?.rows || (Array.isArray(data) ? data : data?.products || data?.data || []);

const Skeleton = ({ count }) => (
  <section>
    <div className="mb-5 h-[52px]" />
    <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="animate-pulse overflow-hidden rounded-xl border border-border bg-card"
        >
          <div className="aspect-square bg-navy-100" />
          <div className="space-y-2 p-4">
            <div className="h-3 w-1/3 rounded bg-navy-100" />
            <div className="h-4 w-3/4 rounded bg-navy-100" />
            <div className="h-5 w-1/2 rounded bg-navy-100" />
          </div>
        </div>
      ))}
    </div>
  </section>
);

/** Một hàng sản phẩm trang chủ: sort server-side theo `sort`/`dir` + đầu section. */
const ProductRail = ({ eyebrow, title, to, label, sort, dir = "desc", limit = 8 }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    productApi
      .getAll({ sort, dir, limit })
      .then((data) => alive && setProducts(toRows(data).slice(0, limit)))
      .catch(() => alive && setProducts([]))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [sort, dir, limit]);

  if (loading) return <Skeleton count={Math.min(limit, 4)} />;
  // Không có dữ liệu thật thì ẩn hẳn cả khối, không dựng khung rỗng
  if (products.length === 0) return null;

  return (
    <section>
      <SectionHead eyebrow={eyebrow} title={title} to={to} label={label} />
      <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id ?? product._id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default ProductRail;
