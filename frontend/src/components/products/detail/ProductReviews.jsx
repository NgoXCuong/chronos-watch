import React, { useState, useEffect } from 'react';
import { 
    Star, 
    MessageSquare, 
    User, 
    Send, 
    ShieldCheck, 
    Clock, 
    ThumbsUp,
    AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../../hooks/useAuth';
import reviewApi from '../../../api/review.api';
import { Button } from '../../ui/button';
import { cn } from '../../../lib/utils';

const ProductReviews = ({ productId, isDark }) => {
    const { isAuthenticated, user } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [hoveredStar, setHoveredStar] = useState(0);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const data = await reviewApi.getByProduct(productId);
            setReviews(Array.isArray(data) ? data : data.data || []);
        } catch (error) {
            console.error('Lỗi lấy đánh giá:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (productId) fetchReviews();
    }, [productId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return toast.error('Vui lòng nhập nội dung đánh giá');
        
        setSubmitting(true);
        try {
            await reviewApi.create({
                product_id: productId,
                rating,
                comment
            });
            toast.success('Cảm ơn bạn đã gửi đánh giá!');
            setComment('');
            setRating(5);
            fetchReviews();
        } catch (error) {
            toast.error(error.message || 'Không thể gửi đánh giá lúc này');
        } finally {
            setSubmitting(false);
        }
    };

    const averageRating = reviews.length > 0 
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : 0;

    const renderStars = (count, size = 16, interactive = false) => {
        return (
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                        key={s}
                        size={size}
                        className={cn(
                            "transition-all duration-300",
                            s <= (interactive ? (hoveredStar || rating) : count)
                                ? "fill-amber-500 text-amber-500"
                                : "text-zinc-300 dark:text-zinc-700",
                            interactive && "cursor-pointer hover:scale-125"
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
            <div className="py-12 flex flex-col items-center justify-center space-y-4">
                <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-[10px] uppercase font-black text-zinc-400 tracking-widest">Đang tải cảm nhận khách hàng...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-16 animate-in fade-in duration-700">
            
            {/* OVERVIEW & STATS */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="text-center md:text-left space-y-4">
                    <div className="flex items-center justify-center md:justify-start gap-4">
                        <span className="text-6xl font-serif font-medium text-zinc-900 dark:text-white">{averageRating}</span>
                        <div>
                            {renderStars(Math.round(averageRating), 20)}
                            <p className="text-[10px] font-black uppercase text-zinc-400 mt-1 tracking-widest">
                                Dựa trên {reviews.length} đánh giá
                            </p>
                        </div>
                    </div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 font-light leading-relaxed max-w-sm">
                        Những trải nghiệm thực tế từ cộng đồng sở hữu đồng hồ Chronos trên toàn thế giới.
                    </p>
                </div>

                {/* Star Progress Bars (Simplified) */}
                <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map(s => {
                        const count = reviews.filter(r => r.rating === s).length;
                        const percent = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                        return (
                            <div key={s} className="flex items-center gap-4 text-[10px] font-black uppercase text-zinc-400">
                                <span className="w-4">{s}★</span>
                                <div className="flex-1 h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-amber-500 transition-all duration-1000" 
                                        style={{ width: `${percent}%` }}
                                    ></div>
                                </div>
                                <span className="w-8 text-right">{count}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* REVIEW FORM */}
            {isAuthenticated ? (
                <div className="bg-white dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 p-8 md:p-10 rounded-[2.5rem] space-y-8 shadow-sm">
                    <div className="space-y-2">
                        <h3 className="text-[11px] font-black uppercase text-amber-500 tracking-[0.2em]">Chia sẻ trải nghiệm</h3>
                        <p className={`text-lg font-serif italic ${isDark ? 'text-zinc-300' : 'text-zinc-800'}`}>Bạn cảm nhận thế nào về tuyệt phẩm này?</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase text-zinc-400">Chất lượng di sản</label>
                            {renderStars(rating, 24, true)}
                        </div>
                        
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase text-zinc-400">Cảm nhận chi tiết</label>
                            <textarea 
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Hãy cho chúng tôi biết cảm nhận của bạn về độ hoàn thiện, sự chính xác..."
                                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-6 text-sm outline-none focus:ring-2 focus:ring-amber-500/20 transition-all min-h-[120px] dark:text-white"
                            />
                        </div>

                        <Button 
                            disabled={submitting}
                            className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 hover:bg-amber-600 dark:hover:bg-amber-500 hover:text-white px-10 h-14 rounded-2xl flex items-center gap-3 transition-all group"
                        >
                            <span>{submitting ? 'Đang lưu giữ...' : 'Gửi Nhận Xét'}</span>
                            <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </Button>
                    </form>
                </div>
            ) : (
                <div className="text-center py-12 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-[2.5rem]">
                    <AlertCircle size={32} className="mx-auto mb-4 text-zinc-300" />
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 font-light">
                        Vui lòng <Link to="/login" className="text-amber-500 font-bold hover:underline">Đăng nhập</Link> để để lại cảm nhận của bạn.
                    </p>
                </div>
            )}

            {/* REVIEWS LIST */}
            <div className="space-y-10">
                <div className="flex items-center gap-4">
                    <h3 className="text-[11px] font-black uppercase text-zinc-400 tracking-[0.2em]">Cảm nhận tiêu biểu</h3>
                    <div className="h-px flex-1 bg-zinc-100 dark:bg-zinc-800"></div>
                </div>

                {reviews.length === 0 ? (
                    <div className="text-center py-20 bg-zinc-50/50 dark:bg-zinc-900/20 rounded-[3rem] border border-zinc-100 dark:border-zinc-800">
                        <MessageSquare size={48} className="mx-auto mb-6 text-zinc-200" />
                        <p className="text-zinc-400 font-serif italic">Tuyệt phẩm này chưa có lời bình luận nào. Hãy là người đầu tiên!</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {reviews.map((rev) => (
                            <div key={rev.id} className="space-y-6">
                                <div className="flex items-start gap-6">
                                    <div className="h-14 w-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 border border-zinc-100 dark:border-zinc-800 text-zinc-400 overflow-hidden">
                                        {rev.user?.avatar ? (
                                            <img src={rev.user.avatar} alt={rev.user.username} className="w-full h-full object-cover" />
                                        ) : (
                                            <User size={24} />
                                        )}
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-tight">
                                                    {rev.user?.full_name || rev.user?.username}
                                                </p>
                                                {renderStars(rev.rating, 12)}
                                            </div>
                                            <span className="text-[9px] font-black uppercase text-zinc-400 flex items-center gap-2">
                                                <Clock size={10} /> {new Date(rev.created_at).toLocaleDateString('vi-VN')}
                                            </span>
                                        </div>
                                        <p className="text-[14px] text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">
                                            {rev.comment}
                                        </p>
                                    </div>
                                </div>

                                {/* ADMIN REPLY */}
                                {rev.admin_reply && (
                                    <div className="ml-20 bg-zinc-50 dark:bg-zinc-900/30 border-l-2 border-amber-500 p-8 rounded-tr-3xl rounded-br-3xl space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-1.5 bg-amber-500/10 text-amber-500 rounded-lg">
                                                <ShieldCheck size={14} />
                                            </div>
                                            <span className="text-[10px] font-black uppercase text-amber-500 tracking-widest">Chronos Concierge</span>
                                        </div>
                                        <p className="text-[13px] text-zinc-600 dark:text-zinc-400 font-light italic leading-relaxed">
                                            "{rev.admin_reply}"
                                        </p>
                                    </div>
                                )}
                                <div className="h-px bg-zinc-100 dark:bg-zinc-800/50 w-full"></div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductReviews;
