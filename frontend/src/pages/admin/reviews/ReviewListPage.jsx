import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import adminApi from "../../../api/admin.api";
import useDebounce from "../../../hooks/useDebounce";
import AdminHeader from "../../../components/admin/Common/AdminHeader";
import SearchBanner from "../../../components/admin/Common/SearchBanner";
import FilterSelect from "../../../components/admin/Common/FilterSelect";
import AdminPagination from "../../../components/admin/Common/AdminPagination";
import ReviewList from "../../../components/admin/Review/ReviewList";
import ReviewStatsBar from "../../../components/admin/Review/ReviewStatsBar";
import {
  REVIEW_RATING_FILTER_OPTIONS,
  REVIEW_REPLY_FILTER_OPTIONS,
  REVIEW_SORT_OPTIONS,
  REVIEW_VISIBILITY_FILTER_OPTIONS,
} from "../../../constants/reviewFilter";

const PAGE_SIZE = 10;
const DEFAULT_SORT = "created_at:desc";

const ReviewListPage = () => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibility, setVisibility] = useState("");
  const [rating, setRating] = useState("");
  const [replied, setReplied] = useState("");
  const [sortValue, setSortValue] = useState(DEFAULT_SORT);
  const [currentPage, setCurrentPage] = useState(1);
  const [savingReplyId, setSavingReplyId] = useState(null);
  const debouncedSearch = useDebounce(searchTerm, 400);
  const isFirstQuery = useRef(true);

  const hasFilters =
    Boolean(debouncedSearch) ||
    Boolean(visibility) ||
    Boolean(rating) ||
    Boolean(replied);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    const [key, dir] = sortValue.split(":");
    try {
      const data = await adminApi.getAllReviews({
        search: debouncedSearch,
        is_active: visibility,
        rating,
        replied,
        page: currentPage,
        limit: PAGE_SIZE,
        sort: key,
        dir,
      });
      setReviews(data.rows || []);
      setCount(data.count || 0);
    } catch {
      toast.error("Không thể tải danh sách đánh giá");
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearch, visibility, rating, replied, sortValue]);

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      setStats(await adminApi.getReviewStats());
    } catch {
      toast.error("Không thể tải số liệu đánh giá");
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    if (isFirstQuery.current) {
      isFirstQuery.current = false;
      return;
    }
    setCurrentPage(1);
  }, [debouncedSearch, visibility, rating, replied, sortValue]);

  // Ẩn/hiện và phản hồi làm đổi cả danh sách lẫn thanh số liệu (đếm chờ phản hồi,
  // sao trung bình khi ẩn) nên refetch cả hai
  const reload = () => {
    fetchReviews();
    fetchStats();
  };

  const handleToggleVisible = async (review) => {
    try {
      await adminApi.updateReviewStatus(review.id, review.is_active === false);
      toast.success(review.is_active === false ? "Đã hiện lại đánh giá" : "Đã ẩn đánh giá khỏi trang sản phẩm");
      reload();
    } catch (err) {
      toast.error(err?.message || "Lỗi cập nhật trạng thái đánh giá");
    }
  };

  const handleReply = async (review, reply) => {
    setSavingReplyId(review.id);
    try {
      await adminApi.replyToReview(review.id, reply);
      toast.success("Đã gửi phản hồi");
      reload();
      return true;
    } catch (err) {
      toast.error(err?.message || "Lỗi gửi phản hồi");
      return false;
    } finally {
      setSavingReplyId(null);
    }
  };

  const handleDelete = async (review) => {
    const who = review.user?.username || "khách";
    if (!window.confirm(`Xóa hẳn đánh giá của ${who}? Bình luận mất vĩnh viễn, sao trung bình của sản phẩm sẽ tính lại.`))
      return;
    try {
      await adminApi.deleteReview(review.id);
      toast.success("Đã xóa đánh giá");
      // Xóa dòng cuối của trang thì lùi về trang trước để không thành trang trống
      if (reviews.length === 1 && currentPage > 1) setCurrentPage((page) => page - 1);
      else reload();
    } catch (err) {
      toast.error(err?.message || "Không xóa được đánh giá");
    }
  };

  const totalPages = Math.ceil(count / PAGE_SIZE);

  return (
    <div className="space-y-3 pb-8">
      <AdminHeader
        title="Quản lý đánh giá"
        subtitle="Đọc bình luận của khách, phản hồi ngay tại chỗ và kiểm duyệt sao hiển thị ở trang sản phẩm"
      />

      <ReviewStatsBar stats={stats} loading={statsLoading} />

      <SearchBanner
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        placeholder="Tìm theo bình luận, tên / email khách, tên sản phẩm..."
        onRefresh={reload}
        loading={loading}
        count={count}
        countLabel="đánh giá"
      >
        <FilterSelect
          label="Kiểm duyệt"
          value={visibility}
          onChange={setVisibility}
          options={REVIEW_VISIBILITY_FILTER_OPTIONS}
        />
        <FilterSelect
          label="Sao"
          value={rating}
          onChange={setRating}
          options={REVIEW_RATING_FILTER_OPTIONS}
        />
        <FilterSelect
          label="Phản hồi"
          value={replied}
          onChange={setReplied}
          options={REVIEW_REPLY_FILTER_OPTIONS}
        />
        <FilterSelect
          label="Sắp xếp"
          value={sortValue}
          onChange={setSortValue}
          options={REVIEW_SORT_OPTIONS}
        />
      </SearchBanner>

      <ReviewList
        reviews={reviews}
        loading={loading}
        hasFilters={hasFilters}
        savingReplyId={savingReplyId}
        onReply={handleReply}
        onToggleVisible={handleToggleVisible}
        onDelete={handleDelete}
      />

      {totalPages > 1 && (
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
          <AdminPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalCount={count}
            countLabel="đánh giá"
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}
    </div>
  );
};

export default ReviewListPage;
