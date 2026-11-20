import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import voucherApi from '../api/voucher.api';

// Một lựa chọn dùng chung giỏ hàng → checkout; kết quả cũ không được giảm vào tổng mới.
export default function useVoucherSelection(total, owner) {
    const [voucherCode, setVoucherCode] = useState('');
    const [request, setRequest] = useState({ code: '', attempt: 0 });
    const [result, setResult] = useState(null);
    const key = `${request.code}:${request.attempt}:${total}:${owner}`;
    useEffect(() => {
        if (!request.code || total <= 0) return;
        let alive = true;
        voucherApi.validate(request.code, total).then((data) => {
            if (alive) setResult({ key, data });
        }).catch((error) => {
            if (!alive) return;
            setResult({ key, data: null });
            toast.error(error.response?.data?.message || error.message || 'Không thể áp dụng voucher.');
        });
        return () => { alive = false; };
    }, [key, request.code, total]);
    const current = total > 0 && result?.key === key ? result.data : null;
    const applyVoucher = (code) => {
        const selected = String(typeof code === 'string' ? code : voucherCode).trim().toUpperCase();
        if (!selected) return toast.error('Vui lòng nhập mã ưu đãi.');
        setVoucherCode(selected);
        setRequest((prev) => ({ code: selected, attempt: prev.attempt + 1 }));
    };
    const removeVoucher = () => { setRequest({ code: '', attempt: 0 }); setVoucherCode(''); setResult(null); };
    const revalidateVoucher = () => setRequest((prev) => prev.code ? { ...prev, attempt: prev.attempt + 1 } : prev);
    return {
        voucherCode, setVoucherCode, applyVoucher, removeVoucher, revalidateVoucher,
        appliedVoucher: current?.valid ? current.voucher : null,
        discountAmount: current?.valid ? Number(current.discount_amount) || 0 : 0,
        applyingVoucher: Boolean(request.code && total > 0 && result?.key !== key),
    };
}
