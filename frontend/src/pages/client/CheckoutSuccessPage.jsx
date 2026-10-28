import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Clock, RefreshCw, ShoppingBag, Truck } from 'lucide-react';
import { Button } from '../../components/ui/button';
import CheckoutSteps from '../../components/checkout/CheckoutSteps';
import OrderReceiptCard from '../../components/checkout/OrderReceiptCard';
import VietQrPanel from '../../components/checkout/VietQrPanel';
import orderApi from '../../api/order.api';
import paymentApi from '../../api/payment.api';
import { useAuth } from '../../hooks/useAuth';

const DELIVERIES = [
    { icon: Truck, text: 'Miễn phí giao hàng toàn quốc' },
    { icon: CheckCircle2, text: 'Kiểm tra hàng trước khi nhận' },
    { icon: RefreshCw, text: 'Đổi trả trong 7 ngày' },
];

/** Trang cảm ơn sau khi đặt đơn: hiển thị hóa đơn, mã VietQR nếu cần và poll trạng thái thanh toán. */
const CheckoutSuccessPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');
    const { isAuthenticated } = useAuth();

    const [order, setOrder] = useState(null);
    const [bankConfig, setBankConfig] = useState(null);
    const [loadedId, setLoadedId] = useState(null);

    useEffect(() => {
        if (!orderId) return undefined;
        let alive = true;
        Promise.all([orderApi.getOrderDetail(orderId), paymentApi.getBankConfig().catch(() => null)])
            .then(([orderRes, bankRes]) => {
                if (!alive) return;
                setOrder(orderRes.data || orderRes);
                setBankConfig(bankRes?.accountNo ? bankRes : null);
            })
            .catch((error) => console.error('Không tải được thông tin đơn hàng:', error))
            .finally(() => alive && setLoadedId(orderId));
        return () => {
            alive = false;
        };
    }, [orderId]);

    const needsTransfer =
        (order?.payment_method === 'sepay' || order?.payment_method === 'banking') && order?.payment_status !== 'paid';

    // SePay báo về webhook → đơn đổi trạng thái, trang tự cập nhật mà không cần tải lại
    useEffect(() => {
        if (!needsTransfer || !orderId) return undefined;
        const timer = setInterval(() => {
            orderApi
                .getOrderDetail(orderId)
                .then((res) => {
                    const fresh = res.data || res;
                    if (fresh.payment_status === 'paid') setOrder(fresh);
                })
                .catch(() => {});
        }, 3000);
        return () => clearInterval(timer);
    }, [needsTransfer, orderId]);

    const refetch = async () => {
        try {
            const res = await orderApi.getOrderDetail(orderId);
            setOrder(res.data || res);
        } catch (error) {
            console.error('Không cập nhật được trạng thái đơn:', error);
        }
    };

    if (!isAuthenticated) return <Navigate to="/login" />;
    if (loadedId !== orderId) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <div className="size-10 animate-spin rounded-full border-2 border-navy-200 border-t-navy-600" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
                <p className="text-sm text-muted-foreground">Không tìm thấy đơn hàng bạn vừa đặt.</p>
                <Button onClick={() => navigate('/products')} variant="buy">
                    Tiếp tục mua sắm
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-16">
            <header className="border-b border-border bg-card">
                <div className="mx-auto flex w-full justify-center px-12 py-5 md:px-16 lg:px-24">
                    <CheckoutSteps current={2} />
                </div>
            </header>

            <main className="mx-auto w-full max-w-3xl space-y-5 px-12 py-10 md:px-16">
                <section className="text-center">
                    <span
                        className={`mx-auto mb-4 flex size-16 items-center justify-center rounded-full ${
                            needsTransfer ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'
                        }`}
                    >
                        {needsTransfer ? (
                            <Clock size={30} strokeWidth={1.75} aria-hidden="true" />
                        ) : (
                            <CheckCircle2 size={30} strokeWidth={1.75} aria-hidden="true" />
                        )}
                    </span>
                    <h1 className="text-2xl font-bold text-foreground md:text-3xl">
                        {needsTransfer ? 'Đơn hàng đang chờ chuyển khoản' : order.payment_status === 'paid' ? 'Thanh toán thành công' : 'Đặt hàng thành công'}
                    </h1>
                    <p className="mx-auto mt-2 max-w-md text-[13px] leading-relaxed text-muted-foreground">
                        {needsTransfer
                            ? 'Quét mã VietQR bên dưới để hoàn tất. Đơn sẽ tự cập nhật ngay khi ngân hàng báo tiền về.'
                            : 'Cảm ơn bạn đã tin tưởng Chronos. Chúng tôi sẽ liên hệ xác nhận giao hàng trong thời gian sớm nhất.'}
                    </p>
                </section>

                <OrderReceiptCard order={order} />

                {needsTransfer && bankConfig && <VietQrPanel order={order} bankConfig={bankConfig} onConfirmed={refetch} />}

                <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <Button variant="outline" onClick={() => navigate('/products')} className="gap-2 sm:min-w-44">
                        <ShoppingBag size={16} strokeWidth={2} aria-hidden="true" />
                        Tiếp tục mua sắm
                    </Button>
                    <Button onClick={() => navigate('/orders')} className="gap-2 sm:min-w-44">
                        Theo dõi đơn hàng
                        <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
                    </Button>
                </div>

                <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 border-t border-border pt-6">
                    {DELIVERIES.map(({ icon: Icon, text }) => (
                        <li key={text} className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.02em] text-muted-foreground">
                            <Icon size={14} strokeWidth={2} className="text-navy-500" aria-hidden="true" />
                            {text}
                        </li>
                    ))}
                </ul>

                <p className="text-center text-xs text-muted-foreground">
                    Cần hỗ trợ? Gọi{' '}
                    <a href="tel:1900888866" className="font-semibold text-navy-600 hover:underline">
                        1900 8888 66
                    </a>
                </p>
            </main>
        </div>
    );
};

export default CheckoutSuccessPage;
