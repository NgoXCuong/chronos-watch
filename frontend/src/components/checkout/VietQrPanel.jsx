import { useState } from 'react';
import { BadgeCheck, CircleAlert, CreditCard, QrCode } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import paymentApi from '../../api/payment.api';
import { formatCurrency } from '../../utils/formatCurrency';

const BankRow = ({ label, value, strong }) => (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border py-2 last:border-b-0">
        <span className="text-[12px] font-semibold uppercase tracking-[0.02em] text-muted-foreground">{label}</span>
        <span className={strong ? 'select-all font-mono text-sm font-bold text-navy-700' : 'select-all font-mono text-sm text-foreground'}>{value}</span>
    </div>
);

/**
 * Hướng dẫn chuyển khoản: mã VietQR động (qr.sepay.vn) + thông tin thụ hưởng,
 * kèm nút xác nhận thủ công cho trường hợp chuyển tiền ngoài ứng dụng.
 */
const VietQrPanel = ({ order, bankConfig, onConfirmed }) => {
    const [confirming, setConfirming] = useState(false);
    const transferCode = order.order_code || `CHRONOS${order.id}`;

    const confirm = async () => {
        setConfirming(true);
        try {
            await paymentApi.confirmSePayPayment(order.id);
            toast.success('Đã ghi nhận xác nhận thanh toán');
            await onConfirmed?.();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Không xác nhận được, vui lòng thử lại');
        } finally {
            setConfirming(false);
        }
    };

    return (
        <section className="rounded-xl border border-navy-200 bg-navy-50/60 p-5 shadow-card">
            <h2 className="mb-4 flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.02em] text-navy-700">
                <CreditCard size={16} strokeWidth={2} aria-hidden="true" />
                Hướng dẫn chuyển khoản
            </h2>

            <div className="flex flex-col items-center gap-5 md:flex-row md:items-start">
                <div className="shrink-0 rounded-xl border border-border bg-white p-3 shadow-card">
                    <img
                        src={`${bankConfig.qrBaseUrl || 'https://qr.sepay.vn/img'}?acc=${bankConfig.accountNo}&bank=${bankConfig.bankId}&amount=${order.total_amount}&des=${encodeURIComponent(transferCode)}&template=compact`}
                        alt="Mã VietQR cho đơn hàng"
                        width={200}
                        height={200}
                        className="size-48 object-contain sm:size-52"
                    />
                    <p className="mt-2 flex items-center justify-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.02em] text-navy-600">
                        <QrCode size={13} strokeWidth={2} aria-hidden="true" />
                        Quét bằng app ngân hàng
                    </p>
                </div>

                <div className="w-full min-w-0 flex-1 space-y-4">
                    <div className="rounded-xl border border-border bg-card p-4">
                        <BankRow label="Ngân hàng" value={bankConfig.bankId} />
                        <BankRow label="Số tài khoản" value={bankConfig.accountNo} strong />
                        <BankRow label="Chủ tài khoản" value={bankConfig.accountName} />
                        <BankRow label="Nội dung CK" value={transferCode} strong />
                        <BankRow label="Số tiền" value={formatCurrency(order.total_amount)} strong />
                    </div>

                    <Button onClick={confirm} loading={confirming} className="w-full gap-2">
                        <BadgeCheck size={16} strokeWidth={2} aria-hidden="true" />
                        Tôi đã chuyển khoản — xác nhận ngay
                    </Button>

                    <p className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
                        <CircleAlert size={14} strokeWidth={2} className="mt-0.5 shrink-0 text-warning" aria-hidden="true" />
                        Đơn tự động chuyển sang “đã thanh toán” sau khi SePay báo về. Nếu chuyển thủ công, giữ đúng nội dung chuyển khoản để hệ thống đối soát.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default VietQrPanel;
