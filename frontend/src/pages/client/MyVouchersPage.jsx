import { useNavigate } from 'react-router-dom';
import AccountLayout from '../../components/client/AccountLayout';
import VoucherCollection from '../../components/vouchers/VoucherCollection';
import usePublicVouchers from '../../hooks/usePublicVouchers';
import { useCart } from '../../hooks/useCart';
import '../../styles/vouchers.css';

export default function MyVouchersPage() {
    const navigate = useNavigate();
    const { cartSubtotal, applyVoucher } = useCart();
    const catalog = usePublicVouchers(cartSubtotal > 0 ? cartSubtotal : undefined, 'mine');
    return <AccountLayout title="Voucher của tôi" subtitle="Các ưu đãi được Chronos tặng riêng cho tài khoản của bạn.">
        {!catalog.loading && !catalog.failed && !catalog.items.length
            ? <div className="voucher-notice"><p className="font-semibold">Bạn chưa nhận được voucher riêng.</p><p className="text-sm text-muted-foreground">Khi được tặng, mã sẽ xuất hiện tại đây và trong danh sách chọn mã khi thanh toán.</p></div>
            : <VoucherCollection {...catalog} onSelect={cartSubtotal > 0 ? (code) => { applyVoucher(code); navigate('/cart'); } : undefined} />}
        <p className="mt-5 text-xs leading-relaxed text-muted-foreground">Voucher chỉ dùng bằng tài khoản được nhận. Việc nhận mã không giữ trước lượt sử dụng; mã hết hạn hoặc tạm ngưng được hiển thị kèm lý do.</p>
    </AccountLayout>;
}
