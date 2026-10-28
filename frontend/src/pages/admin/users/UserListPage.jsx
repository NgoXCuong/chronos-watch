import { useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx";
import { FileSpreadsheet, Lock, Unlock } from "lucide-react";
import { toast } from "sonner";
import adminApi from "../../../api/admin.api";
import useDebounce from "../../../hooks/useDebounce";
import { useAuth } from "../../../hooks/useAuth";
import AdminHeader from "../../../components/admin/Common/AdminHeader";
import SearchBanner from "../../../components/admin/Common/SearchBanner";
import SelectionActions from "../../../components/admin/Common/SelectionActions";
import FilterSelect from "../../../components/admin/Common/FilterSelect";
import StatsGrid from "../../../components/admin/Common/StatsGrid";
import UserTable from "../../../components/admin/User/UserTable";
import UserDetailDrawer from "../../../components/admin/User/UserDetailDrawer";
import UserPasswordDialog from "../../../components/admin/User/UserPasswordDialog";
import { Button } from "../../../components/ui/button";
import {
  USER_ROLE_FILTER_OPTIONS,
  USER_STATUS_FILTER_OPTIONS,
} from "../../../constants/userManage";
import {
  buildUserStatCards,
  selectedWithoutSelf,
  toUserExportRow,
} from "../../../utils/userManage";

const PAGE_SIZE = 10;
const DEFAULT_SORT = { key: "created_at", dir: "desc" };
const BULK_ICON = "h-3.5 w-3.5";

const writeExcel = (users, label) => {
  if (users.length === 0) {
    toast.error("Không có dữ liệu để xuất");
    return;
  }
  const sheet = XLSX.utils.json_to_sheet(users.map(toUserExportRow));
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, "Users");
  XLSX.writeFile(
    workbook,
    `Chronos_Users_${new Date().toISOString().split("T")[0]}.xlsx`,
  );
  toast.success(`Đã xuất ${users.length} ${label} ra file Excel`);
};

const UserListPage = () => {
  const { user: currentAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [count, setCount] = useState(0);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState(DEFAULT_SORT);
  const [selectedIds, setSelectedIds] = useState([]);
  const [busyId, setBusyId] = useState(null);
  const [bulkBusy, setBulkBusy] = useState(false);
  const [drawerUserId, setDrawerUserId] = useState(null);
  const [passwordUser, setPasswordUser] = useState(null);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const debouncedSearch = useDebounce(searchTerm, 400);
  const isFirstQuery = useRef(true);

  // KPI đếm toàn hệ thống (85 thành viên) — bảng chỉ trả về 10 dòng mỗi trang
  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      setStats(await adminApi.getUserStats());
    } catch {
      toast.error("Không tải được số liệu thành viên");
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getAllUsers({
        search: debouncedSearch,
        role,
        status,
        page: currentPage,
        limit: PAGE_SIZE,
        sort: sort.key,
        dir: sort.dir,
      });
      setUsers(data.rows || []);
      setCount(data.count || 0);
    } catch {
      toast.error("Không thể tải danh sách thành viên");
    } finally {
      setLoading(false);
    }
  };

  const reload = async () => {
    await Promise.all([fetchUsers(), fetchStats()]);
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, debouncedSearch, role, status, sort]);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (isFirstQuery.current) {
      isFirstQuery.current = false;
      return;
    }
    setCurrentPage(1);
  }, [debouncedSearch, role, status, sort]);

  const toggleUserStatus = async (user, next) => {
    setBusyId(user.id);
    try {
      await adminApi.updateUserStatus(user.id, next);
      toast.success(next === "banned" ? `Đã khóa ${user.username}` : `Đã mở khóa ${user.username}`);
      setDrawerUserId(null);
      setSelectedIds((ids) => ids.filter((id) => id !== user.id));
      await reload();
    } catch (error) {
      toast.error(error?.message || "Không đổi được trạng thái tài khoản");
    } finally {
      setBusyId(null);
    }
  };

  const toggleUserRole = async (user) => {
    const next = user.role === "admin" ? "customer" : "admin";
    if (next === "customer" && !window.confirm(
      `Hạ ${user.username} xuống khách hàng? Người này sẽ mất quyền truy cập trang quản trị.`
    )) return;
    setBusyId(user.id);
    try {
      await adminApi.updateUserRole(user.id, next);
      toast.success(next === "admin" ? `Đã gán quyền quản trị cho ${user.username}` : `Đã hạ ${user.username} xuống khách hàng`);
      setDrawerUserId(null);
      await reload();
    } catch (error) {
      toast.error(error?.message || "Không đổi được vai trò tài khoản");
    } finally {
      setBusyId(null);
    }
  };

  // Mật khẩu mới chỉ đi một chiều (server băm bằng bcrypt, không bao giờ trả về),
  // nên admin phải tự chuyển cho khách qua kênh khác — dialog nói rõ điều đó.
  const submitNewPassword = async (password) => {
    if (!passwordUser) return;
    setPasswordSaving(true);
    try {
      await adminApi.resetUserPassword(passwordUser.id, password);
      toast.success(`Đã đặt lại mật khẩu cho ${passwordUser.username}`);
      setPasswordUser(null);
    } catch (error) {
      toast.error(error?.message || "Không đổi được mật khẩu tài khoản");
    } finally {
      setPasswordSaving(false);
    }
  };

  // Tài khoản đang đăng nhập luôn bị loại khỏi danh sách chọn hàng loạt
  const bulkTargets = selectedWithoutSelf(selectedIds, currentAdmin?.id);

  const bulkUpdateStatus = async (next) => {
    if (bulkTargets.length === 0) {
      toast.error("Không còn tài khoản nào để cập nhật");
      return;
    }
    setBulkBusy(true);
    try {
      const result = await adminApi.bulkUpdateUserStatus(bulkTargets, next);
      toast.success(`Đã ${next === "banned" ? "khóa" : "mở khóa"} ${result.updated} tài khoản`);
      setSelectedIds([]);
      setDrawerUserId(null);
      await reload();
    } catch (error) {
      toast.error(error?.message || "Không cập nhật được hàng loạt");
    } finally {
      setBulkBusy(false);
    }
  };

  // Trang Thành viên giữ logic bulk riêng (phải loại chính tài khoản đang đăng nhập
  // khỏi danh sách khóa) nên không dùng useBulkSelection — chỉ dùng SelectionActions
  const bulkActions = [
    {
      key: "unban",
      label: "Mở khóa đã chọn",
      icon: <Unlock className={BULK_ICON} strokeWidth={2} />,
      onClick: () => bulkUpdateStatus("active"),
    },
    {
      key: "ban",
      label: "Khóa đã chọn",
      variant: "destructive",
      icon: <Lock className={BULK_ICON} strokeWidth={2} />,
      onClick: () => bulkUpdateStatus("banned"),
    },
    {
      key: "excel",
      label: "Xuất đã chọn",
      icon: <FileSpreadsheet className={BULK_ICON} strokeWidth={2} />,
      onClick: () => writeExcel(users.filter((row) => selectedIds.includes(row.id)), "dòng đã chọn"),
    },
  ];

  return (
    <div className="space-y-3 pb-8">
      <AdminHeader
        title="Quản lý Thành viên"
        subtitle="Phân quyền, khóa tài khoản và theo dõi mức chi tiêu của khách"
        actions={
          <Button
            onClick={() => writeExcel(users, "thành viên trong trang")}
            className="h-9 gap-2 rounded-lg px-4 text-[13px] font-semibold"
          >
            <FileSpreadsheet className="h-4 w-4" strokeWidth={2} />
            Xuất Excel
          </Button>
        }
      />

      <StatsGrid stats={buildUserStatCards(stats).map((card) => ({ ...card, loading: statsLoading }))} />

      <SearchBanner
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        placeholder="Tìm theo tên, email, số điện thoại..."
        onRefresh={reload}
        loading={loading}
        count={count}
        countLabel="thành viên"
      >
        <FilterSelect label="Vai trò" value={role} onChange={setRole} options={USER_ROLE_FILTER_OPTIONS} />
        <FilterSelect label="Trạng thái" value={status} onChange={setStatus} options={USER_STATUS_FILTER_OPTIONS} />
      </SearchBanner>

      <UserTable
        users={users}
        loading={loading}
        currentUserId={currentAdmin?.id}
        busyId={busyId}
        sort={sort}
        onSortChange={setSort}
        selectedRowKeys={selectedIds}
        onSelectionChange={setSelectedIds}
        selectionActions={<SelectionActions busy={bulkBusy} actions={bulkActions} />}
        onView={(user) => setDrawerUserId(user.id)}
        onToggleRole={toggleUserRole}
        onResetPassword={(user) => setPasswordUser(user)}
        onToggleStatus={(user) => toggleUserStatus(user, user.status === "banned" ? "active" : "banned")}
        pagination={{
          currentPage,
          totalPages: Math.ceil(count / PAGE_SIZE),
          totalCount: count,
          countLabel: "thành viên",
          onPageChange: (page) => setCurrentPage(page),
        }}
      />

      <UserDetailDrawer
        open={!!drawerUserId}
        userId={drawerUserId}
        currentUserId={currentAdmin?.id}
        onClose={() => setDrawerUserId(null)}
        onToggleRole={toggleUserRole}
        onResetPassword={(user) => setPasswordUser(user)}
        onToggleStatus={(user) => toggleUserStatus(user, user.status === "banned" ? "active" : "banned")}
      />

      <UserPasswordDialog
        open={!!passwordUser}
        user={passwordUser}
        saving={passwordSaving}
        onSubmit={submitNewPassword}
        onClose={() => setPasswordUser(null)}
      />
    </div>
  );
};

export default UserListPage;
