import { useState } from 'react';
import { ArrowUpRight, Watch } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '@/utils/formatCurrency';

function ProductImage({ product }) {
    const [failed, setFailed] = useState(false);
    return (
        <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-background">
            {product.image_url && !failed
                ? <img src={product.image_url} alt={product.name} loading="lazy" onError={() => setFailed(true)} className="size-full object-contain" />
                : <Watch className="size-7 text-muted-foreground" />}
        </div>
    );
}

export default function ChatProducts({ products }) {
    if (!products?.length) return null;
    return (
        <div className="mt-3 space-y-2" aria-label="Sản phẩm được gợi ý">
            {products.map(product => (
                <Link key={product.id} to={`/products/${product.slug}`}
                    className="group flex gap-3 rounded-xl border border-border bg-card p-2.5 no-underline shadow-card transition-colors hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                    <ProductImage product={product} />
                    <div className="min-w-0 flex-1">
                        <h3 className="line-clamp-2 text-xs font-medium leading-relaxed text-card-foreground">{product.name}</h3>
                        <p className="mt-1 text-sm font-bold tabular-nums text-primary">{formatCurrency(product.price)}</p>
                        <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-primary">Xem sản phẩm <ArrowUpRight className="size-3" /></span>
                    </div>
                </Link>
            ))}
        </div>
    );
}
