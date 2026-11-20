import { Link } from 'react-router-dom';
import { ArrowUpRight, Boxes } from 'lucide-react';
import InventoryHealthBadge from '../Common/InventoryHealthBadge';
import { inventoryCoverText, inventoryReasonText } from '../../../constants/inventoryPlanning';

export default function StockAlertRow({ product }) {
    const health = product.inventory_health;
    return (
        <Link to={`/admin/products/edit/${product.id}`} className="group block rounded-lg border border-border bg-card p-2.5 transition-colors hover:bg-accent/50">
            <div className="flex items-start gap-2.5">
                <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">
                    {product.image_url ? <img src={product.image_url} alt="" loading="lazy" className="size-full object-contain" /> : <Boxes size={19} className="text-muted-foreground" />}
                </span>
                <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-foreground" title={product.name}>{product.name}</p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1"><span className="text-[11px] font-semibold tabular-nums">Còn {product.stock} chiếc</span><InventoryHealthBadge health={health} /></div>
                    {health?.days_of_cover != null && <p className="mt-1 text-[10px] text-muted-foreground">{inventoryCoverText(health)} · Nhập {health.lead_days} + dự phòng {health.safety_days} ngày</p>}
                    {health?.level === 'insufficient' && <p className="mt-1 text-[10px] text-muted-foreground" title={inventoryReasonText(health)}>{health.reason === 'short_history' ? 'Chưa đủ 14 ngày quan sát.' : 'Chưa đủ 3 chiếc bán trong kỳ.'}</p>}
                </div>
                <ArrowUpRight size={12} className="shrink-0 text-muted-foreground" aria-hidden="true" />
            </div>
        </Link>
    );
}
