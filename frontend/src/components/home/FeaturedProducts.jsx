import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShoppingCart, Heart, Star } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import productApi from "../../api/product.api";
import anhminhhoa from "../../assets/anh-minh-hoa.jpg";

const formatCurrency = (val) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    val,
  );

const ProductCard = ({ product, isDark }) => {
  const name = product?.name || "Luxury Watch";
  const price = product?.price || 0;
  const originalPrice = product?.old_price || product?.originalPrice;
  const mainImage =
    product?.image_url || (product?.images && product?.images[0]) || anhminhhoa;
  const slug = product?.slug || "#";
  const discount = originalPrice
    ? Math.round((1 - price / originalPrice) * 100)
    : null;

  return (
    <div
      className={`group relative border overflow-hidden flex flex-col transition-all duration-500 ${
        isDark
          ? "bg-zinc-900 border-white/5 hover:border-amber-500/30"
          : "bg-white border-zinc-100 hover:border-amber-400/40 hover:shadow-lg hover:shadow-amber-500/5"
      }`}
    >
      {/* Discount badge */}
      {discount && (
        <div className="absolute top-3 left-3 z-10 bg-rose-700 rounded-full text-white text-[12px] font-bold  px-2 py-1 uppercase">
          -{discount}%
        </div>
      )}

      {/* Wishlist */}
      <button
        className={`absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center border backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100 ${
          isDark
            ? "bg-black/40 border-white/10 text-zinc-500 hover:text-amber-400 hover:border-amber-500/40"
            : "bg-white/80 border-zinc-200 text-zinc-400 hover:text-amber-600 hover:border-amber-400/60"
        }`}
      >
        <Heart className="w-3.5 h-3.5" />
      </button>

      {/* Image */}
      <Link
        to={`/products/${slug}`}
        className={`block relative overflow-hidden ${isDark ? "bg-zinc-800" : "bg-zinc-50"}`}
        style={{ aspectRatio: "1" }}
      >
        <img
          src={mainImage}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        <p className="text-[12px]  text-amber-500 uppercase mb-1.5">
          {product?.brand?.name || "Chronos"}
        </p>
        <Link to={`/products/${slug}`}>
          <h3
            className={`text-sm font-medium line-clamp-2 mb-2 leading-snug transition-colors ${
              isDark
                ? "text-zinc-200 hover:text-white"
                : "text-zinc-700 hover:text-zinc-900"
            }`}
          >
            {name}
          </h3>
        </Link>

        {/* Stars */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => {
              const ratingValue = i + 1;
              const avgRating = Number(product?.average_rating || 0);
              return (
                <Star
                  key={i}
                  className={`w-2.5 h-2.5 ${
                    ratingValue <= avgRating
                      ? "fill-amber-400 text-amber-400"
                      : "text-zinc-300"
                  }`}
                />
              );
            })}
          </div>
          <span
            className={`text-[12px] ml-1 ${isDark ? "text-zinc-600" : "text-zinc-400"}`}
          >
            ({product?.review_count || 0})
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <div>
            <p
              className={`text-base font-bold ${isDark ? "text-white" : "text-zinc-900"}`}
            >
              {formatCurrency(price)}
            </p>
            {originalPrice && (
              <p
                className={`text-xs line-through ${isDark ? "text-zinc-600" : "text-zinc-400"}`}
              >
                {formatCurrency(originalPrice)}
              </p>
            )}
          </div>
          <Link
            to={`/products/${slug}`}
            className={`flex items-center gap-1.5 px-3 py-2 text-[12px] uppercase font-bold border transition-all duration-300 ${
              isDark
                ? "border-white/10 text-zinc-400 hover:bg-amber-600 hover:border-amber-600 hover:text-white"
                : "border-zinc-200 text-zinc-500 hover:bg-amber-600 hover:border-amber-600 hover:text-white"
            }`}
          >
            <ShoppingCart className="w-3 h-3" />
            <span className="hidden sm:inline">Mua</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    productApi
      .getAll({ limit: 8, sort: "createdAt", order: "desc" })
      .then((data) => {
        // Sequelize findAndCountAll returns {count, rows}
        const items =
          data?.rows ||
          (Array.isArray(data) ? data : data?.data || data?.products || []);
        setProducts(items);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <p
            className={`text-[10px] uppercase ${isDark ? "text-zinc-600" : "text-zinc-400"}`}
          >
            Đang tải...
          </p>
        </div>
      </section>
    );
  }

  const displayProducts = products.length > 0 ? products : [];

  if (displayProducts.length === 0) return null; // Hide if no real data in DB

  return (
    <section>
      {/* Header */}
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-base text-amber-500 uppercase mb-2">Nổi Bật</p>
          <h2
            className={`text-3xl md:text-4xl font-bold transition-colors ${isDark ? "text-white" : "text-zinc-900"}`}
            style={{ fontFamily: "Georgia, serif" }}
          >
            Sản Phẩm Chọn Lọc
          </h2>
        </div>
        <Link
          to="/products"
          className={`hidden sm:flex items-center gap-2 text-[11px] uppercase font-semibold transition-colors group ${isDark ? "text-zinc-700 hover:text-amber-600" : "text-zinc-500 hover:text-amber-700"}`}
        >
          Xem tất cả{" "}
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {displayProducts.slice(0, 4).map((product) => (
          <ProductCard
            key={product._id || product.id}
            product={product}
            isDark={isDark}
          />
        ))}
      </div>

      {/* Mobile CTA */}
      <div className="mt-8 text-center sm:hidden">
        <Link
          to="/products"
          className={`inline-flex items-center gap-2 px-8 py-3 border text-[11px]  uppercase transition-all ${
            isDark
              ? "border-white/15 text-zinc-400 hover:text-white hover:border-white/30"
              : "border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:border-zinc-400"
          }`}
        >
          Xem Tất Cả <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </section>
  );
};

export default FeaturedProducts;
