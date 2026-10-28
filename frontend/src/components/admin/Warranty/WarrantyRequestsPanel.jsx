import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import warrantyApi from "../../../api/warranty.api";
import useDebounce from "../../../hooks/useDebounce";
import SearchBanner from "../Common/SearchBanner";
import FilterSelect from "../Common/FilterSelect";
import RequestTable from "./RequestTable";
import WarrantyReplyDialog from "./WarrantyReplyDialog";
import { WARRANTY_REQUEST_FILTER_OPTIONS } from "../../../constants/warrantyStatus";

const PAGE_SIZE = 10;
const DEFAULT_SORT = { key: "created_at", dir: "desc" };

// Tab "Yêu cầu bảo hành" tự giữ state riêng, để trang cha không vượt ~300 dòng (Rule 1)
const WarrantyRequestsPanel = ({ onChanged }) => {
  const [requests, setRequests] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState(DEFAULT_SORT);
  const [replying, setReplying] = useState(null);
  const [saving, setSaving] = useState(false);
  const debouncedSearch = useDebounce(searchTerm, 400);
  const isFirstQuery = useRef(true);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await warrantyApi.getRequests({
        search: debouncedSearch,
        state: status,
        page: currentPage,
        limit: PAGE_SIZE,
        sort: sort.key,
        dir: sort.dir,
      });
      setRequests(data.requests || []);
      setCount(data.total || 0);
    } catch {
      toast.error("Không tải được danh sách yêu cầu bảo hành");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [currentPage, debouncedSearch, status, sort]);

  useEffect(() => {
    if (isFirstQuery.current) {
      isFirstQuery.current = false;
      return;
    }
    setCurrentPage(1);
  }, [debouncedSearch, status, sort]);

  const handleReply = async (payload) => {
    setSaving(true);
    try {
      await warrantyApi.replyRequest(replying.id, payload);
      toast.success("Đã gửi phản hồi cho khách hàng");
      setReplying(null);
      fetchRequests();
      // Reply đổi cả trạng thái PHIẾU cha (backend) → KPI và bảng phiếu ở trang cha
      // phải tải lại, nếu không admin thấy hai số liệu mâu thuẫn nhau trên cùng màn hình.
      onChanged?.();
    } catch (err) {
      toast.error(err?.message || "Không gửi được phản hồi");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-3">
      <SearchBanner
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        placeholder="Tìm theo mô tả, mã phiếu, tên sản phẩm, khách hàng..."
        onRefresh={fetchRequests}
        loading={loading}
        count={count}
        countLabel="yêu cầu"
      >
        <FilterSelect
          label="Trạng thái"
          value={status}
          onChange={setStatus}
          options={WARRANTY_REQUEST_FILTER_OPTIONS}
        />
      </SearchBanner>

      <RequestTable
        requests={requests}
        loading={loading}
        searchTerm={debouncedSearch}
        stateFilter={status}
        sort={sort}
        onSortChange={setSort}
        onReply={(row) => setReplying(row)}
        pagination={{
          currentPage,
          totalPages: Math.ceil(count / PAGE_SIZE),
          totalCount: count,
          countLabel: "yêu cầu",
          onPageChange: (page) => setCurrentPage(page),
        }}
      />

      <WarrantyReplyDialog
        open={!!replying}
        request={replying}
        saving={saving}
        onSubmit={handleReply}
        onClose={() => setReplying(null)}
      />
    </div>
  );
};

export default WarrantyRequestsPanel;
