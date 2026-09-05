import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { XCircle, CreditCard, Truck, Ban, ArrowLeft, PhoneCall, FileText } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useTheme } from '../../context/ThemeContext';
import orderApi from '../../api/order.api';
import { toast } from 'sonner';

const CheckoutFailPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const [retrying, setRetrying] = useState(false);
    const [switching, setSwitching] = useState(false);
    const [cancelling, setCancelling] = useState(false);

    const handleRetryVNPay = async () => {
        if (!orderId) {
            navigate('/cart');
            return;
        }
        setRetrying(true);
        try {
            const data = await orderApi.retryPayment(orderId);
            if (data.paymentUrl) {
                window.location.href = data.paymentUrl;
            } else {
                toast.error('Không tìm thấy đường dẫn thanh toán mới');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Không thể tạo lại liên kết thanh toán VNPay');
        } finally {
            setRetrying(false);
        }
    };

    const handleSwitchCOD = async () => {
        if (!orderId) return;
        setSwitching(true);
        try {
            await orderApi.switchCOD(orderId);
            toast.success('Đã chuyển sang phương thức thanh toán khi nhận hàng (COD)!');
            navigate(`/checkout/success?orderId=${orderId}`);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Không thể chuyển sang phương thức COD');
        } finally {
            setSwitching(false);
        }
    };

    const handleCancelOrder = async () => {
        if (!orderId) return;
        if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này? Số lượng tồn kho và mã giảm giá (nếu có) sẽ được hoàn trả.')) {
            return;
        }
        setCancelling(true);
        try {
            await orderApi.cancelOrder(orderId);
            toast.success('Đã hủy đơn hàng thành công');
            navigate('/orders');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Không thể hủy đơn hàng');
        } finally {
            setCancelling(false);
        }
    };

    return (
        <div className={`min-h-screen flex items-center justify-center py-20 px-4 ${isDark ? 'bg-[#080808]' : 'bg-white'}`}>
            <div className="max-w-[540px] w-full text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/10 text-red-500 mb-6">
                    <XCircle className="w-10 h-10" />
                </div>

                <h1 className={`text-3xl font-black uppercase mb-3 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                    Thanh toán thất bại
                </h1>

                <p className={`text-sm leading-relaxed mb-8 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    Rất tiếc, giao dịch thanh toán trực tuyến chưa hoàn tất hoặc bị gián đoạn.
                    {orderId ? (
                        <> Đơn hàng <span className="font-bold underline text-amber-500">#{orderId}</span> của bạn hiện đang ở trạng thái chờ.</>
                    ) : null}
                </p>

                {/* Common Reasons */}
                <div className={`p-5 rounded-2xl border mb-8 text-left space-y-3 ${isDark ? 'bg-zinc-900/40 border-white/5' : 'bg-zinc-50 border-zinc-100'}`}>
                    <p className={`text-[11px] uppercase font-bold tracking-wider ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                        Các nguyên nhân thường gặp:
                    </p>
                    <ul className={`text-xs space-y-1.5 list-disc pl-4 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                        <li>Thao tác thanh toán bị hủy bởi người dùng hoặc ngân hàng.</li>
                        <li>Số dư tài khoản hoặc thẻ tín dụng không đủ hạn mức.</li>
                        <li>Thông tin xác thực OTP / thẻ nhập chưa chính xác hoặc hết hạn.</li>
                    </ul>
                </div>

                {/* Recovery Actions */}
                <div className="flex flex-col gap-3">
                    {orderId ? (
                        <>
                            <Button
                                onClick={handleRetryVNPay}
                                loading={retrying}
                                disabled={switching || cancelling}
                                variant="primary"
                                className="h-13 rounded-xl font-bold uppercase text-xs shadow-lg shadow-amber-500/15"
                            >
                                <CreditCard className="w-4 h-4 mr-2" />
                                Thử thanh toán lại VNPay
                            </Button>

                            <Button
                                onClick={handleSwitchCOD}
                                loading={switching}
                                disabled={retrying || cancelling}
                                variant="secondary"
                                className="h-13 rounded-xl font-bold uppercase text-xs border border-white/10"
                            >
                                <Truck className="w-4 h-4 mr-2 text-amber-500" />
                                Chuyển sang nhận hàng trả tiền (COD)
                            </Button>

                            <div className="flex items-center justify-between gap-3 pt-2">
                                <Button
                                    onClick={handleCancelOrder}
                                    loading={cancelling}
                                    disabled={retrying || switching}
                                    variant="ghost"
                                    className="h-10 text-[11px] text-red-500 hover:text-red-400 hover:bg-red-500/10 px-3 rounded-lg"
                                >
                                    <Ban className="w-3.5 h-3.5 mr-1.5" />
                                    Hủy đơn hàng
                                </Button>

                                <Link
                                    to={`/orders/${orderId}`}
                                    className={`inline-flex items-center text-[11px] font-medium transition-colors hover:underline ${
                                        isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'
                                    }`}
                                >
                                    <FileText className="w-3.5 h-3.5 mr-1" />
                                    Chi tiết đơn hàng
                                </Link>
                            </div>
                        </>
                    ) : (
                        <Button
                            onClick={() => navigate('/products')}
                            variant="primary"
                            className="h-13 rounded-xl font-bold uppercase text-xs"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Tiếp tục mua sắm
                        </Button>
                    )}

                    <div className="pt-4 border-t border-white/5 flex justify-center gap-6 text-xs">
                        <Link
                            to="/orders"
                            className={`${isDark ? 'text-zinc-400 hover:text-amber-400' : 'text-zinc-600 hover:text-amber-600'} transition-colors`}
                        >
                            Quản lý đơn hàng
                        </Link>
                        <span className={isDark ? 'text-zinc-700' : 'text-zinc-300'}>|</span>
                        <a
                            href="tel:19001234"
                            className={`inline-flex items-center gap-1 ${isDark ? 'text-zinc-400 hover:text-amber-400' : 'text-zinc-600 hover:text-amber-600'} transition-colors`}
                        >
                            <PhoneCall className="w-3 h-3" /> Hotline hỗ trợ: 1900 1234
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutFailPage;
