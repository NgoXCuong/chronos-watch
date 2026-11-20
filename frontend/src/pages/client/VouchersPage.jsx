import { Link } from 'react-router-dom';
import { ArrowUpRight, TicketPercent } from 'lucide-react';
import usePublicVouchers from '../../hooks/usePublicVouchers';
import VoucherCollection from '../../components/vouchers/VoucherCollection';
import { buttonVariants } from '../../components/ui/button-variants';
import '../../styles/storefront-pages.css';
import '../../styles/vouchers.css';

export default function VouchersPage() {
    const catalog = usePublicVouchers();
    return <main className="atelier-shell voucher-page">
        <header className="voucher-hero"><div><p className="atelier-eyebrow">CHRONOS / THE OFFERS EDIT</p><h1 className="atelier-title mt-5">Thêm ưu đãi.<br />Trọn vẹn lựa chọn.</h1><p className="mt-5 max-w-lg text-sm leading-7 text-muted-foreground">Khám phá các mã giảm giá đang có tại Chronos. Điều kiện rõ ràng, lựa chọn dễ dàng và áp dụng trực tiếp trong giỏ hàng.</p><Link to="/products" className={buttonVariants({ className: 'mt-6', size: 'lg' })}>Khám phá đồng hồ <ArrowUpRight size={16} /></Link></div><div className="voucher-hero-note"><TicketPercent size={58} strokeWidth={1} aria-hidden="true" /><p className="mt-5 text-2xl font-medium tracking-tight">Một mã ưu đãi.<br />Một lựa chọn vừa ý.</p><p className="mt-3 text-sm leading-relaxed text-muted-foreground">Sao chép mã bạn thích, hoặc để giỏ hàng gợi ý mã tiết kiệm nhiều nhất cho đơn của bạn.</p></div></header>
        <section className="mt-10" aria-labelledby="voucher-catalog-title"><div className="mb-6 flex flex-wrap items-end justify-between gap-3"><h2 id="voucher-catalog-title" className="atelier-section-title">Voucher đang có</h2><p className="text-xs text-muted-foreground">{catalog.loading ? 'Đang cập nhật…' : `${catalog.items.length} mã công khai còn hiệu lực`}</p></div><VoucherCollection {...catalog} /></section>
        <p className="mt-8 border-t border-border pt-5 text-xs leading-relaxed text-muted-foreground">Mỗi đơn áp dụng một voucher. Giá trị giảm và lượt dùng được kiểm tra lại khi đặt hàng; sao chép mã không giữ trước lượt sử dụng.</p>
    </main>;
}
