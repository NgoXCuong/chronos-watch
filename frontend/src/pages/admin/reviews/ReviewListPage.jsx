import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import adminApi from "../../../api/admin.api";
import useDebounce from "../../../hooks/useDebounce";
import AdminHeader from "../../../components/admin/Common/AdminHeader";
import SearchBanner from "../../../components/admin/Common/SearchBanner";
import FilterSelect from "../../../components/admin/Common/FilterSelect";
import AdminPagination from "../../../components/admin/Common/AdminPagination";
import ReviewList from "../../../components/admin/Review/ReviewList";
import { Button } from "../../../components/ui/button";
import ReviewDetailDrawer from "../../../components/admin/Review/ReviewDetailDrawer";
import ReviewDeleteDialog from "../../../components/admin/Review/ReviewDeleteDialog";
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
  const [selectedReview, setSelectedReview] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const listRef = useRef(null);
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
  const reload = () => Promise.all([fetchReviews(), fetchStats()]);
  const changePage = (page) => {
    setCurrentPage(page);
    listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleToggleVisible = async (review) => {
    setBusyId(review.id);
    try {
      await adminApi.updateReviewStatus(review.id, review.is_active === false);
      toast.success(review.is_active === false ? "Đã hiện lại đánh giá" : "Đã ẩn đánh giá khỏi trang sản phẩm");
      setSelectedReview((current) => current?.id === review.id ? { ...current, is_active: review.is_active === false } : current);
      await reload();
    } catch (err) {
      toast.error(err?.message || "Lỗi cập nhật trạng thái đánh giá");
    } finally {
      setBusyId(null);
    }
  };

  const handleReply = async (review, reply) => {
    setSavingReplyId(review.id);
    try {
      await adminApi.replyToReview(review.id, reply);
      toast.success("Đã gửi phản hồi");
      setSelectedReview((current) => current?.id === review.id ? { ...current, admin_reply: reply, replied_at: new Date().toISOString() } : current);
      await reload();
      return true;
    } catch (err) {
      toast.error(err?.message || "Lỗi gửi phản hồi");
      return false;
    } finally {
      setSavingReplyId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget || deleting) return;
    setDeleting(true);
    try {
      await adminApi.deleteReview(deleteTarget.id);
      toast.success("Đã xóa đánh giá");
      setSelectedReview((current) => current?.id === deleteTarget.id ? null : current);
      setDeleteTarget(null);
      if (reviews.length === 1 && currentPage > 1) {
        setCurrentPage((page) => page - 1);
        await fetchStats();
      } else await reload();
    } catch (err) {
      toast.error(err?.message || "Không xóa được đánh giá");
    } finally {
      setDeleting(false);
    }
  };

  const totalPages = Math.ceil(count / PAGE_SIZE);
  const pagination = { currentPage, totalPages, totalCount: count, countLabel: "đánh giá", onPageChange: changePage };
  const [sortKey, sortDir] = sortValue.split(":");

  return (
    <div className="space-y-3 pb-8">
      <AdminHeader
        title="Quản lý đánh giá"
        subtitle="Đọc nhanh đánh giá, mở chi tiết để phản hồi và kiểm duyệt nội dung"
        actions={<Button variant={replied === "unreplied" ? "default" : "outline"} onClick={() => setReplied("unreplied")}>
          Chưa phản hồi · {stats?.unreplied_count || 0}
        </Button>}
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

      <div ref={listRef} className="scroll-mt-20 space-y-3">
        {totalPages > 1 && <div className="sticky top-16 z-20 overflow-hidden rounded-xl border border-border bg-card shadow-card">
          <AdminPagination {...pagination} />
        </div>}
        <ReviewList
          reviews={reviews} loading={loading} hasFilters={hasFilters}
          onOpen={setSelectedReview} onToggleVisible={handleToggleVisible} onDelete={setDeleteTarget}
          busyId={busyId || savingReplyId} sort={{ key: sortKey, dir: sortDir }}
          onSortChange={({ key, dir }) => setSortValue(`${key}:${dir}`)}
          pagination={totalPages > 1 ? pagination : undefined}
        />
      </div>
      <ReviewDetailDrawer
        review={selectedReview} saving={savingReplyId === selectedReview?.id}
        busy={busyId === selectedReview?.id} onClose={() => setSelectedReview(null)}
        onReply={handleReply} onToggleVisible={handleToggleVisible} onDelete={setDeleteTarget}
      />
      <ReviewDeleteDialog review={deleteTarget} deleting={deleting} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} />
    </div>
  );
};

export default ReviewListPage;
