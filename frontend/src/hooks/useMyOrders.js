import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import orderApi from "@/api/order.api";
import useDebounce from "./useDebounce";
import { MY_ORDER_DEFAULT_SORT, MY_ORDER_PAGE_SIZE } from "@/constants/myOrders";

/**
 * Danh sách đơn của khách: toàn bộ search/lọc/sort/phân trang chạy ở backend (Rule 3).
 * Đổi bộ lọc thì về trang 1 NGAY TRONG HANDLER — không làm bằng effect để không
 * dính `react-hooks/set-state-in-effect` và không phát sinh request thừa.
 */
export const useMyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearchState] = useState("");
  const [status, setStatusState] = useState("");
  const [sort, setSortState] = useState(MY_ORDER_DEFAULT_SORT);
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 400);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await orderApi.getMyOrders({
        search: debouncedSearch,
        status,
        sort,
        page,
        limit: MY_ORDER_PAGE_SIZE,
      });
      setOrders(data.orders ?? []);
      setTotal(data.count ?? 0);
      setTotalPages(data.totalPages ?? 1);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Không tải được danh sách đơn hàng");
      setOrders([]);
      setTotal(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, status, sort, page]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const setSearch = (value) => {
    setSearchState(value);
    setPage(1);
  };

  const setStatus = (value) => {
    setStatusState(value);
    setPage(1);
  };

  const setSort = (value) => {
    setSortState(value);
    setPage(1);
  };

  const clearFilters = () => {
    setSearchState("");
    setStatusState("");
    setSortState(MY_ORDER_DEFAULT_SORT);
    setPage(1);
  };

  const hasFilters = Boolean(search || status || sort !== MY_ORDER_DEFAULT_SORT);

  return {
    orders,
    total,
    totalPages,
    pageSize: MY_ORDER_PAGE_SIZE,
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
    refresh: fetchOrders,
  };
};

export default useMyOrders;
