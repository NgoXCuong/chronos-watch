import { useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  Inbox,
  RefreshCw,
  ShieldOff,
  Ticket,
  Trash2,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";
import warrantyApi from "../../../api/warranty.api";
import useDebounce from "../../../hooks/useDebounce";
import useBulkSelection from "../../../hooks/useBulkSelection";
import AdminHeader from "../../../components/admin/Common/AdminHeader";
import SearchBanner from "../../../components/admin/Common/SearchBanner";
import FilterSelect from "../../../components/admin/Common/FilterSelect";
import SelectionActions from "../../../components/admin/Common/SelectionActions";
import WarrantyTable from "../../../components/admin/Warranty/WarrantyTable";
import WarrantyKpis from "../../../components/admin/Warranty/WarrantyKpis";
import WarrantyEditModal from "../../../components/admin/Warranty/WarrantyEditModal";
import WarrantyDetailDialog from "../../../components/admin/Warranty/WarrantyDetailDialog";
import WarrantyRequestsPanel from "../../../components/admin/Warranty/WarrantyRequestsPanel";
import { Button } from "../../../components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import { WARRANTY_STATE_FILTER_OPTIONS } from "../../../constants/warrantyStatus";

const PAGE_SIZE = 10;
const DEFAULT_SORT = { key: "created_at", dir: "desc" };
const BULK_ICON = "h-3.5 w-3.5";

const WarrantyListPage = () => {
  const [tab, setTab] = useState("warranties");
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [warranties, setWarranties] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState(DEFAULT_SORT);
  const [editing, setEditing] = useState(null);
  const [detailId, setDetailId] = useState(null);
  const [saving, setSaving] = useState(false);
  const debouncedSearch = useDebounce(searchTerm, 400);
  const isFirstQuery = useRef(true);

  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      setStats(await warrantyApi.getStats());
    } catch {
      toast.error("Không tải được số liệu bảo hành");
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchWarranties = async () => {
    setLoading(true);
    try {
      const data = await warrantyApi.getAll({
        search: debouncedSearch,
        state: stateFilter,
        page: currentPage,
        limit: PAGE_SIZE,
        sort: sort.key,
        dir: sort.dir,
      });
      setWarranties(data.warranties || []);
      setCount(data.total || 0);
    } catch {
      toast.error("Không thể tải danh sách phiếu bảo hành");
    } finally {
      setLoading(false);
    }
  };

  const reload = async () => {
    await Promise.all([fetchWarranties(), fetchStats()]);
  };

  useEffect(() => {
    fetchWarranties();
  }, [currentPage, debouncedSearch, stateFilter, sort]);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (isFirstQuery.current) {
      isFirstQuery.current = false;
      return;
    }
    setCurrentPage(1);
  }, [debouncedSearch, stateFilter, sort]);

  const handleEditSubmit = async (payload) => {
    setSaving(true);
    try {
      await warrantyApi.update(editing.id, payload);
      toast.success(`Đã cập nhật phiếu ${editing.code}`);
      setEditing(null);
      await reload();
    } catch (err) {
      toast.error(err?.message || "Có lỗi xảy ra khi lưu phiếu bảo hành");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (warranty) => {
    if (
      !window.confirm(
        `Xóa phiếu "${warranty.code}"? Lịch sử yêu cầu của phiếu sẽ mất theo và không hoàn tác được.`,
      )
    )
      return;
    try {
      await warrantyApi.delete(warranty.id);
      toast.success("Đã xóa phiếu bảo hành");
      setDetailId(null);
      // Xóa dòng cuối của trang thì lùi về trang trước để không thành trang trống
      if (warranties.length === 1 && currentPage > 1)
        setCurrentPage((page) => page - 1);
      else await reload();
    } catch (err) {
      toast.error(err?.message || "Không xóa được phiếu bảo hành");
    }
  };

  const bulk = useBulkSelection({
    rows: warranties,
    label: "phiếu bảo hành",
    onDone: reload,
  });

  // Mọi bulk là SET (PATCH /status/bulk), không loop toggle
  const bulkActions = [
    {
      key: "processing",
      label: "Đang bảo hành",
      icon: <Wrench className={BULK_ICON} strokeWidth={2} />,
      onClick: () =>
        bulk.run((ids) => warrantyApi.bulkSetStatus(ids, "processing")),
    },
    {
      key: "closed",
      label: "Đã đóng",
      icon: <CheckCircle2 className={BULK_ICON} strokeWidth={2} />,
      onClick: () =>
        bulk.run((ids) => warrantyApi.bulkSetStatus(ids, "closed")),
    },
    {
      key: "void",
      label: "Vô hiệu",
      variant: "destructive",
      icon: <ShieldOff className={BULK_ICON} strokeWidth={2} />,
      onClick: () =>
        bulk.run(
          (ids) => warrantyApi.bulkSetStatus(ids, "void"),
          `Vô hiệu ${bulk.selectedIds.length} phiếu? Khách sẽ không gửi yêu cầu bảo hành được nữa.`,
        ),
    },
    {
      key: "delete",
      label: "Xóa đã chọn",
      variant: "destructive",
      icon: <Trash2 className={BULK_ICON} strokeWidth={2} />,
      onClick: () =>
        bulk.run(
          (ids) => warrantyApi.bulkDelete(ids),
          `Xóa vĩnh viễn ${bulk.selectedIds.length} phiếu bảo hành? Phiếu đã có yêu cầu sẽ mất toàn bộ lịch sử kiểm duyệt kèm theo.`,
        ),
    },
  ];

  return (
    <div className="space-y-3 pb-8">
      <AdminHeader
        title="Quản lý bảo hành"
        subtitle="Quản lý toàn bộ phiếu và yêu cầu bảo hành của khách hàng"
        actions={
          <Button
            onClick={reload}
            loading={loading || statsLoading}
            className="h-9 gap-2 rounded-lg px-4 text-[13px] font-semibold"
          >
            {!loading && !statsLoading && (
              <RefreshCw className="h-4 w-4" strokeWidth={2} />
            )}
            Tải lại
          </Button>
        }
      />

      <WarrantyKpis stats={stats} loading={statsLoading} />

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="h-10 justify-start gap-1 rounded-none border-b border-border bg-transparent p-0 text-muted-foreground">
          <TabsTrigger
            value="warranties"
            className="flex items-center gap-1.5 rounded-none border-b-2 border-transparent px-4 py-2 text-[13px] font-bold uppercase tracking-[0.02em] data-[state=active]:border-navy-600 data-[state=active]:bg-transparent data-[state=active]:text-navy-700 data-[state=active]:shadow-none dark:data-[state=active]:text-navy-100"
          >
            <Ticket className="h-4 w-4" strokeWidth={2} />
            Phiếu bảo hành
          </TabsTrigger>
          <TabsTrigger
            value="requests"
            className="flex items-center gap-1.5 rounded-none border-b-2 border-transparent px-4 py-2 text-[13px] font-bold uppercase tracking-[0.02em] data-[state=active]:border-navy-600 data-[state=active]:bg-transparent data-[state=active]:text-navy-700 data-[state=active]:shadow-none dark:data-[state=active]:text-navy-100"
          >
            <Inbox className="h-4 w-4" strokeWidth={2} />
            Yêu cầu bảo hành
          </TabsTrigger>
        </TabsList>

        <TabsContent value="warranties" className="mt-3 space-y-3">
          <SearchBanner
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            placeholder="Tìm theo mã phiếu, serial, tên sản phẩm, SKU, mã đơn, khách hàng..."
            onRefresh={reload}
            loading={loading}
            count={count}
            countLabel="phiếu"
          >
            <FilterSelect
              label="Trạng thái"
              value={stateFilter}
              onChange={setStateFilter}
              options={WARRANTY_STATE_FILTER_OPTIONS}
            />
          </SearchBanner>

          <WarrantyTable
            warranties={warranties}
            loading={loading}
            searchTerm={searchTerm}
            sort={sort}
            onSortChange={setSort}
            onView={(row) => setDetailId(row.id)}
            onEdit={(row) => setEditing(row)}
            onDelete={handleDelete}
            selectedRowKeys={bulk.selectedIds}
            onSelectionChange={bulk.setSelectedIds}
            selectionActions={
              <SelectionActions busy={bulk.busy} actions={bulkActions} />
            }
            pagination={{
              currentPage,
              totalPages: Math.ceil(count / PAGE_SIZE),
              totalCount: count,
              countLabel: "phiếu",
              onPageChange: (page) => setCurrentPage(page),
            }}
          />
        </TabsContent>

        <TabsContent value="requests" className="mt-3">
          <WarrantyRequestsPanel onChanged={reload} />
        </TabsContent>
      </Tabs>

      <WarrantyEditModal
        open={!!editing}
        warranty={editing}
        saving={saving}
        onSubmit={handleEditSubmit}
        onClose={() => setEditing(null)}
      />

      <WarrantyDetailDialog
        open={!!detailId}
        warrantyId={detailId}
        onClose={() => setDetailId(null)}
      />
    </div>
  );
};

export default WarrantyListPage;
