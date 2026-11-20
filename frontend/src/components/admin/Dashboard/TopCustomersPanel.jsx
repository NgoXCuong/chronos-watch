import { rankingTone } from '../../../constants/rankingTones';
import { cn } from '../../../lib/utils';
import { Link } from 'react-router-dom';
import { ArrowRight, Crown, UsersRound } from 'lucide-react';
import DashboardPanel from '../Common/DashboardPanel';
import { CustomerIdentityCell, CustomerRankCell, CustomerSpentCell } from './CustomerRankingCells';

// Danh sách xếp hạng dạng thẻ dọc cho ô dashboard hẹp, giữ thứ tự từ backend.
export default function TopCustomersPanel({ customers = [] }) {
    const rows = customers || [];
    return (
        <DashboardPanel
            icon={Crown}
            title="Khách VIP mua nhiều nhất"
            subtitle="Top 5 · Số chiếc đã mua · Đơn đã giao"
            bodyClassName="flex min-h-0 flex-col p-0"
            action={<Link to="/admin/users" aria-label="Xem khách hàng" className="inline-flex size-8 items-center justify-center rounded-lg text-foreground hover:bg-accent"><ArrowRight size={16} aria-hidden="true" /></Link>}
        >
            <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3" aria-label="Xếp hạng khách hàng mua nhiều nhất">
                {rows.length ? <ol className="space-y-2">{rows.map((customer, index) => <li key={customer.id ?? customer.user_id ?? index} className={cn("relative flex items-center gap-2.5 overflow-hidden rounded-xl border px-3 py-3", rankingTone(index + 1).block)}>
                    <span className={cn("absolute bottom-2 left-0 top-2 w-1 rounded-r-full", rankingTone(index + 1).edge)} aria-hidden="true" />
                    <CustomerRankCell rank={index + 1} />
                    <div className="min-w-0 flex-1"><CustomerIdentityCell customer={customer} /><p className="mt-1 pl-12"><CustomerSpentCell total={customer.total_spent} /></p></div>
                    <div className={cn("shrink-0 text-right", rankingTone(index + 1).value)}><span className="text-lg font-bold tabular-nums">{Number(customer.product_quantity) || 0}</span><span className="ml-1 text-[10px]">chiếc</span><p className="mt-1 text-[10px] text-muted-foreground">{Number(customer.order_count) || 0} đơn đã giao</p></div>
                </li>)}</ol> : <div className="flex min-h-40 flex-col items-center justify-center gap-2 p-4 text-center text-muted-foreground"><UsersRound size={24} /><p className="text-xs">Chưa có khách hàng với đơn giao thành công</p></div>}
            </div>
            <p className="shrink-0 border-t border-border px-4 py-2 text-[10px] leading-relaxed text-muted-foreground">Toàn thời gian · Không tính đơn đang xử lý, hủy hoặc hoàn trả.</p>
        </DashboardPanel>
    );
}
