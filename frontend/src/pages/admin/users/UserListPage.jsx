import React, { useState, useEffect } from 'react';
import {
    UserCheck,
    FileSpreadsheet,
    RefreshCw,
    Users as UsersIcon,
    ShieldCheck,
    UserPlus,
    UserX
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import AdminHeader from '../../../components/admin/Common/AdminHeader';
import StatsGrid from '../../../components/admin/Common/StatsGrid';
import SearchBanner from '../../../components/admin/Common/SearchBanner';
import UserTable from '../../../components/admin/User/UserTable';
import adminApi from '../../../api/admin.api';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

const UserListPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await adminApi.getAllUsers();
            setUsers(data);
        } catch (error) {
            console.error("Lỗi lấy người dùng:", error);
            toast.error("Không thể tải danh sách thành viên");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleExportExcel = () => {
        if (users.length === 0) {
            toast.error("Không có dữ liệu để xuất");
            return;
        }

        const exportData = users.map(u => ({
            "Tên đăng nhập": u.username,
            "Email": u.email,
            "Họ tên": u.full_name || 'N/A',
            "Số điện thoại": u.phone || 'N/A',
            "Vai trò": u.role?.toUpperCase(),
            "Ngày gia nhập": new Date(u.created_at).toLocaleString('vi-VN'),
            "Trạng thái": u.status === 'active' ? 'Hoạt động' : 'Bị khóa'
        }));

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Users");
        XLSX.writeFile(wb, `Chronos_Users_${new Date().toISOString().split('T')[0]}.xlsx`);
        toast.success("Đã xuất file Excel thành công!");
    };

    const filteredUsers = users.filter(u =>
        u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleUpdateStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'banned' : 'active';
        try {
            await adminApi.updateUserStatus(id, newStatus);
            toast.success(`Đã ${newStatus === 'active' ? 'mở khóa' : 'khóa'} tài khoản thành công`);
            fetchUsers();
        } catch (error) {
            toast.error(error.message || "Lỗi cập nhật trạng thái");
        }
    };

    const handleUpdateRole = async (id, currentRole) => {
        const newRole = currentRole === 'admin' ? 'customer' : 'admin';
        try {
            await adminApi.updateUserRole(id, newRole);
            toast.success(`Đã thay đổi vai trò thành ${newRole === 'admin' ? 'Quản trị viên' : 'Khách hàng'}`);
            fetchUsers();
        } catch (error) {
            toast.error(error.message || "Lỗi cập nhật vai trò");
        }
    };

    // Dynamic stats calculation
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const usersThisMonth = users.filter(u => new Date(u.created_at) >= startOfThisMonth).length;
    const usersLastMonth = users.filter(u => {
        const d = new Date(u.created_at);
        return d >= startOfLastMonth && d < startOfThisMonth;
    }).length;

    const computeTrend = (curr, prev) => {
        if (prev === 0) return curr > 0 ? `+${curr}` : '0%';
        const diff = ((curr - prev) / prev) * 100;
        return (diff >= 0 ? '+' : '') + diff.toFixed(1) + '%';
    };

    const getTrendColor = (curr, prev) => {
        if (prev === 0) return curr > 0
            ? "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm shadow-emerald-500/10"
            : "bg-slate-50 text-slate-400 border-slate-200";
        return curr >= prev
            ? "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm shadow-emerald-500/10"
            : "bg-rose-50 text-rose-700 border-rose-200 shadow-sm shadow-rose-500/10";
    };

    const bannedUsersCount = users.filter(u => u.status === 'banned').length;

    const statCards = [
        {
            label: 'Tổng thành viên', icon: UsersIcon, value: users.length,
            color: 'text-slate-900', bg: 'bg-white',
            dot: 'bg-slate-900',
            trend: computeTrend(usersThisMonth, usersLastMonth),
            trendColor: getTrendColor(usersThisMonth, usersLastMonth),
            hist: [20, 25, 23, 28, 30, 35, users.length], chartColor: '#0F172A'
        },
        {
            label: 'Thành viên mới', icon: UserPlus, value: usersThisMonth,
            color: 'text-blue-600', bg: 'bg-white',
            dot: 'bg-blue-600',
            trend: computeTrend(usersThisMonth, usersLastMonth),
            trendColor: "bg-blue-50 text-blue-700 border-blue-200 shadow-sm shadow-blue-500/10",
            hist: [2, 5, 8, 12, 10, 15, usersThisMonth], chartColor: '#2563EB',
            pulse: true
        },
        {
            label: 'Đang hoạt động', icon: UserCheck, value: users.filter(u => u.status === 'active').length,
            color: 'text-emerald-600', bg: 'bg-white',
            dot: 'bg-emerald-600',
            trend: `${((users.filter(u => u.status === 'active').length / (users.length || 1)) * 100).toFixed(0)}%`,
            trendColor: "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm shadow-emerald-500/10",
            hist: [15, 18, 17, 20, 22, 25, users.filter(u => u.status === 'active').length], chartColor: '#10B981',
            pulse: true
        },
        {
            label: 'Tài khoản bị khóa', icon: UserX, value: bannedUsersCount,
            color: 'text-rose-600', bg: 'bg-white',
            dot: 'bg-rose-600',
            trend: bannedUsersCount > 0 ? `${((bannedUsersCount / (users.length || 1)) * 100).toFixed(1)}%` : 'Ổn định',
            trendColor: bannedUsersCount > 0
                ? "bg-rose-50 text-rose-700 border-rose-200 shadow-sm shadow-rose-500/10"
                : "bg-slate-50 text-slate-500 border-slate-200",
            hist: [0, 1, 0, 2, 1, 1, bannedUsersCount], chartColor: '#F43F5E'
        }
    ];

    return (
        <div className="space-y-8 pb-20 font-roboto">
            <AdminHeader
                title="Cộng đồng Thành viên"
                subtitle="Quản lý bảo mật và phân quyền hệ thống"
                actions={
                    <>
                        {/* EXPORT EXCEL */}
                        <Button
                            onClick={handleExportExcel}
                            className="gap-2 h-11 px-5 rounded-2xl 
                           bg-emerald-500 text-white 
                           font-bold text-xs uppercase 
                           shadow-md shadow-emerald-500/20
                           hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/30
                           active:scale-95 transition-all duration-200"
                        >
                            <FileSpreadsheet className="h-4 w-4" />
                            Xuất Excel
                        </Button>
                    </>
                }
            />

            <StatsGrid stats={statCards} />

            <SearchBanner
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                placeholder="Tìm kiếm thành viên..."
                onRefresh={fetchUsers}
                loading={loading}
                count={filteredUsers.length}
                countLabel="Hiện có"
            />

            <UserTable
                users={filteredUsers}
                loading={loading}
                onUpdateStatus={handleUpdateStatus}
                onUpdateRole={handleUpdateRole}
            />
        </div>
    );
};

export default UserListPage;
