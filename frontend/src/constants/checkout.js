/** Ba bước của luồng mua hàng — CartPage (current 0) và CheckoutPage (current 1) đánh dấu bước hiện tại. */
export const CHECKOUT_STEPS = ['Giỏ hàng', 'Giao nhận', 'Thanh toán'];

/** Phương thức thanh toán khách chọn được. Backend còn `banking`/`vnpay` (ENUM) nhưng UI không mở. */
export const PAYMENT_METHODS = [
    {
        id: 'cod',
        label: 'Thanh toán khi nhận hàng (COD)',
        desc: 'Kiểm tra hàng rồi trả tiền mặt cho nhân viên giao hàng.',
    },
    {
        id: 'sepay',
        label: 'Chuyển khoản ngân hàng (VietQR)',
        desc: 'Quét mã VietQR bằng ứng dụng ngân hàng bất kỳ. Hệ thống tự xác nhận đơn sau vài giây.',
    },
];

export const PAYMENT_LABEL = {
    cod: 'Thanh toán khi nhận hàng',
    sepay: 'Chuyển khoản VietQR',
    banking: 'Chuyển khoản ngân hàng',
    vnpay: 'VNPay',
};
