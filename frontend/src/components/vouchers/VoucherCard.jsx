import { Copy, TicketPercent } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { formatCurrency } from '../../utils/formatCurrency';

export default function VoucherCard({ voucher, onSelect, recommended = false }) {
    const v = voucher;
    const copy = async () => {
        try { await navigator.clipboard.writeText(v.code); toast.success(`Đã sao chép mã ${v.code}`); }
        catch { toast.error('Không thể sao chép tự động. Bạn có thể chọn và sao chép mã bên trên.'); }
    };
    return (
        <article className="voucher-card">
            <div className="voucher-ticket-value"><TicketPercent size={24} strokeWidth={1.5} aria-hidden="true" /><span>ƯU ĐÃI</span><strong>{v.discount_type === 'percentage' ? `${Number(v.discount_value)}%` : formatCurrency(v.discount_value)}</strong><small>CHRONOS WATCH</small></div>
            <div className="voucher-ticket-body">
            <div className="voucher-card-top"><h3 className="text-sm font-semibold">{v.gifted ? 'Dành riêng cho bạn' : 'Ưu đãi mua sắm'}</h3><span className="voucher-code">{v.code}</span></div>
            {recommended && <p className="mt-2 text-xs font-semibold text-foreground">Gợi ý tiết kiệm nhiều nhất</p>}
            <p className="mt-2 text-sm text-muted-foreground">{Number(v.min_order_value) > 0 ? `Đơn từ ${formatCurrency(v.min_order_value)}` : 'Không yêu cầu giá trị đơn tối thiểu'}</p>
            {v.discount_type === 'percentage' && Number(v.max_discount) > 0 && <p className="mt-1 text-xs text-muted-foreground">Giảm tối đa {formatCurrency(v.max_discount)}</p>}
            <p className="mt-3 text-[11px] text-muted-foreground">Hết hạn {new Date(v.end_date).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
            <details className="mt-3 text-xs text-muted-foreground"><summary className="cursor-pointer text-foreground">Điều kiện sử dụng</summary><div className="mt-2 space-y-1 leading-relaxed"><p>Áp dụng cho tổng giá sản phẩm sau ưu đãi Flash Sale. Mỗi đơn dùng một mã.</p><p>{Number(v.per_user_limit) > 0 ? `Tối đa ${v.per_user_limit} lượt/người.` : 'Không giới hạn lượt dùng mỗi người.'}</p><p>{v.remaining == null ? 'Không giới hạn tổng lượt.' : `Còn ${v.remaining} lượt sử dụng.`}</p></div></details>
            <div className="voucher-card-action">
                {onSelect && v.eligible && <p className="mb-3 text-sm font-semibold text-sale">Đơn này giảm {formatCurrency(v.discount_amount)}</p>}
                {v.reason && <p className="mb-3 text-xs leading-relaxed text-muted-foreground">{v.reason}</p>}
                <Button type="button" variant={onSelect ? 'default' : 'outline'} className="w-full" disabled={Boolean(v.unavailable || (onSelect && !v.eligible))} onClick={() => onSelect ? onSelect(v.code) : copy()}>
                    {onSelect ? (v.eligible ? 'Áp dụng mã' : 'Chưa đủ điều kiện') : <><Copy size={15} />Sao chép mã</>}
                </Button>
            </div>
            </div>
        </article>
    );
}
