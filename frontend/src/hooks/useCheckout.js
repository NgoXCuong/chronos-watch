import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import orderApi from '../api/order.api';
import userAddressApi from '../api/user_address.api';
import voucherApi from '../api/voucher.api';
import { useCart } from '../context/CartContext';
import { useAuth } from './useAuth';

const emptyAddressForm = (user) => ({
    recipient_name: user?.full_name || '',
    recipient_phone: user?.phone || '',
    address_line: '',
    ward: '',
    district: '',
    city: '',
});

/**
 * Toàn bộ nghiệp vụ trang thanh toán: địa chỉ đã lưu / nhập mới, voucher, đặt đơn.
 * Trang chỉ còn ghép giao diện, không giữ logic riêng.
 */
export function useCheckout() {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();
    const { cart, cartSubtotal, shippingFee, clearCart } = useCart();

    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [useNewAddress, setUseNewAddress] = useState(false);
    const [formData, setFormData] = useState(() => emptyAddressForm(user));
    const [orderNote, setOrderNote] = useState('');

    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [voucherCode, setVoucherCode] = useState('');
    const [appliedVoucher, setAppliedVoucher] = useState(null);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [applyingVoucher, setApplyingVoucher] = useState(false);

    const [submitting, setSubmitting] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) return undefined;
        let alive = true;
        userAddressApi
            .getAll()
            .then((res) => {
                if (!alive) return;
                const list = res.data || res;
                setAddresses(list);
                if (list.length === 0) {
                    setUseNewAddress(true);
                    return;
                }
                setSelectedAddressId((list.find((a) => a.is_default) || list[0]).id);
            })
            .catch(() => alive && toast.error('Không thể tải danh sách địa chỉ'));
        return () => {
            alive = false;
        };
    }, [isAuthenticated]);

    const total = Math.max(0, cartSubtotal + shippingFee - discountAmount);

    const setFormField = (name) => (event) => setFormData((prev) => ({ ...prev, [name]: event.target.value }));

    const applyVoucher = async () => {
        const code = voucherCode.trim();
        if (!code) return toast.error('Vui lòng nhập mã ưu đãi');
        setApplyingVoucher(true);
        try {
            const res = await voucherApi.validate(code, cartSubtotal);
            if (res.valid) {
                setAppliedVoucher(res.voucher);
                setDiscountAmount(res.discount_amount || 0);
                toast.success('Đã áp dụng mã ưu đãi');
            }
        } catch (error) {
            const msg = error.response?.data?.message || error.message || 'Mã không hợp lệ hoặc đã hết hạn';
            toast.error(msg);
            setAppliedVoucher(null);
            setDiscountAmount(0);
        } finally {
            setApplyingVoucher(false);
        }
    };

    const removeVoucher = () => {
        setAppliedVoucher(null);
        setDiscountAmount(0);
        setVoucherCode('');
    };

    const validate = () => {
        if (useNewAddress) {
            const { recipient_name, recipient_phone, address_line, city } = formData;
            if (!recipient_name || !recipient_phone || !address_line || !city) {
                toast.error('Vui lòng điền họ tên, số điện thoại, địa chỉ chi tiết và tỉnh/thành');
                return false;
            }
            return true;
        }
        if (!selectedAddressId) {
            toast.error('Vui lòng chọn hoặc thêm địa chỉ giao hàng');
            return false;
        }
        return true;
    };

    const placeOrder = async () => {
        const unavailable = cart.find((item) => item.status && item.status !== 'active');
        if (unavailable) {
            toast.error(`Sản phẩm "${unavailable.name}" đã ngừng bán. Vui lòng xóa khỏi giỏ hàng.`);
            return;
        }
        if (!validate()) return;
        setSubmitting(true);
        try {
            const res = await orderApi.checkout({
                order_note: orderNote,
                payment_method: paymentMethod,
                shipping_fee: shippingFee,
                address_id: useNewAddress ? null : selectedAddressId,
                voucher_code: appliedVoucher ? appliedVoucher.code : undefined,
                ...(useNewAddress
                    ? {
                          full_name: formData.recipient_name,
                          phone_number: formData.recipient_phone,
                          address_line: formData.address_line,
                          ward: formData.ward,
                          district: formData.district,
                          city: formData.city,
                      }
                    : {}),
            });

            const result = res.data || res;
            if (!result?.order?.id) throw new Error('Đơn hàng không được tạo');

            toast.success('Đặt hàng thành công');
            setOrderPlaced(true); // đơn đã tạo → không đá về giỏ hàng khi cart trống
            await clearCart();
            navigate(`/checkout/success?orderId=${result.order.id}`);
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || 'Có lỗi xảy ra khi đặt hàng');
            setSubmitting(false);
        }
    };

    return {
        isAuthenticated,
        cart,
        cartSubtotal,
        shippingFee,
        discountAmount,
        total,
        addresses,
        selectedAddressId,
        setSelectedAddressId,
        useNewAddress,
        setUseNewAddress,
        formData,
        setFormField,
        orderNote,
        setOrderNote,
        paymentMethod,
        setPaymentMethod,
        voucherCode,
        setVoucherCode,
        appliedVoucher,
        applyingVoucher,
        applyVoucher,
        removeVoucher,
        submitting,
        orderPlaced,
        placeOrder,
    };
}
