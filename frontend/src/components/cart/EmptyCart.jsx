import { Link } from 'react-router-dom';
import { ArrowUpRight, ShoppingBag } from 'lucide-react';
import { buttonVariants } from '../ui/button-variants';
import CartReassurance from './CartReassurance';

export default function EmptyCart() {
    return (
        <main className="atelier-shell py-10 md:py-16">
            <div className="cart-empty rounded-xl border border-border bg-card px-6 py-14 text-center md:py-20">
                <span className="mx-auto mb-8 flex size-24 items-center justify-center rounded-full border border-border bg-muted/60 text-primary"><ShoppingBag size={36} strokeWidth={1.4} aria-hidden="true" /></span>
                <p className="text-[10px] font-semibold uppercase tracking-[.2em] text-muted-foreground">Một lựa chọn mới đang chờ</p>
                <h1 className="atelier-title mt-4">Giỏ hàng của bạn đang trống.</h1>
                <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-muted-foreground">Khám phá những thiết kế dành cho phong cách của bạn và chọn chiếc đồng hồ cho khoảnh khắc tiếp theo.</p>
                <Link to="/products" className={buttonVariants({ size: 'lg', className: 'mt-7' })}>Khám phá đồng hồ <ArrowUpRight size={16} /></Link>
            </div>
            <CartReassurance />
        </main>
    );
}
