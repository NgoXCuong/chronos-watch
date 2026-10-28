import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Quote } from "lucide-react";
import reviewApi from "../../api/review.api";
import SectionHead from "../market/SectionHead";
import { ReviewStars } from "../admin/Review/ReviewStars";

const displayName = (review) =>
  review.user?.full_name?.trim() || review.user?.username || "Người dùng Chronos";

const TestimonialCard = ({ review }) => (
  <figure className="flex h-full flex-col rounded-xl border border-border bg-card p-5 shadow-card">
    <div className="flex items-center justify-between">
      <ReviewStars rating={Number(review.rating) || 0} size={13} />
      <Quote size={18} strokeWidth={2} className="text-navy-200" aria-hidden="true" />
    </div>
    <blockquote className="mt-3 line-clamp-4 flex-1 text-sm leading-relaxed text-card-foreground">
      “{review.comment}”
    </blockquote>
    <figcaption className="mt-4 flex items-center gap-3 border-t border-border pt-4">
      <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-navy-100 text-sm font-bold text-navy-700">
        {review.user?.avatar_url ? (
          <img src={review.user.avatar_url} alt="" className="size-full object-cover" />
        ) : (
          displayName(review).charAt(0).toUpperCase()
        )}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-[13px] font-bold text-navy-900">
          {displayName(review)}
        </span>
        {review.product && (
          <Link
            to={`/products/${review.product.slug}`}
            className="block truncate text-[11px] text-muted-foreground transition-colors hover:text-navy-600"
          >
            {review.product.name}
          </Link>
        )}
      </span>
    </figcaption>
  </figure>
);

/** Đánh giá thật từ bảng reviews (đã kiểm duyệt, ≥4 sao) — ẩn hẳn khi DB chưa có. */
const Testimonials = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    reviewApi
      .getFeatured(3)
      .then((data) => alive && setReviews(Array.isArray(data) ? data : []))
      .catch(() => alive && setReviews([]))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  if (loading) {
    return (
      <section>
        <div className="mb-5 h-[52px]" />
        <div className="grid gap-3 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-44 animate-pulse rounded-xl border border-border bg-card"
            />
          ))}
        </div>
      </section>
    );
  }

  if (reviews.length === 0) return null;

  return (
    <section>
      <SectionHead
        eyebrow="Đánh giá"
        title="Người mua nói gì"
        to="/products"
        label="Xem sản phẩm"
      />
      <div className="grid gap-3 md:grid-cols-3">
        {reviews.map((review) => (
          <TestimonialCard key={review.id} review={review} />
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
