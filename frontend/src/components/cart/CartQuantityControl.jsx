import { useId, useState } from 'react';
import QuantitySelector from '../products/detail/QuantitySelector';
import { productQuantityError } from '../../utils/productQuantity';

export default function CartQuantityControl({ quantity, stock, name, onCommit }) {
    const [draft, setDraft] = useState(String(quantity));
    const [busy, setBusy] = useState(false);
    const id = useId();
    const max = Math.min(stock ?? 99, 99);
    const error = productQuantityError(draft, stock ?? 99) || (Number(draft) > 99 ? 'Mỗi sản phẩm được chọn tối đa 99 chiếc.' : '');
    const commit = async (value = draft) => {
        if (busy || productQuantityError(value, stock ?? 99) || Number(value) > 99) return;
        if (Number(value) === quantity) { setDraft(String(quantity)); return; }
        setBusy(true);
        try { await onCommit(Number(value)); }
        finally { setDraft(String(quantity)); setBusy(false); }
    };
    const step = (delta) => {
        const next = String((error ? quantity : Number(draft)) + delta);
        setDraft(next);
        commit(next);
    };
    return <div className="contents">
        <label htmlFor={id} className="cart-quantity-label text-[10px] uppercase tracking-wider text-muted-foreground">Số lượng</label>
        <div className="cart-quantity-input">
        <QuantitySelector value={draft} onChange={setDraft} onStep={step} max={max} disabled={busy || max === 0} error={error} inputId={id} errorId={`${id}-error`} inputLabel={`Số lượng ${name}`} onBlur={() => commit()} onKeyDown={(event) => {
            if (event.key === 'Enter') { event.preventDefault(); commit(); }
            if (event.key === 'Escape') setDraft(String(quantity));
        }} />
        </div>
        {error && <p id={`${id}-error`} role="alert" className="cart-quantity-error text-xs leading-relaxed text-destructive">{error}</p>}
    </div>;
}
