import React from 'react';
import {
    Star,
    MessageSquare,
    CheckCircle,
    XCircle,
    Box,
    Send,
    User,
    Calendar,
    ChevronRight,
    MessageCircle
} from 'lucide-react';
import { Button } from '../../ui/button';

const ReviewList = ({
    reviews,
    loading,
    onToggleStatus,
    onReply
}) => {
    if (loading) {
        return (
            <div className="py-20 text-center">
                <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
        );
    }

    if (!reviews.length) {
        return (
            <div className="py-20 text-center bg-white rounded-3xl border border-slate-100 shadow-sm">
                <Star className="h-16 w-16 text-slate-100 mx-auto mb-4" />
                <p className="text-slate-400 font-medium font-roboto uppercase text-[10px] font-black">Chưa có đánh giá nào</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {reviews.map((review) => (
                <div
                    key={review.id}
                    className={`bg-white border-l-4 ${review.is_active ? 'border-l-amber-400' : 'border-l-slate-300 opacity-60 grayscale-[0.4]'} border-y border-r border-slate-100 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:translate-x-1 group`}
                >
                    <div className="p-4 lg:p-5 font-roboto">
                        <div className="flex flex-col lg:flex-row items-center gap-6">

                            {/* 1. PRODUCT THUMBNAIL (Left) */}
                            <div className="shrink-0">
                                <div className="h-20 w-20 rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 flex items-center justify-center p-2 group-hover:bg-white transition-colors">
                                    <img
                                        src={review.product?.image_url}
                                        alt={review.product?.name}
                                        className="h-full w-full object-contain group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                            </div>

                            {/* 2. USER & COMMENT (Main Center) */}
                            <div className="flex-1 min-w-0 pr-4 border-r border-slate-50">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="h-5 w-5 rounded-full bg-slate-100 flex items-center justify-center text-[12px] text-slate-500 font-black border border-slate-200">
                                        {review.user?.username?.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-[11px] font-black text-slate-800 uppercase truncate">
                                        {review.user?.username}
                                    </span>
                                </div>
                                <div className="relative pl-3 border-l-[3px] border-amber-200/50 py-0.5">
                                    <p className="text-sm text-slate-600 font-medium leading-relaxed italic line-clamp-2">
                                        "{review.comment}"
                                    </p>
                                </div>

                                {review.admin_reply && (
                                    <div className="mt-2.5 flex items-start gap-2 bg-amber-50/20 p-2 rounded-lg border border-amber-100/30">
                                        <MessageCircle size={10} className="mt-0.5 text-amber-500 shrink-0" />
                                        <p className="text-[11px] font-bold text-slate-700 line-clamp-1 italic">
                                            <span className="text-amber-600 mr-1.5 font-black uppercase text-[10px]">Admin:</span>
                                            {review.admin_reply}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* 3. PRODUCT & METRICS (Center-Right) - TO BALANCE THE EMPTY SPACE */}
                            <div className="w-full lg:w-48 xl:w-64 space-y-2.5 hidden lg:block pr-6">
                                <div className="flex items-center gap-1.5 text-slate-400">
                                    <Box size={10} className="text-amber-400/60" />
                                    <span className="text-[12px] font-black text-slate-500 uppercase truncate">
                                        {review.product?.name}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={11} className={i < review.rating ? "fill-amber-500 text-amber-500" : "text-slate-200"} />
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-slate-400 font-bold">
                                        <Calendar size={10} />
                                        <span className="text-[12px] uppercase">{new Date(review.created_at).toLocaleDateString('vi-VN')}</span>
                                    </div>
                                </div>

                                {!review.is_active && (
                                    <div className="flex items-center gap-1.5 text-rose-500/60 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full w-fit">
                                        <XCircle size={8} />
                                        <span className="text-[10px] font-black uppercase">Đã ẩn bình luận</span>
                                    </div>
                                )}
                            </div>

                            {/* 4. ACTIONS (Right Side) */}
                            <div className="shrink-0 flex items-center gap-2.5 pl-4 border-l border-slate-100 w-full lg:w-auto">
                                <Button
                                    variant={review.admin_reply ? "outline" : "default"}
                                    onClick={() => onReply(review)}
                                    className={`flex-1 lg:w-28 h-9 rounded-xl gap-2 text-[10px] font-black uppercase transition-all duration-300 hover:scale-105 active:scale-95 ${review.admin_reply
                                        ? "border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-amber-600 hover:border-amber-200"
                                        : "bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-600/10"
                                        }`}
                                >
                                    <Send size={12} /> {review.admin_reply ? "Sửa" : "Trả lời"}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => onToggleStatus(review)}
                                    className={`flex-2 lg:w-24 h-9 rounded-xl gap-2 text-[10px] font-black uppercase transition-all duration-300 hover:scale-105 active:scale-95 border-slate-200 ${review.is_active
                                        ? "text-rose-500 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200"
                                        : "text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200"
                                        }`}
                                >
                                    {review.is_active ? <XCircle size={12} /> : <CheckCircle size={12} />}
                                    {review.is_active ? "Ẩn" : "Hiện"}
                                </Button>
                            </div>

                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ReviewList;
