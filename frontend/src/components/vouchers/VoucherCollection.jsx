import { Ticket, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';
import VoucherCard from './VoucherCard';

export default function VoucherCollection({ items, loading, failed, reload, limit, onSelect }) {
    if (loading) return <div className="voucher-grid" aria-label="Đang tải voucher">{[0, 1, 2].map((i) => <div key={i} className="h-72 animate-pulse rounded-xl bg-muted" />)}</div>;
    if (failed) return <div className="voucher-notice"><RefreshCw size={25} /><p>Chưa tải được các mã ưu đãi.</p><Button variant="outline" size="sm" onClick={reload}>Thử lại</Button></div>;
    if (!items.length) return <div className="voucher-notice"><Ticket size={28} strokeWidth={1.5} /><p className="font-medium">Hiện chưa có voucher còn hiệu lực.</p><p className="text-xs text-muted-foreground">Các ưu đãi mới sẽ được cập nhật tại đây. Đăng nhập để xem thêm mã được tặng riêng.</p></div>;
    return <div className="voucher-grid">{items.slice(0, limit || items.length).map((v, i) => <VoucherCard key={v.id} voucher={v} onSelect={onSelect} recommended={Boolean(onSelect && i === 0 && v.eligible && v.discount_amount > 0)} />)}</div>;
}
