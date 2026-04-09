import React, { useState, useEffect } from "react";
import {
  Star,
  MessageSquare,
  User,
  Send,
  ShieldCheck,
  Clock,
  ThumbsUp,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  Quote,
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import reviewApi from "../../../api/review.api";
import { Button } from "../../ui/button";
import { cn } from "../../../lib/utils";

const ProductReviews = ({ productId, isDark }) => {
  const { isAuthenticated, user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ average_rating: 0, review_count: 0 });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [hoveredStar, setHoveredStar] = useState(0);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const data = await reviewApi.getByProduct(productId);
      setReviews(data.reviews || []);
      setStats({
        average_rating: data.average_rating || 0,
        review_count: data.review_count || 0,
      });
    } catch (error) {
      console.error("Lỗi lấy đánh giá:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) fetchReviews();
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return toast.error("Vui lòng nhập nội dung đánh giá");

    setSubmitting(true);
    try {
      await reviewApi.create({
        product_id: productId,
        rating,
        comment,
      });
      toast.success("Cảm ơn bạn đã gửi đánh giá!");
      setComment("");
      setRating(5);
      fetchReviews();
    } catch (error) {
      toast.error(error.message || "Không thể gửi đánh giá lúc này");
    } finally {
      setSubmitting(false);
    }
  };

  const averageRating = stats.average_rating || 0;
  const totalReviews = stats.review_count || 0;

  const renderStars = (count, size = 14, interactive = false) => {
    return (
      <div className="flex items-center gap-1.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            size={size}
            className={cn(
              "transition-all duration-300",
              s <= (interactive ? hoveredStar || rating : count)
                ? "fill-amber-500 text-amber-500"
                : "text-zinc-300 dark:text-zinc-800",
              interactive && "cursor-pointer hover:scale-125",
            )}
            onClick={() => interactive && setRating(s)}
            onMouseEnter={() => interactive && setHoveredStar(s)}
            onMouseLeave={() => interactive && setHoveredStar(0)}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <div className="flex gap-1 animate-pulse">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 delay-75"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 delay-150"></div>
        </div>
        <p className="text-[10px] uppercase font-black  text-zinc-500">
          Đang lắng nghe cảm nhận...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-1000 slide-in-from-bottom-4">
      {/* --- OVERVIEW SECTION --- */}
      <div
        className={`grid md:grid-cols-12 gap-8 items-center p-8 md:p-10 border ${isDark ? "border-white/5 bg-zinc-900/20 shadow-inner" : "border-zinc-100 bg-zinc-50/30"}`}
      >
        <div className="md:col-span-4 text-center md:text-left space-y-4">
          <h3
            className={`text-[13px] uppercase font-black  ${isDark ? "text-zinc-500" : "text-zinc-400"}`}
          >
            Tuyệt Phẩm Di Sản
          </h3>
          <div className="flex items-center justify-center md:justify-start gap-5">
            <span
              className={`text-6xl font-black ${isDark ? "text-white" : "text-zinc-900"}`}
            >
              {averageRating}
            </span>
            <div className="space-y-1.5">
              {renderStars(Math.round(averageRating), 18)}
              <p className="text-[10px] font-black uppercase text-amber-500 ">
                {totalReviews} Lượt Thẩm Định
              </p>
            </div>
          </div>
        </div>

        <div className="md:col-span-8 flex flex-col gap-2.5">
          {[5, 4, 3, 2, 1].map((s) => {
            const count = reviews.filter((r) => r.rating === s).length;
            const percent =
              reviews.length > 0 ? (count / reviews.length) * 100 : 0;
            return (
              <div key={s} className="flex items-center gap-4 group">
                <span className="w-6 text-[10px] font-black text-zinc-500 uppercase">
                  {s}★
                </span>
                <div className="flex-1 h-0.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 transition-all duration-1000 ease-out"
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
                <span
                  className={`w-8 text-right text-[10px] font-black transition-colors ${percent > 0 ? "text-zinc-800 dark:text-zinc-200" : "text-zinc-400"}`}
                >
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- COMPACT REVIEW FORM --- */}
      <div className="relative">
        {isAuthenticated ? (
          <div
            className={`p-4 border transition-all duration-700 relative overflow-hidden group 
                        ${isDark ? "border-white/5 bg-zinc-900/60 hover:bg-zinc-900/80" : "border-zinc-100 bg-zinc-50/80 hover:bg-zinc-100/50"}`}
          >
            {/* Background subtle icon */}
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
              <Quote
                className={`w-20 h-20 ${isDark ? "text-white" : "text-zinc-900"}`}
              />
            </div>

            <form
              onSubmit={handleSubmit}
              className="relative z-10 grid md:grid-cols-12 gap-10 items-start"
            >
              {/* Left Column: Heading & Stars (md:col-span-4) */}
              <div className="md:col-span-4 space-y-6">
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase text-amber-500 ">
                    Bút Pháp Của Bạn
                  </span>
                  <h2
                    className={`text-xl font-black ${isDark ? "text-white" : "text-zinc-900"} uppercase leading-[1.2]`}
                  >
                    Chia Sẻ Cảm Nhận
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <span className="text-[12px] font-black uppercase text-zinc-500  pl-1">
                      Chất lượng di sản
                    </span>
                    <div className="flex">{renderStars(rating, 24, true)}</div>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-medium">
                    <ShieldCheck size={12} className="text-emerald-500" />
                    <span>Verified Ownership Premium</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Textarea & Submit (md:col-span-8) */}
              <div className="md:col-span-8 flex flex-col gap-6 pt-1">
                <div className="relative group/field">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Để lại lời bình về độ tinh xảo, cảm giác đeo tuyệt mỹ..."
                    className={`w-full p-4 bg-transparent border-b border-zinc-500/20 focus:border-amber-500 transition-all duration-500 outline-none text-sm  leading-relaxed resize-none
                                            ${isDark ? "text-zinc-300 placeholder:text-zinc-700" : "text-zinc-800 placeholder:text-zinc-400"}`}
                  />
                  <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-amber-500 transition-all duration-700 group-focus-within/field:w-full" />
                </div>

                <div className="flex items-center justify-between gap-4">
                  <p
                    className={`text-[10px] font-bold italic ${isDark ? "text-zinc-600" : "text-zinc-400"}`}
                  >
                    * Lời bình của bạn sẽ được lưu giữ vĩnh viễn trong biên niên
                    sử Chronos.
                  </p>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className={`h-11 px-8 rounded-full uppercase text-[10px] font-black  gap-2.5 transition-all duration-500 shadow-lg active:scale-95 shrink-0
                                            ${isDark ? "bg-white text-zinc-950 hover:bg-amber-500 hover:text-white" : "bg-zinc-950 text-white hover:bg-amber-600 shadow-zinc-900/20"}`}
                  >
                    <span>
                      {submitting ? "Đang Lưu..." : "Lưu Dấu Cảm Nhận"}
                    </span>
                    <Send
                      size={12}
                      className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                    />
                  </Button>
                </div>
              </div>
            </form>
          </div>
        ) : (
          <div
            className={`p-12 border border-dashed text-center transition-all duration-700
                        ${isDark ? "border-white/10 hover:border-amber-500/20" : "border-zinc-200 hover:border-amber-600/20"}`}
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-500/5 mb-4">
              <User className="w-5 h-5 text-amber-500/50" />
            </div>
            <p
              className={`text-[11px] font-black uppercase  ${isDark ? "text-zinc-500" : "text-zinc-400"}`}
            >
              Mời bạn{" "}
              <Link to="/login" className="text-amber-500 hover:underline mx-1">
                Đăng nhập
              </Link>{" "}
              để chia sẻ cảm nhận di sản.
            </p>
          </div>
        )}
      </div>

      {/* --- REVIEWS LIST --- */}
      <div className="space-y-6 mb-16">
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-white/5 ">
          <h3
            className={`text-[13px] uppercase font-black ${isDark ? "text-white" : "text-zinc-900"}`}
          >
            Biên Niên Cảm Nhận
          </h3>
          <div className="flex items-center gap-2">
            <MessageSquare size={12} className="text-amber-500" />
            <span className="text-[10px] font-black text-zinc-500 uppercase ">
              {totalReviews} Bình Thẩm
            </span>
          </div>
        </div>

        {reviews.length === 0 ? (
          <div className="py-4 text-center group translate-y-4">
            <div className="relative inline-block mb-2">
              <Quote
                className={`w-12 h-12 opacity-10 ${isDark ? "text-white" : "text-zinc-900"}`}
              />
              <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-amber-500/30 animate-pulse" />
            </div>
            <p
              className={`text-[12px] font-medium italic ${isDark ? "text-zinc-600" : "text-zinc-400"}`}
            >
              Tác phẩm này đang đợi chờ lời tri âm đầu tiên...
            </p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100 dark:divide-white/5 border-t border-transparent">
            {reviews.map((rev) => (
              <div key={rev.id} className="py-2 group/rev transition-all">
                <div className="flex flex-col md:flex-row gap-8 md:gap-16">
                  {/* Author Profile Column */}
                  <div className="md:w-40 shrink-0 flex md:flex-col gap-4 md:gap-4 items-center md:items-start text-left">
                    <div
                      className={`h-14 w-14 rounded-2xl flex items-center justify-center border transition-all duration-500 group-hover/rev:border-amber-500/40 overflow-hidden
                                            ${isDark ? "bg-zinc-900/60 border-white/5" : "bg-white border-zinc-100 shadow-sm"}`}
                    >
                      {rev.user?.avatar ? (
                        <img
                          src={rev.user.avatar}
                          alt={rev.user.username}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-lg font-black text-amber-500/20 group-hover/rev:text-amber-500/40 transition-colors">
                          {rev.user?.username?.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="space-y-1.5 min-w-0">
                      <p
                        className={`text-[12px] font-black uppercase  truncate ${isDark ? "text-zinc-200" : "text-zinc-800"}`}
                      >
                        {rev.user?.full_name || rev.user?.username}
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="flex h-3.5 w-3.5 rounded-full bg-emerald-500/10 items-center justify-center">
                          <CheckCircle2 size={8} className="text-emerald-500" />
                        </div>
                        <span className="text-[12px] font-black uppercase text-emerald-600/80">
                          Đã hữu
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content Detail Column */}
                  <div className="flex-1 space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      {renderStars(rev.rating, 12)}
                      <div className="flex items-center gap-2 text-zinc-400">
                        <Clock size={10} />
                        <span className="text-[12px] font-black uppercase  opacity-60">
                          {new Date(rev.created_at).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                    </div>
                    <p
                      className={`text-[14px] leading-relaxed font-medium italic transition-colors duration-500 max-w-3xl
                                            ${isDark ? "text-zinc-400 group-hover/rev:text-zinc-200" : "text-zinc-600 group-hover/rev:text-zinc-900"}`}
                    >
                      "{rev.comment}"
                    </p>

                    {/* ADMIN CONCIERGE REPLY - Integrated row */}
                    {rev.admin_reply && (
                      <div
                        className={`mt-2p-6 border-l-2 border-amber-500 transition-colors duration-700
                                                ${isDark ? "bg-zinc-950/40" : "bg-zinc-50/40"}`}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-1.5 bg-amber-500/10 text-amber-500 rounded-lg">
                            <ShieldCheck size={12} />
                          </div>
                          <span className="text-[12px] font-black uppercase text-amber-500 ">
                            Chronos Concierge Support
                          </span>
                        </div>
                        <p
                          className={`text-[12px] font-bold italic leading-relaxed ${isDark ? "text-zinc-400" : "text-zinc-600"}`}
                        >
                          {rev.admin_reply}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductReviews;
