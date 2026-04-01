import React, { useState, useEffect } from 'react';
import adminApi from '../../../api/admin.api';
import { toast } from 'sonner';

import AdminHeader from '../../../components/admin/Common/AdminHeader';
import SearchBanner from '../../../components/admin/Common/SearchBanner';
import ReviewList from '../../../components/admin/Review/ReviewList';
import ReviewReplyModal from '../../../components/admin/Review/ReviewReplyModal';

const ReviewListPage = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [submittingReply, setSubmittingReply] = useState(false);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const data = await adminApi.getAllReviews();
            setReviews(data);
        } catch (error) {
            toast.error("Không thể tải danh sách đánh giá");
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (review) => {
        try {
            await adminApi.updateReviewStatus(review.id, !review.is_active);
            toast.success(review.is_active ? "Đã ẩn đánh giá" : "Đã hiện đánh giá");
            fetchReviews();
        } catch (error) {
            toast.error("Lỗi cập nhật trạng thái");
        }
    };

    const handleReply = async () => {
        if (!replyText.trim()) return;
        setSubmittingReply(true);
        try {
            await adminApi.replyToReview(replyingTo.id, replyText);
            toast.success("Đã gửi phản hồi");
            setReplyingTo(null);
            setReplyText('');
            fetchReviews();
        } catch (error) {
            toast.error("Lỗi gửi phản hồi");
        } finally {
            setSubmittingReply(false);
        }
    };

    const filteredReviews = reviews.filter(r => 
        r.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.product?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openReplyModal = (review) => {
        setReplyingTo(review);
        setReplyText(review.admin_reply || '');
    };

    return (
        <div className="space-y-6 pb-20 font-roboto">
            <AdminHeader 
                title="Quản lý Đánh giá"
                subtitle="Phản hồi và kiểm duyệt ý kiến khách hàng Luxury"
            />

            <SearchBanner 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                placeholder="Tìm theo bình luận, tên khách, sản phẩm..."
                onRefresh={fetchReviews}
                loading={loading}
                count={filteredReviews.length}
                countLabel="đánh giá"
            >
                <div className="hidden md:flex bg-amber-50 text-amber-600 px-4 py-2 rounded-xl text-[10px] font-bold border border-amber-100 italic uppercase tracking-widest shadow-sm">
                    Lắng nghe khách hàng luxury
                </div>
            </SearchBanner>

            <ReviewList 
                reviews={filteredReviews}
                loading={loading}
                onToggleStatus={handleToggleStatus}
                onReply={openReplyModal}
            />

            <ReviewReplyModal 
                replyingTo={replyingTo}
                onClose={() => setReplyingTo(null)}
                replyText={replyText}
                setReplyText={setReplyText}
                submittingReply={submittingReply}
                handleReply={handleReply}
            />
        </div>
    );
};

export default ReviewListPage;

