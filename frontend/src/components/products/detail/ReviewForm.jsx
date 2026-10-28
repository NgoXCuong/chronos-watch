import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Send, Star } from 'lucide-react';
import { toast } from 'sonner';
import reviewApi from '../../../api/review.api';
import { Button } from '../../ui/button';
import { Textarea } from '../../ui/textarea';
import { useAuth } from '../../../hooks/useAuth';
import { cn } from '../../../lib/utils';

const Picker = ({ rating, setRating }) => {
    const [hovered, setHovered] = useState(0);
    const shown = hovered || rating;

    return (
        <div className="flex items-center gap-1" onMouseLeave={() => setHovered(0)}>
            {[1, 2, 3, 4, 5].map((s) => (
                <button
                    key={s}
                    type="button"
                    onClick={() => setRating(s)}
                    onMouseEnter={() => setHovered(s)}
                    aria-label={`${s} sao`}
                    className="rounded p-0.5 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:shadow-[0_0_0_3px_rgba(15,42,74,.18)]"
                >
                    <Star size={20} strokeWidth={1.5} className={cn(s <= shown ? 'fill-amber-400 text-amber-400' : 'text-navy-200')} aria-hidden="true" />
                </button>
            ))}
        </div>
    );
};

/** Form đánh giá 1 sao→5 sao + bình luận. Only đăng nhập mới gửi được (backend đòi JWT). */
const ReviewForm = ({ productId, onSubmitted }) => {
    const { isAuthenticated } = useAuth();
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    if (!isAuthenticated) {
        return (
            <div className="rounded-xl border border-dashed border-border bg-navy-50/60 px-4 py-8 text-center">
                <span className="mx-auto mb-3 flex size-10 items-center justify-center rounded-full bg-card text-navy-500 shadow-card">
                    <Lock size={17} strokeWidth={2} aria-hidden="true" />
                </span>
                <p className="text-[13px] text-muted-foreground">
                    <Link to="/login" className="font-semibold text-navy-600 underline-offset-2 hover:underline">
                        Đăng nhập
                    </Link>{' '}
                    để đánh giá sản phẩm này.
                </p>
            </div>
        );
    }

    const submit = async (event) => {
        event.preventDefault();
        if (!comment.trim()) return toast.error('Vui lòng nhập nội dung đánh giá');
        setSubmitting(true);
        try {
            await reviewApi.create({ product_id: productId, rating, comment });
            toast.success('Cảm ơn bạn đã gửi đánh giá!');
            setComment('');
            setRating(5);
            onSubmitted();
        } catch (error) {
            toast.error(error.message || 'Không thể gửi đánh giá lúc này');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={submit} className="rounded-xl border border-border bg-card p-4 shadow-card md:p-5">
            <h3 className="text-[13px] font-bold uppercase tracking-[0.02em] text-navy-700">Đánh giá của bạn</h3>
            <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-3">
                <Picker rating={rating} setRating={setRating} />
                <span className="text-xs text-muted-foreground">{rating}/5 — chấm theo trải nghiệm thực khi đeo.</span>
            </div>
            <Textarea
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                rows={3}
                maxLength={1000}
                placeholder="Cảm nhận về chất lượng hoàn thiện, độ chính xác, dịch vụ bán hàng..."
                className="mt-3 text-sm"
            />
            <div className="mt-3 flex items-center justify-between gap-3">
                <p className="text-[11px] text-muted-foreground">Đánh giá sẽ hiển thị công khai kèm tên tài khoản của bạn.</p>
                <Button type="submit" disabled={submitting} size="sm" className="h-9 shrink-0 gap-1.5">
                    <Send size={14} strokeWidth={2} aria-hidden="true" />
                    {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
                </Button>
            </div>
        </form>
    );
};

export default ReviewForm;
