import { CalendarDays, Inbox, ShieldCheck } from 'lucide-react';
import Stars from './Stars';

const displayName = (user) => user?.full_name || user?.username || 'Thành viên Chronos';

const ReviewCard = ({ review }) => {
    const name = displayName(review.user);

    return (
        <li className="rounded-xl border border-border bg-card p-4 shadow-card">
            <div className="flex gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-navy-50 text-[13px] font-bold text-navy-600 ring-1 ring-border">
                    {review.user?.avatar_url ? (
                        <img src={review.user.avatar_url} alt="" className="size-full object-cover" />
                    ) : (
                        name.charAt(0).toUpperCase()
                    )}
                </span>

                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                        <p className="truncate text-[13px] font-semibold text-foreground">{name}</p>
                        <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                            <CalendarDays size={12} strokeWidth={2} aria-hidden="true" />
                            {new Date(review.created_at).toLocaleDateString('vi-VN')}
                        </span>
                    </div>

                    <Stars rating={review.rating} className="mt-1.5" />

                    {review.comment && (
                        <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{review.comment}</p>
                    )}

                    {review.admin_reply && (
                        <div className="mt-3 rounded-lg border-l-2 border-navy-600 bg-navy-50/70 px-3.5 py-2.5">
                            <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.02em] text-navy-700">
                                <ShieldCheck size={12} strokeWidth={2} aria-hidden="true" />
                                Phản hồi từ Chronos
                            </p>
                            <p className="mt-1.5 text-[13px] leading-relaxed text-navy-700/90">{review.admin_reply}</p>
                        </div>
                    )}
                </div>
            </div>
        </li>
    );
};

const ReviewList = ({ reviews }) => {
    if (reviews.length === 0) {
        return (
            <div className="rounded-xl border border-dashed border-border px-4 py-10 text-center">
                <span className="mx-auto mb-3 flex size-10 items-center justify-center rounded-full bg-navy-50 text-navy-500">
                    <Inbox size={18} strokeWidth={2} aria-hidden="true" />
                </span>
                <p className="text-sm font-semibold text-foreground">Chưa có đánh giá nào</p>
                <p className="mt-1 text-xs text-muted-foreground">
                    Đánh giá chỉ hiển thị sau khi khách đã nhận hàng — hãy là người đầu tiên.
                </p>
            </div>
        );
    }

    return (
        <ul className="grid gap-4 sm:grid-cols-2">
            {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
            ))}
        </ul>
    );
};

export default ReviewList;
