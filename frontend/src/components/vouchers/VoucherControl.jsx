import { useState } from 'react';
import { BadgePercent, ChevronRight, X } from 'lucide-react';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle } from '../ui/sheet';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useCart } from '../../hooks/useCart';
import usePublicVouchers from '../../hooks/usePublicVouchers';
import VoucherCollection from './VoucherCollection';
import '../../styles/vouchers.css';

function VoucherOptions({ total, onSelect }) {
    const catalog = usePublicVouchers(total, 'available');
    return <div className="voucher-picker-list min-h-0 flex-1 overflow-y-auto p-5"><VoucherCollection {...catalog} onSelect={onSelect} /></div>;
}

export default function VoucherControl() {
    const [open, setOpen] = useState(false);
    const { cartSubtotal, voucherCode, setVoucherCode, appliedVoucher, applyingVoucher, applyVoucher, removeVoucher } = useCart();
    return (
        <div className="space-y-3">
            <Button type="button" variant="outline" className="w-full justify-between normal-case" onClick={() => setOpen(true)}><span className="inline-flex items-center gap-2"><BadgePercent size={17} />Chọn mã giảm giá</span><ChevronRight size={15} /></Button>
            {applyingVoucher && <p role="status" className="text-xs text-muted-foreground">Đang kiểm tra mã ưu đãi…</p>}
            {appliedVoucher && <div className="flex items-center justify-between gap-2 rounded-lg border border-border bg-muted px-3 py-2"><span className="font-mono text-sm font-semibold">{appliedVoucher.code}</span><Button type="button" variant="ghost" size="sm" onClick={removeVoucher} aria-label="Bỏ mã giảm giá"><X size={14} />Bỏ mã</Button></div>}
            {!appliedVoucher && <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); applyVoucher(); }}><Input value={voucherCode} onChange={(e) => setVoucherCode(e.target.value)} placeholder="Nhập mã ưu đãi" aria-label="Mã ưu đãi" autoComplete="off" className="min-w-0 flex-1" /><Button type="submit" variant="secondary" disabled={applyingVoucher}>Áp dụng</Button></form>}
            <Sheet open={open} onOpenChange={setOpen}><SheetContent>
                <header className="flex items-start justify-between gap-3 border-b border-border p-5"><div><SheetTitle>Voucher cho đơn hàng của bạn</SheetTitle><SheetDescription className="mt-2">Mã dùng được xếp trước, ưu tiên mức giảm thực tế cao nhất. Lượt dùng sẽ được kiểm tra lại khi đặt đơn.</SheetDescription></div><SheetClose /></header>
                {open && <VoucherOptions total={cartSubtotal} onSelect={(code) => { applyVoucher(code); setOpen(false); }} />}
                <p className="border-t border-border p-5 text-xs leading-relaxed text-muted-foreground">Voucher được tặng riêng cũng xuất hiện trong danh sách này khi bạn đăng nhập đúng tài khoản nhận mã.</p>
            </SheetContent></Sheet>
        </div>
    );
}
