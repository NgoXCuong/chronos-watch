import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import warrantyApi from "@/api/warranty.api";
import useDebounce from "./useDebounce";

// 9 phiếu = 3 hàng × 3 cột trên grid lg
const PAGE_SIZE = 9;
const DEFAULT_SORT = { key: "created_at", dir: "desc" };

// Toàn bộ search/lọc/phân trang đều chạy ở backend (Rule 3 — không sort trên 1 trang dữ liệu)
export const useMyWarranties = () => {
  const [warranties, setWarranties] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [state, setState] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState(DEFAULT_SORT);
  // ?order=<id> là bộ lọc đến từ trang chi tiết đơn — đặt ở URL để link chia sẻ được
  const [searchParams, setSearchParams] = useSearchParams();
  const orderId = searchParams.get("order") || "";

  const debouncedSearch = useDebounce(search, 400);
  const isFirstQuery = useRef(true);

  const fetchWarranties = useCallback(async () => {
    setLoading(true);
    try {
      const data = await warrantyApi.getMy({
        search: debouncedSearch,
        state,
        page,
        limit: PAGE_SIZE,
        sort: sort.key,
        dir: sort.dir,
        ...(orderId ? { order: orderId } : {}),
      });
      setWarranties(data.warranties ?? []);
      setTotal(data.total ?? 0);
    } catch (err) {
      toast.error(err?.message || "Không tải được danh sách phiếu bảo hành");
      setWarranties([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, state, page, sort, orderId]);

  useEffect(() => {
    fetchWarranties();
  }, [fetchWarranties]);

  // Đổi bộ lọc/sort → về trang 1; bỏ qua lần chạy đầu để không dồn 2 request
  useEffect(() => {
    if (isFirstQuery.current) {
      isFirstQuery.current = false;
      return;
    }
    setPage(1);
  }, [debouncedSearch, state, sort, orderId]);

  const clearOrder = useCallback(() => {
    const next = new URLSearchParams(searchParams);
    next.delete("order");
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);

  return {
    warranties,
    total,
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
    hasFilters: Boolean(orderId || search || state),
    pageSize: PAGE_SIZE,
    totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
    refresh: fetchWarranties,
  };
};

export default useMyWarranties;
