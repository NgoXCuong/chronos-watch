import React, { useEffect, useState } from 'react';
import { MessageSquare } from 'lucide-react';
import reviewApi from '../../../api/review.api';
import Stars from './Stars';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';

const countByStar = (reviews) => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((review) => {
        const star = Math.min(5, Math.max(1, Math.round(Number(review.rating) || 0)));
        counts[star] += 1;
    });
    return counts;
};

const Summary = ({ average, total, counts, loaded }) => (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
        <div className="flex flex-col items-center gap-1 border-b border-border pb-4 text-center">
            <p className="text-4xl font-bold tabular-nums text-navy-700">{average.toFixed(1)}</p>
            <Stars rating={average} size={16} />
            <p className="mt-1 text-xs tabular-nums text-muted-foreground">{total} đánh giá</p>
        </div>

        <div className="space-y-2 pt-4">
            {[5, 4, 3, 2, 1].map((star) => {
                const count = counts[star];
                const percent = loaded ? (count / Math.max(total, 1)) * 100 : 0;
                return (
                    <div key={star} className="flex items-center gap-3">
                        <span className="w-8 shrink-0 text-[11px] tabular-nums text-muted-foreground">{star} sao</span>
                        <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-navy-50">
                            <span className="block h-full rounded-full bg-navy-600 transition-all duration-500" style={{ width: `${percent}%` }} />
                        </span>
                        <span className="w-6 shrink-0 text-right text-[11px] tabular-nums text-foreground/70">{count}</span>
                    </div>
                );
            })}
        </div>
    </div>
);

/**
 * Tab đánh giá: cột trái là điểm trung bình + phân bố sao THẬT và form gửi đánh giá,
 * cột phải là danh sách lời bình — mọi số liệu đếm từ danh sách backend trả về.
 */
const ProductReviews = ({ productId }) => {
    const [reviews, setReviews] = useState([]);
    const [stats, setStats] = useState({ average_rating: 0, review_count: 0 });
    const [loadedFor, setLoadedFor] = useState(null);
    const [reload, setReload] = useState(0);

    useEffect(() => {
        if (!productId) return undefined;
        let alive = true;

        reviewApi
            .getByProduct(productId)
            .then((data) => {
                if (!alive) return;
                setReviews(data.reviews || []);
                setStats({ average_rating: data.average_rating || 0, review_count: data.review_count || 0 });
            })
            .catch((error) => console.error('Lỗi lấy đánh giá:', error))
            .finally(() => alive && setLoadedFor(productId));

        return () => {
            alive = false;
        };
    }, [productId, reload]);

    // Gửi đánh giá xong chỉ nạp lại ngầm, không làm mất danh sách đang xem.
    if (loadedFor !== productId) {
        return (
            <div className="grid grid-cols-1 gap-6 py-6 lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)]">
                <div className="h-56 animate-pulse rounded-xl bg-navy-50" />
                <div className="space-y-3">
                    {[0, 1, 2].map((i) => (
                        <div key={i} className="h-24 animate-pulse rounded-xl bg-navy-50" />
                    ))}
                </div>
            </div>
        );
    }

    const average = Number(stats.average_rating) || 0;
    const total = stats.review_count || reviews.length;
    const counts = countByStar(reviews);

    return (
        <div className="grid grid-cols-1 items-start gap-6 py-6 lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)] lg:gap-8 2xl:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
            <div className="space-y-4">
                <Summary average={average} total={total} counts={counts} loaded={reviews.length > 0} />
                <ReviewForm productId={productId} onSubmitted={() => setReload((n) => n + 1)} />
            </div>

            <div>
                <div className="mb-3 flex items-center gap-2 border-b border-border pb-2">
                    <MessageSquare size={14} strokeWidth={2} className="text-navy-600" aria-hidden="true" />
                    <h3 className="text-[13px] font-bold uppercase tracking-[0.02em] text-navy-700">Đánh giá từ người dùng</h3>
                    <span className="ml-auto text-xs tabular-nums text-muted-foreground">{total}</span>
                </div>
                <ReviewList reviews={reviews} />
            </div>
        </div>
    );
};

export default ProductReviews;
