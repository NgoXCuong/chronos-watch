import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowUpRight, PackageCheck, CircleHelp } from 'lucide-react';
import { Badge } from '../../ui/badge';
import DashboardPanel from '../Common/DashboardPanel';
import StockAlertRow from './StockAlertRow';

export default function OperationBrief({ lowStockProducts = [], stats }) {
    const review = stats?.stock_review_products || [];
    const count = stats?.low_stock_count || 0;
    const reviewCount = stats?.stock_review_count || 0;
    return (
        <DashboardPanel
            icon={AlertTriangle}
            title="Kế hoạch tồn kho"
            subtitle="Theo nhu cầu mua & thời gian nhập hàng"
            bodyClassName="flex min-h-0 flex-col p-3"
            action={<Link to="/admin/products" className="inline-flex items-center gap-1.5 rounded-md px-1 py-2 text-[11px] font-semibold text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-ring">Tồn kho <ArrowUpRight size={14} aria-hidden="true" /></Link>}
        >
            <div className={`grid min-h-0 flex-1 gap-3 ${reviewCount > 0 ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
                <section aria-label="Sản phẩm cần nhập hàng" className="flex min-h-0 flex-col overflow-hidden rounded-lg border border-border bg-muted/20">
                    <header className="flex shrink-0 items-center justify-between gap-2 border-b border-border px-3 py-2.5"><p className="text-xs font-semibold">Cần nhập hàng</p><Badge variant={count > 0 ? 'warning' : 'muted'} className="tabular-nums">{count} mẫu</Badge></header>
                    <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-2">
                        {lowStockProducts.map((product) => <StockAlertRow key={product.id} product={product} />)}
                        {count === 0 && <div className="flex h-full min-h-24 flex-col items-center justify-center gap-2 p-3 text-center"><PackageCheck size={24} className="text-muted-foreground" /><p className="text-xs text-muted-foreground">{stats?.stock_assessed_count > 0 ? 'Chưa có mẫu cần nhập thêm' : 'Chưa có sản phẩm đang bán'}</p></div>}
                    </div>
                </section>
                {reviewCount > 0 && <section aria-label="Sản phẩm chưa đủ dữ liệu dự báo" className="flex min-h-0 flex-col overflow-hidden rounded-lg border border-border bg-muted/20">
                    <header className="flex shrink-0 items-center justify-between gap-2 border-b border-border px-3 py-2.5"><p className="inline-flex items-center gap-1.5 text-xs font-semibold"><CircleHelp size={13} />Cần đối chiếu</p><Badge variant="muted" className="tabular-nums">{reviewCount} mẫu</Badge></header>
                    <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-2">{review.map((product) => <StockAlertRow key={product.id} product={product} />)}</div>
                </section>}
            </div>
        </DashboardPanel>
    );
}
