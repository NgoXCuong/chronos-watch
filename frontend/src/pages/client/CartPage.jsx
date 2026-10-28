import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Button } from '../../components/ui/button';
import CheckoutSteps from '../../components/checkout/CheckoutSteps';
import CartItemRow from '../../components/cart/CartItemRow';
import CartSummary from '../../components/cart/CartSummary';

const EmptyCart = () => (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-3 px-6 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-navy-50 text-navy-500">
            <ShoppingBag size={24} strokeWidth={2} aria-hidden="true" />
        </span>
        <h1 className="text-2xl font-bold text-foreground">Giỏ hàng đang trống</h1>
        <p className="max-w-md text-sm text-muted-foreground">
            Chưa có sản phẩm nào được giữ lại. Duyệt bộ sưu tập để thêm chiếc đồng hồ bạn đang tìm.
        </p>
        <Link to="/products" className="mt-3">
            <Button size="lg">Xem tất cả sản phẩm</Button>
        </Link>
    </div>
);

const CartPage = () => {
    const {
        cart, cartCount, removeFromCart, updateQuantity,
        listSubtotal, flashSavings, discountAmount, shippingFee, cartTotal,
        flashOf, unitPriceOf, isSyncing,
    } = useCart();

    if (cart.length === 0) return <EmptyCart />;

    return (
        <div className="min-h-screen bg-background">
            <header className="border-b border-border bg-card">
                <div className="mx-auto flex w-full flex-wrap items-center justify-between gap-3 px-12 py-4 md:px-16 lg:px-24">
                    <h1 className="text-lg font-bold text-navy-700 md:text-xl">
                        Giỏ hàng <span className="tabular-nums text-muted-foreground">({cartCount})</span>
                    </h1>
                    <CheckoutSteps current={0} />
                </div>
            </header>

            <main className="mx-auto grid w-full items-start gap-6 px-12 py-6 md:px-16 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-24 xl:grid-cols-[minmax(0,1fr)_400px]">
                <section className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                        <p className="text-[12px] font-semibold uppercase tracking-[0.02em] text-muted-foreground">
                            {isSyncing ? 'Đang đồng bộ giỏ hàng...' : `${cart.length} mặt hàng đang chờ`}
                        </p>
                        <Link to="/products" className="flex items-center gap-1.5 text-[13px] font-semibold text-navy-600 transition-colors hover:text-navy-700">
                            <ArrowLeft size={14} strokeWidth={2} aria-hidden="true" />
                            Tiếp tục mua sắm
                        </Link>
                    </div>

                    {cart.map((item) => (
                        <CartItemRow
                            key={item.id}
                            item={item}
                            flash={flashOf(item)}
                            unitPrice={unitPriceOf(item)}
                            onRemove={removeFromCart}
                            onQuantityChange={updateQuantity}
                        />
                    ))}
                </section>

                <div className="lg:sticky lg:top-24">
                    <CartSummary
                        itemCount={cartCount}
                        listSubtotal={listSubtotal}
                        flashSavings={flashSavings}
                        discountAmount={discountAmount}
                        shippingFee={shippingFee}
                        cartTotal={cartTotal}
                    />
                </div>
            </main>
        </div>
    );
};

export default CartPage;
