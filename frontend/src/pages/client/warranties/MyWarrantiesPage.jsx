import { Link } from "react-router-dom";
import {
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
  Inbox,
  RefreshCw,
  Search,
  ShieldCheck,
  ShoppingBag,
  X,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AccountLayout from "@/components/client/AccountLayout";
import FilterSelect from "@/components/admin/Common/FilterSelect";
import AdminPagination from "@/components/admin/Common/AdminPagination";
import WarrantyCard from "@/components/client/warranty/WarrantyCard";
import WarrantyCardSkeleton from "@/components/client/warranty/WarrantyCardSkeleton";
import NoticeCard from "@/components/client/NoticeCard";
import {
  WARRANTY_SORT_OPTIONS,
  WARRANTY_STATE_FILTER_OPTIONS,
} from "@/constants/warrantyStatus";
import { useMyWarranties } from "@/hooks/useMyWarranties";
import { cn } from "@/lib/utils";

const WarrantyGridSkeleton = ({ count }) => (
  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
    {Array.from({ length: count }, (_, index) => (
      <WarrantyCardSkeleton key={index} />
    ))}
  </div>
);

const MyWarrantiesPage = () => {
  const {
    warranties,
    total,
    totalPages,
    pageSize,
    loading,
    search,
    setSearch,
    state,
    setState,
    page,
    setPage,
    sort,
    setSort,
    orderId,
    clearOrder,
    hasFilters,
    refresh,
  } = useMyWarranties();

  const toggleSortDir = () =>
    setSort((prev) => ({ ...prev, dir: prev.dir === "asc" ? "desc" : "asc" }));

  const DirIcon = sort.dir === "asc" ? ArrowUpNarrowWide : ArrowDownWideNarrow;

  const clearFilters = () => {
    setSearch("");
    setState("");
    if (orderId) clearOrder();
  };

  return (
    <AccountLayout
      title="Phiếu bảo hành của bạn"
      subtitle="Mỗi chiếc đồng hồ bạn mua có một phiếu bảo hành riêng — tra mã phiếu, hạn còn lại và gửi yêu cầu khi máy gặp lỗi."
    >
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-navy-200/70 bg-navy-50/70 px-4 py-3 shadow-card dark:border-navy-500/25 dark:bg-navy-500/10">
        <div className="w-full md:max-w-xs">
          <Input
            icon={Search}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Tìm theo mã phiếu, serial, tên sản phẩm…"
            aria-label="Tìm phiếu bảo hành"
            className="h-10"
          />
        </div>
        <FilterSelect
          label="Trạng thái"
          value={state}
          onChange={setState}
          options={WARRANTY_STATE_FILTER_OPTIONS}
        />
        <FilterSelect
          label="Sắp xếp"
          value={sort.key}
          onChange={(key) => setSort((prev) => ({ ...prev, key }))}
          options={WARRANTY_SORT_OPTIONS}
          contentClassName="w-44"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={toggleSortDir}
          aria-label={sort.dir === "asc" ? "Sắp xếp giảm dần" : "Sắp xếp tăng dần"}
          title={sort.dir === "asc" ? "Sắp xếp giảm dần" : "Sắp xếp tăng dần"}
          className="h-10 w-10 text-navy-700 dark:text-navy-100"
        >
          <DirIcon className="h-4 w-4" strokeWidth={2} />
        </Button>
        {orderId && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={clearOrder}
            className="h-10 gap-2 text-navy-700 dark:text-navy-100"
            title="Bỏ lọc theo đơn hàng"
          >
            <ShoppingBag className="h-3.5 w-3.5" strokeWidth={2} />
            Chỉ phiếu của đơn #{orderId}
            <X className="h-3.5 w-3.5" strokeWidth={2} />
          </Button>
        )}
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={refresh}
          loading={loading}
          aria-label="Tải lại danh sách"
          title="Tải lại danh sách"
          className="ml-auto h-10 w-10"
        >
          {!loading && <RefreshCw className="h-4 w-4" strokeWidth={2} />}
        </Button>
      </div>

      <div className="mt-5">
        {loading ? (
          <WarrantyGridSkeleton count={pageSize} />
        ) : warranties.length === 0 ? (
          <NoticeCard
            icon={Inbox}
            title={hasFilters ? "Không tìm thấy phiếu phù hợp" : "Chưa có phiếu bảo hành"}
            description={
              hasFilters
                ? "Thử đổi từ khóa hoặc bỏ bộ lọc trạng thái để xem toàn bộ phiếu."
                : "Phiếu bảo hành được tạo tự động khi đơn hàng của bạn giao thành công."
            }
          >
            {hasFilters && (
              <Button type="button" variant="outline" size="sm" onClick={clearFilters}>
                Xóa bộ lọc
              </Button>
            )}
            <Link
              to="/orders"
              className={cn(buttonVariants({ variant: "buy", size: "sm" }))}
            >
              <ShieldCheck className="h-4 w-4" strokeWidth={2} />
              Xem đơn hàng của tôi
            </Link>
          </NoticeCard>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {warranties.map((warranty) => (
                <WarrantyCard key={warranty.id} warranty={warranty} />
              ))}
            </div>

            {total > pageSize && (
              <div className="mt-6 overflow-hidden rounded-xl border border-border">
                <AdminPagination
                  currentPage={page}
                  totalPages={totalPages}
                  totalCount={total}
                  countLabel="phiếu"
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </AccountLayout>
  );
};

export default MyWarrantiesPage;
