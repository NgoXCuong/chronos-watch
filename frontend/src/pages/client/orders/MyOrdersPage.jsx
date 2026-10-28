import { Inbox, RefreshCw, Search, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FilterSelect from "@/components/admin/Common/FilterSelect";
import AdminPagination from "@/components/admin/Common/AdminPagination";
import AccountLayout from "@/components/client/AccountLayout";
import NoticeCard from "@/components/client/NoticeCard";
import MyOrderCard from "@/components/client/orders/MyOrderCard";
import MyOrderCardSkeleton from "@/components/client/orders/MyOrderCardSkeleton";
import {
  MY_ORDER_SORT_OPTIONS,
  MY_ORDER_STATUS_FILTER_OPTIONS,
} from "@/constants/myOrders";
import { useMyOrders } from "@/hooks/useMyOrders";

const Toolbar = ({ search, setSearch, status, setStatus, sort, setSort, loading, refresh }) => (
  <div className="flex flex-wrap items-center gap-3 rounded-xl border border-navy-200/70 bg-navy-50/70 px-4 py-3 shadow-card dark:border-navy-500/25 dark:bg-navy-500/10">
    <div className="w-full md:max-w-xs">
      <Input
        icon={Search}
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Tìm theo mã đơn, người nhận, SĐT, tên sản phẩm…"
        aria-label="Tìm đơn hàng của tôi"
        className="h-10"
      />
    </div>
    <FilterSelect
      label="Trạng thái"
      value={status}
      onChange={setStatus}
      options={MY_ORDER_STATUS_FILTER_OPTIONS}
    />
    <FilterSelect
      label="Sắp xếp"
      value={sort}
      onChange={setSort}
      options={MY_ORDER_SORT_OPTIONS}
      contentClassName="w-48"
    />
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
);

const MyOrdersPage = () => {
  const {
    orders,
    total,
    totalPages,
    pageSize,
    loading,
    search,
    status,
    sort,
    page,
    hasFilters,
    setSearch,
    setStatus,
    setSort,
    setPage,
    clearFilters,
    refresh,
  } = useMyOrders();

  return (
    <AccountLayout
      title="Đơn hàng của tôi"
      subtitle="Theo dõi từng mốc giao hàng, xác nhận chuyển khoản và đánh giá sau khi nhận máy."
    >
      <Toolbar
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        sort={sort}
        setSort={setSort}
        loading={loading}
        refresh={refresh}
      />

      <div className="mt-5">
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: Math.min(pageSize, 4) }, (_, index) => (
              <MyOrderCardSkeleton key={index} />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <NoticeCard
            icon={hasFilters ? Inbox : ShoppingBag}
            title={hasFilters ? "Không tìm thấy đơn phù hợp" : "Bạn chưa đặt đơn nào"}
            description={
              hasFilters
                ? "Thử đổi từ khóa hoặc bỏ bộ lọc trạng thái để xem toàn bộ lịch sử đơn hàng."
                : "Mỗi đơn bạn đặt sẽ xuất hiện ở đây kèm mã đơn, trạng thái giao hàng và phiếu bảo hành."
            }
          >
            {hasFilters && (
              <Button type="button" variant="outline" size="sm" onClick={clearFilters}>
                Xóa bộ lọc
              </Button>
            )}
            <Link to="/products" className="mt-1">
              <Button type="button" size="sm" variant={hasFilters ? "buy" : "default"}>
                Xem tất cả sản phẩm
              </Button>
            </Link>
          </NoticeCard>
        ) : (
          <>
            <p className="mb-3 text-[13px] text-muted-foreground">
              <span className="font-semibold tabular-nums text-navy-700">{total}</span> đơn hàng
              {status && ` · đang lọc theo trạng thái`}
            </p>
            <div className="space-y-4">
              {orders.map((order) => (
                <MyOrderCard key={order.id} order={order} onConfirmed={refresh} />
              ))}
            </div>

            {total > pageSize && (
              <div className="mt-6 overflow-hidden rounded-xl border border-border">
                <AdminPagination
                  currentPage={page}
                  totalPages={totalPages}
                  totalCount={total}
                  countLabel="đơn"
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

export default MyOrdersPage;
