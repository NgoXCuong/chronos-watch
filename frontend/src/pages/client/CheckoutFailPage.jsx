import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, Ban, CreditCard, FileText, PhoneCall, Truck, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../../components/ui/button';
import orderApi from '../../api/order.api';

const REASONS = [
    'Bạn hoặc ngân hàng hủy thao tác xác thực.',
    'Số dư tài khoản / hạn mức thẻ không đủ.',
    'OTP nhập sai hoặc đã hết hạn.',
];

/** Đơn thanh toán online chưa hoàn tất: cho khách thử lại, đổi sang COD hoặc hủy đơn. */
const CheckoutFailPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');

    const [retrying, setRetrying] = useState(false);
    const [switching, setSwitching] = useState(false);
    const [cancelling, setCancelling] = useState(false);
    const [confirmCancel, setConfirmCancel] = useState(false);

    const run = async (setter, action, failureMessage) => {
        setter(true);
        try {
            await action();
        } catch (error) {
            toast.error(error.response?.data?.message || failureMessage);
        } finally {
            setter(false);
        }
    };

    const retryPayment = () =>
        run(setRetrying, async () => {
            const data = await orderApi.retryPayment(orderId);
            if (data.paymentData) {
                navigate(`/checkout/success?orderId=${orderId}`);
            } else {
                toast.error('Không tìm thấy thông tin thanh toán mới');
            }
        }, 'Không thể tạo lại thông tin thanh toán');

    const switchCOD = () =>
        run(setSwitching, async () => {
            await orderApi.switchCOD(orderId);
            toast.success('Đã chuyển đơn sang thanh toán khi nhận hàng');
            navigate(`/checkout/success?orderId=${orderId}`);
        }, 'Không thể chuyển sang phương thức COD');

    const cancelOrder = () =>
        run(setCancelling, async () => {
            await orderApi.cancelOrder(orderId);
            toast.success('Đã hủy đơn hàng');
            navigate('/orders');
        }, 'Không thể hủy đơn hàng');

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-6 py-16">
            <div className="w-full max-w-lg text-center">
                <span className="mb-5 inline-flex size-16 items-center justify-center rounded-full bg-sale/10 text-sale">
                    <XCircle size={32} strokeWidth={1.75} aria-hidden="true" />
                </span>

                <h1 className="text-2xl font-bold text-foreground md:text-3xl">Thanh toán chưa hoàn tất</h1>
                <p className="mx-auto mt-3 max-w-md text-[13px] leading-relaxed text-muted-foreground">
                    Giao dịch trực tuyến bị gián đoạn.
                    {orderId ? (
                        <>
                            {' '}
                            Đơn <span className="font-bold tabular-nums text-navy-700">#{orderId}</span> vẫn được giữ ở trạng thái chờ —
                            bạn có thể thanh toán lại hoặc đổi sang COD.
                        </>
                    ) : null}
                </p>

                <div className="mb-7 mt-6 rounded-xl border border-border bg-card p-4 text-left shadow-card">
                    <p className="text-[12px] font-bold uppercase tracking-[0.02em] text-navy-700">Nguyên nhân thường gặp</p>
                    <ul className="mt-2 list-disc space-y-1 pl-4 text-xs leading-relaxed text-muted-foreground">
                        {REASONS.map((reason) => (
                            <li key={reason}>{reason}</li>
                        ))}
                    </ul>
                </div>

                <div className="space-y-3">
                    {orderId ? (
                        <>
                            <Button onClick={retryPayment} loading={retrying} disabled={switching || cancelling} size="full">
                                <CreditCard size={16} strokeWidth={2} aria-hidden="true" />
                                Thử lại chuyển khoản VietQR
                            </Button>
                            <Button onClick={switchCOD} loading={switching} disabled={retrying || cancelling} variant="buy" size="full" className="gap-2">
                                <Truck size={16} strokeWidth={2} aria-hidden="true" />
                                Đổi sang thanh toán khi nhận hàng
                            </Button>

                            {confirmCancel ? (
                                <div className="flex items-center justify-center gap-3 rounded-xl border border-sale/30 bg-sale-soft px-3 py-2.5">
                                    <p className="text-xs font-medium text-sale">Hủy đơn? Kho và mã ưu đãi sẽ được hoàn lại.</p>
                                    <Button onClick={cancelOrder} loading={cancelling} variant="destructive" size="sm">
                                        Xác nhận
                                    </Button>
                                    <Button onClick={() => setConfirmCancel(false)} variant="ghost" size="sm">
                                        Để lại
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between gap-3 pt-1">
                                    <Button
                                        onClick={() => setConfirmCancel(true)}
                                        disabled={retrying || switching || cancelling}
                                        variant="ghost"
                                        size="sm"
                                        className="gap-1.5 text-sale hover:text-sale"
                                    >
                                        <Ban size={14} strokeWidth={2} aria-hidden="true" />
                                        Hủy đơn hàng
                                    </Button>
                                    <Link
                                        to={`/orders/${orderId}`}
                                        className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-muted-foreground transition-colors hover:text-navy-600"
                                    >
                                        <FileText size={14} strokeWidth={2} aria-hidden="true" />
                                        Chi tiết đơn hàng
                                    </Link>
                                </div>
                            )}
                        </>
                    ) : (
                        <Button onClick={() => navigate('/products')} variant="buy" size="full" className="gap-2">
                            <ArrowLeft size={16} strokeWidth={2} aria-hidden="true" />
                            Tiếp tục mua sắm
                        </Button>
                    )}

                    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t border-border pt-5 text-[12px] font-medium">
                        <Link to="/orders" className="text-muted-foreground transition-colors hover:text-navy-600">
                            Quản lý đơn hàng
                        </Link>
                        <span className="text-border">|</span>
                        <a href="tel:1900888866" className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-navy-600">
                            <PhoneCall size={13} strokeWidth={2} aria-hidden="true" />
                            Hotline 1900 8888 66
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutFailPage;
