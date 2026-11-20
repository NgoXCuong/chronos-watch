import { Link } from 'react-router-dom';
import { ArrowUpRight, Boxes } from 'lucide-react';
import InventoryHealthBadge from '../Common/InventoryHealthBadge';
import { inventoryCoverText, inventoryReasonText } from '../../../constants/inventoryPlanning';

export default function StockAlertRow({ product }) {
    const health = product.inventory_health;
    return (
        <Link to={`/admin/products/edit/${product.id}`} className="group block rounded-lg border border-border bg-card p-2.5 transition-colors hover:bg-accent/50">
            <div className="flex items-start gap-2.5">
                <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">
                    {product.image_url ? <img src={product.image_url} alt="" loading="lazy" className="size-full object-contain" /> : <Boxes size={19} className="text-muted-foreground" />}
                </span>
                <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-xs font-semibold text-foreground" title={product.name}>{product.name}</p>
                    <p className="mt-1 text-[11px] tabular-nums text-muted-foreground">Còn {product.stock} chiếc{health?.days_of_cover != null ? ` · ${inventoryCoverText(health)}` : ''}</p>
                </div>
                <ArrowUpRight size={13} className="shrink-0 text-muted-foreground" aria-hidden="true" />
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
                <InventoryHealthBadge health={health} />
                {health?.days_of_cover != null && <span className="text-[10px] text-muted-foreground">Nhập {health.lead_days} + dự phòng {health.safety_days} ngày</span>}
            </div>
            {health?.level === 'insufficient' && <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">{inventoryReasonText(health)}</p>}
        </Link>
    );
}
