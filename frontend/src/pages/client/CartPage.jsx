import { Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import CheckoutSteps from '../../components/checkout/CheckoutSteps';
import CartItemRow from '../../components/cart/CartItemRow';
import CartSummary from '../../components/cart/CartSummary';
import CartReassurance from '../../components/cart/CartReassurance';
import EmptyCart from '../../components/cart/EmptyCart';
import '../../styles/storefront-pages.css';
import '../../styles/cart-page.css';

export default function CartPage() {
    const {
        cart, cartCount, removeFromCart, updateQuantity,
        listSubtotal, flashSavings, discountAmount, cartTotal,
        flashOf, unitPriceOf, isSyncing,
    } = useCart();

    if (cart.length === 0) return <EmptyCart />;

    return (
        <main className="atelier-shell cart-page">
            <header className="cart-page-heading">
                <div>
                    <p className="atelier-eyebrow">Lựa chọn của bạn</p>
                    <h1 className="atelier-title mt-3">Giỏ hàng<span className="cart-count">{cartCount}</span></h1>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Kiểm tra lựa chọn của bạn trước khi tiếp tục thanh toán.</p>
                </div>
                <div className="cart-steps"><CheckoutSteps current={0} /></div>
            </header>
            <div className="cart-layout">
                <section className="min-w-0" aria-label="Sản phẩm trong giỏ hàng">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <p className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                            <ShoppingBag size={15} aria-hidden="true" />
                            {isSyncing ? 'Đang đồng bộ giỏ hàng…' : `${cart.length} mẫu đồng hồ · ${cartCount} sản phẩm`}
                        </p>
                        <Link to="/products" className="atelier-text-link"><ArrowLeft /> Tiếp tục mua sắm</Link>
                    </div>
                    <div className="space-y-3">
                        {cart.map((item) => <CartItemRow key={item.id} item={item} flash={flashOf(item)} unitPrice={unitPriceOf(item)} onRemove={removeFromCart} onQuantityChange={updateQuantity} />)}
                    </div>
                    <div className="hidden lg:block"><CartReassurance /></div>
                </section>
                <div className="lg:sticky lg:top-24">
                    <CartSummary itemCount={cartCount} listSubtotal={listSubtotal} flashSavings={flashSavings} discountAmount={discountAmount} cartTotal={cartTotal} />
                </div>
                <div className="lg:hidden"><CartReassurance /></div>
            </div>
        </main>
    );
}
