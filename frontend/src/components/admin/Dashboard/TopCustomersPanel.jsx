import { Link } from 'react-router-dom';
import { ArrowRight, Crown, UsersRound } from 'lucide-react';
import DashboardPanel from '../Common/DashboardPanel';
import { DataTable } from '../../ui/data-table';
import { getCustomerRankingColumns } from './customerRankingColumns';

const columns = getCustomerRankingColumns();

export default function TopCustomersPanel({ customers }) {
    return (
        <DashboardPanel
            icon={Crown}
            title="Khách VIP mua nhiều nhất"
            subtitle="Top 5 theo số chiếc · Đơn đã giao · Toàn thời gian"
            bodyClassName="p-0"
            action={<Link to="/admin/users" className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-foreground hover:underline">Khách hàng <ArrowRight size={13} aria-hidden="true" /></Link>}
        >
            <DataTable
                columns={columns}
                data={customers || []}
                emptyIcon={UsersRound}
                emptyMessage="Chưa có khách hàng với đơn giao thành công"
                containerClassName="rounded-none border-0 shadow-none"
            />
            <p className="border-t border-border px-5 py-3 text-xs leading-relaxed text-muted-foreground">Ưu tiên số chiếc đã mua; khi bằng nhau, xếp theo tổng chi tiêu rồi số đơn. Không tính đơn đang xử lý, hủy hoặc hoàn trả.</p>
        </DashboardPanel>
    );
}
