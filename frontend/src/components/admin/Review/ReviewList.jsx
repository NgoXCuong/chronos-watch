import React from 'react';
import {
    Star,
    MessageSquare,
    CheckCircle,
    XCircle,
    Box,
    Send
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
            <div className="py-20 text-center bg-white rounded-md border border-slate-100 shadow-sm">
                <Star className="h-16 w-16 text-slate-100 mx-auto mb-4" />
                <p className="text-slate-400 font-medium">Chưa có đánh giá nào được tìm thấy</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6">
            {reviews.map((review) => (
                <div key={review.id} className={`bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden transition-all hover:shadow-md ${!review.is_active ? 'opacity-60 grayscale-[0.5]' : ''}`}>
                    <div className="p-8">
                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* Product Info */}
                            <div className="w-full lg:w-64 space-y-4">
                                <div className="group relative h-40 rounded-3xl overflow-hidden border border-slate-100 bg-slate-50 shadow-inner">
                                    <img src={review.product?.image_url} alt={review.product?.name} className="h-full w-full object-contain p-4 group-hover:scale-110 transition-transform duration-500" />
                                    {!review.is_active && (
                                        <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
                                            <span className="text-[10px] font-bold text-white uppercase tracking-widest border border-white/30 px-3 py-1 rounded-full">Đã ẩn</span>
                                        </div>
                                    )}
                                </div>
                                <div className="px-1">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Box size={10} /> Sản phẩm</p>
                                    <p className="text-sm font-bold text-slate-900 mt-1 line-clamp-2 leading-snug uppercase tracking-tighter">{review.product?.name}</p>
                                </div>
                            </div>

                            {/* Review Content */}
                            <div className="flex-1 space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-11 w-11 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 font-bold border border-amber-100 shadow-sm">
                                            {review.user?.username?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 leading-none uppercase tracking-tight">{review.user?.username}</p>
                                            <p className="text-[10px] text-slate-400 mt-1.5 font-bold uppercase tracking-widest">{new Date(review.created_at).toLocaleString('vi-VN')}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-0.5 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100 shadow-sm shadow-amber-600/5">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={14} className={i < review.rating ? "fill-amber-500 text-amber-500" : "text-slate-200"} />
                                        ))}
                                        <span className="ml-2 text-xs font-bold text-amber-700">{review.rating}.0</span>
                                    </div>
                                </div>

                                <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-50 relative">
                                    <MessageSquare className="absolute -top-3 -left-3 text-amber-100/50" size={32} />
                                    <p className="text-slate-700 text-sm font-medium leading-relaxed italic">"{review.comment}"</p>
                                </div>

                                {/* Admin Reply */}
                                {review.admin_reply && (
                                    <div className="ml-8 p-6 bg-amber-50/30 rounded-3xl border-l-[3px] border-amber-500 space-y-2.5 relative shadow-sm">
                                        <div className="flex items-center justify-between">
                                            <p className="text-[9px] font-bold text-amber-600 uppercase tracking-widest flex items-center gap-2">Phản hồi từ Admin <CheckCircle size={10} /></p>
                                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{new Date(review.replied_at).toLocaleString('vi-VN')}</p>
                                        </div>
                                        <p className="text-slate-800 text-sm font-bold leading-relaxed">{review.admin_reply}</p>
                                    </div>
                                )}

                                <div className="flex flex-wrap items-center gap-3 pt-5 border-t border-slate-50">
                                    <Button
                                        variant={review.admin_reply ? "outline" : "default"}
                                        onClick={() => onReply(review)}
                                        className={`rounded-xl h-10 px-6 gap-2 text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95 ${review.admin_reply
                                            ? "border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                                            : "bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-600/20"
                                            }`}
                                    >
                                        <Send size={14} /> {review.admin_reply ? "Sửa phản hồi" : "Phản hồi khách"}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => onToggleStatus(review)}
                                        className={`rounded-xl h-10 px-6 gap-2 text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95 ${review.is_active
                                            ? "text-rose-600 border-rose-100 hover:bg-rose-50 hover:text-rose-700"
                                            : "text-emerald-600 border-emerald-100 hover:bg-emerald-50 hover:text-emerald-700"
                                            }`}
                                    >
                                        {review.is_active ? <XCircle size={14} /> : <CheckCircle size={14} />}
                                        {review.is_active ? "Ẩn bình luận" : "Công khai lại"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ReviewList;
