import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowRight, PackageCheck, CircleHelp } from 'lucide-react';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import StockAlertRow from './StockAlertRow';

export default function OperationBrief({ lowStockProducts = [], stats }) {
    const navigate = useNavigate();
    const review = stats?.stock_review_products || [];
    const count = stats?.low_stock_count || 0;
    const reviewCount = stats?.stock_review_count || 0;
    return (
        <section className="flex h-full min-h-0 min-w-0 flex-col rounded-xl border border-border bg-card p-5 shadow-card">
            <header className="mb-3 flex shrink-0 items-start justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2.5">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-foreground"><AlertTriangle size={20} aria-hidden="true" /></span>
                    <div><h3 className="text-base font-bold text-foreground">Kế hoạch tồn kho</h3><p className="mt-0.5 text-[11px] text-muted-foreground">Theo nhu cầu & thời gian nhập</p></div>
                </div>
                {count > 0 && <Badge variant="warning" className="shrink-0 tabular-nums">{count} cần nhập</Badge>}
            </header>
            <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
                {lowStockProducts.map((product) => <StockAlertRow key={product.id} product={product} />)}
                {reviewCount > 0 && <>
                    <p className="flex items-center gap-1.5 pt-2 text-xs font-semibold text-muted-foreground"><CircleHelp size={14} />{reviewCount} mẫu cần đối chiếu</p>
                    {review.map((product) => <StockAlertRow key={product.id} product={product} />)}
                </>}
                {count === 0 && reviewCount === 0 && <div className="flex min-h-32 flex-col items-center justify-center gap-2 rounded-lg bg-muted/50 p-4 text-center">
                    <PackageCheck size={28} className="text-muted-foreground" aria-hidden="true" />
                    <p className="text-sm font-semibold text-foreground">{stats?.stock_assessed_count > 0 ? 'Chưa có mẫu cần nhập thêm' : 'Chưa có sản phẩm đang bán'}</p>
                    <p className="text-xs text-muted-foreground">Dự báo được tính lại từ lịch sử mua gần đây.</p>
                </div>}
            </div>
            <Button variant="outline" size="sm" className="mt-3 w-full shrink-0" onClick={() => navigate('/admin/products')}>Xem kho & cấu hình <ArrowRight size={14} /></Button>
        </section>
    );
}
