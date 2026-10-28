import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import flashSaleApi from "@/api/flashSale.api";
import useDebounce from "./useDebounce";

const PAGE_SIZE = 10;
const DEFAULT_SORT = { key: "created_at", dir: "desc" };

// Search/lọc/sort/phân trang đều chạy ở backend (Rule 3) — KPI lấy từ /stats,
// không đếm trên 10 dòng đang hiển thị.
export const useFlashSales = () => {
  const [flashSales, setFlashSales] = useState([]);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [state, setState] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState(DEFAULT_SORT);

  const debouncedSearch = useDebounce(search, 400);
  const isFirstQuery = useRef(true);

  const fetchStats = useCallback(async () => {
    try {
      setStats(await flashSaleApi.getStats());
    } catch {
      setStats(null); // KPI phụ, để lỗi ở đây làm đỏ cả bảng là phản tác dụng
    }
  }, []);

  const fetchFlashSales = useCallback(async () => {
    setLoading(true);
    try {
      const data = await flashSaleApi.getAll({
        search: debouncedSearch,
        state,
        status,
        page,
        limit: PAGE_SIZE,
        sort: sort.key,
        dir: sort.dir,
      });
      setFlashSales(data.flashSales ?? []);
      setTotal(data.total ?? 0);
    } catch (err) {
      toast.error(err?.message || "Không tải được danh sách Flash Sale");
      setFlashSales([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, state, status, page, sort]);

  useEffect(() => {
    fetchFlashSales();
    fetchStats();
  }, [fetchFlashSales, fetchStats]);

  // Đổi bộ lọc/sort → về trang 1; bỏ qua lần chạy đầu để không dồn 2 request
  useEffect(() => {
    if (isFirstQuery.current) {
      isFirstQuery.current = false;
      return;
    }
    setPage(1);
  }, [debouncedSearch, state, status, sort]);

  const refresh = useCallback(() => {
    fetchFlashSales();
    fetchStats();
  }, [fetchFlashSales, fetchStats]);

  // Xóa dòng cuối của trang thì lùi về trang trước để không thành trang trống
  const afterDelete = () => {
    if (flashSales.length === 1 && page > 1) setPage((current) => current - 1);
    else refresh();
  };

  return {
    flashSales,
    total,
    stats,
    loading,
    search,
    setSearch,
    state,
    setState,
    status,
    setStatus,
    page,
    setPage,
    sort,
    setSort,
    pageSize: PAGE_SIZE,
    totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
    refresh,
    afterDelete,
  };
};

export default useFlashSales;
