import React, { useState, useEffect } from 'react';
import {
    UserCheck,
    FileSpreadsheet,
    RefreshCw,
    Users as UsersIcon,
    ShieldCheck
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

    const statCards = [
        { 
            label: 'Tổng thành viên', icon: UsersIcon, value: users.length, 
            color: 'text-slate-900', bg: 'bg-white', 
            dot: 'bg-slate-900', trend: '↑ 12.5%', trendColor: 'text-emerald-600',
            hist: [20, 25, 23, 28, 30, 35, users.length], chartColor: '#0F172A'
        },
        { 
            label: 'Ban quản trị', icon: ShieldCheck, value: users.filter(u => u.role === 'admin').length, 
            color: 'text-white', bg: 'bg-amber-600', 
            dot: 'bg-white', trend: '↑ 1 mã mới', trendColor: 'text-amber-100',
            hist: [1, 2, 2, 3, 3, 3, users.filter(u => u.role === 'admin').length], chartColor: '#FEF3C7',
            pulse: true
        },
        { 
            label: 'Đang hoạt động', icon: UserCheck, value: users.filter(u => u.status === 'active').length, 
            color: 'text-white', bg: 'bg-slate-900', 
            dot: 'bg-amber-500', trend: '↑ 8% tháng này', trendColor: 'text-amber-500',
            hist: [15, 18, 17, 20, 22, 25, users.filter(u => u.status === 'active').length], chartColor: '#F59E0B',
            pulse: true
        }
    ];

    return (
        <div className="space-y-8 pb-20 font-roboto">
            <AdminHeader 
                title="Cộng đồng Thành viên"
                subtitle="Quản lý bảo mật và phân quyền hệ thống"
                actions={
                    <>
                        <Button onClick={handleExportExcel} variant="outline" className="gap-2 h-11 px-5 rounded-2xl border-slate-200 text-slate-600 font-bold text-xs uppercase tracking-widest hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-all">
                            <FileSpreadsheet className="h-4 w-4" /> Xuất Excel
                        </Button>
                        <Button onClick={fetchUsers} variant="outline" className="gap-2 h-11 px-5 rounded-2xl border-slate-200 text-slate-600 font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all">
                            <RefreshCw className="h-4 w-4" /> Làm mới
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

            <UserTable users={filteredUsers} loading={loading} />
        </div>
    );
};

export default UserListPage;
