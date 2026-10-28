import { ArrowLeft, MessageSquare } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import CheckoutSteps from '../../components/checkout/CheckoutSteps';
import AddressSection from '../../components/checkout/AddressSection';
import PaymentMethodPicker from '../../components/checkout/PaymentMethodPicker';
import CheckoutSummary from '../../components/checkout/CheckoutSummary';
import { Textarea } from '../../components/ui/textarea';
import { useCart } from '../../context/CartContext';
import { useCheckout } from '../../hooks/useCheckout';

/**
 * Trang thanh toán: mọi logic nằm trong useCheckout, trang chỉ ghép ba khối
 * (giao nhận · ghi chú · phương thức) cạnh bảng tóm tắt đơn.
 */
const CheckoutPage = () => {
    const checkout = useCheckout();
    const { unitPriceOf } = useCart();

    if (!checkout.isAuthenticated) return <Navigate to="/login" />;
    // Đơn đã tạo thành công thì cart trống không được đá ngược về giỏ hàng
    if (checkout.cart.length === 0 && !checkout.orderPlaced) return <Navigate to="/cart" />;

    return (
        <div className="min-h-screen bg-background pb-16">
            <header className="border-b border-border bg-card">
                <div className="mx-auto flex w-full flex-wrap items-center justify-between gap-3 px-12 py-5 md:px-16 lg:px-24">
                    <Link
                        to="/cart"
                        className="flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.02em] text-muted-foreground transition-colors hover:text-navy-600"
                    >
                        <ArrowLeft size={14} strokeWidth={2} aria-hidden="true" />
                        Quay lại giỏ hàng
                    </Link>
                    <CheckoutSteps current={1} />
                </div>
            </header>

            <main className="mx-auto grid w-full items-start gap-6 px-12 py-8 md:px-16 lg:grid-cols-[minmax(0,1fr)_380px] lg:px-24">
                <div className="min-w-0 space-y-5">
                    <AddressSection
                        addresses={checkout.addresses}
                        selectedAddressId={checkout.selectedAddressId}
                        onSelect={checkout.setSelectedAddressId}
                        useNewAddress={checkout.useNewAddress}
                        onUseNewAddress={() => checkout.setUseNewAddress(true)}
                        onUseSaved={() => checkout.setUseNewAddress(false)}
                        formData={checkout.formData}
                        setFormField={checkout.setFormField}
                    />

                    <section className="rounded-xl border border-border bg-card p-5 shadow-card">
                        <h2 className="mb-3 flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.02em] text-navy-700">
                            <MessageSquare size={16} strokeWidth={2} className="text-navy-500" aria-hidden="true" />
                            Ghi chú cho đơn hàng
                        </h2>
                        <Textarea
                            value={checkout.orderNote}
                            onChange={(event) => checkout.setOrderNote(event.target.value)}
                            placeholder="Ví dụ: giao giờ hành chính, gọi trước khi đến..."
                            rows={3}
                        />
                    </section>

                    <PaymentMethodPicker value={checkout.paymentMethod} onChange={checkout.setPaymentMethod} />
                </div>

                <div className="lg:sticky lg:top-24">
                    <CheckoutSummary
                        cart={checkout.cart}
                        unitPriceOf={unitPriceOf}
                        cartSubtotal={checkout.cartSubtotal}
                        shippingFee={checkout.shippingFee}
                        discountAmount={checkout.discountAmount}
                        total={checkout.total}
                        submitting={checkout.submitting}
                        onSubmit={checkout.placeOrder}
                        voucherCode={checkout.voucherCode}
                        setVoucherCode={checkout.setVoucherCode}
                        appliedVoucher={checkout.appliedVoucher}
                        applyingVoucher={checkout.applyingVoucher}
                        applyVoucher={checkout.applyVoucher}
                        removeVoucher={checkout.removeVoucher}
                    />
                </div>
            </main>
        </div>
    );
};

export default CheckoutPage;
