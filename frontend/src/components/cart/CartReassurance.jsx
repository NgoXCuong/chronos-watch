import { Headphones, RotateCcw, ShieldCheck, Truck } from 'lucide-react';
import { HOTLINE, HOTLINE_TEL } from '../../constants/contact';

const SERVICES = [
    { icon: <ShieldCheck />, title: 'An tâm chính hãng', text: 'Phiếu bảo hành điện tử' },
    { icon: <Truck />, title: 'Miễn phí vận chuyển', text: 'Giao hàng trên toàn quốc' },
    { icon: <RotateCcw />, title: 'Đổi trả trong 7 ngày', text: 'Sản phẩm còn nguyên vẹn' },
];

export default function CartReassurance() {
    return (
        <div className="cart-reassurance">
            <div className="grid gap-5 sm:grid-cols-3">
                {SERVICES.map(({ icon, title, text }) => (
                    <div key={title} className="flex items-start gap-3">
                        <span className="text-primary [&>svg]:size-5" aria-hidden="true">{icon}</span>
                        <div><p className="text-xs font-semibold">{title}</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{text}</p></div>
                    </div>
                ))}
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-border pt-5 text-xs text-muted-foreground">
                <Headphones size={15} aria-hidden="true" /> Cần hỗ trợ lựa chọn?
                <a href={HOTLINE_TEL} className="font-semibold text-primary hover:underline">{HOTLINE}</a>
            </div>
        </div>
    );
}
