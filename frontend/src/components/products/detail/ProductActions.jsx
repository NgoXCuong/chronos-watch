import { useId, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, Zap, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../../ui/button";
import { useCart } from "../../../hooks/useCart";
import { useWishlist } from "../../../hooks/useWishlist";
import { productQuantityError } from "../../../utils/productQuantity";
import QuantitySelector from "./QuantitySelector";

export default function ProductActions({ product, quantity, setQuantity }) {
  const navigate = useNavigate();
  const { addToCart, cart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [busy, setBusy] = useState(false);
  const inputId = useId();
  const errorId = `${inputId}-error`;
  const stock = Math.max(0, Math.floor(Number(product.stock) || 0));
  const outOfStock = stock <= 0;
  const productId = product.id ?? product._id;
  const already = Number(cart.find((item) => String(item.id) === String(productId))?.quantity) || 0;
  const maxQty = Math.max(0, stock - already);
  const wished = isInWishlist(productId);
  const error = outOfStock ? "" : productQuantityError(quantity, stock, already);
  const blocked = outOfStock || busy || !!error;

  const step = (delta) => {
    const current = Math.floor(Number(quantity));
    const base = Number.isSafeInteger(current) ? Math.min(maxQty, Math.max(1, current)) : 1;
    setQuantity(String(Math.min(Math.max(1, maxQty), Math.max(1, base + delta))));
  };
  const buy = async (goToCart) => {
    if (busy) return;
    const warning = productQuantityError(quantity, stock, already);
    if (warning) { toast.warning(warning); return; }
    setBusy(true);
    try {
      const added = await addToCart(product, Number(quantity));
      if (added && goToCart) navigate("/cart");
    } finally { setBusy(false); }
  };

  return <div className="mt-5 space-y-3 border-t border-border pt-5">
    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
      <label htmlFor={inputId} className="font-semibold text-foreground">Số lượng</label>
      {already > 0 && <span className="text-muted-foreground">Đã có {already} sản phẩm trong giỏ</span>}
    </div>
    <div className="flex flex-wrap items-stretch gap-3">
      <QuantitySelector inputId={inputId} errorId={errorId} value={quantity} onChange={setQuantity} onStep={step} max={maxQty} disabled={outOfStock || busy || maxQty === 0} error={error} />
      <Button variant="buy" disabled={blocked} onClick={() => buy(false)} className="h-11 min-w-[160px] flex-1"><ShoppingCart size={16} />{outOfStock ? "Hết hàng" : busy ? "Đang thêm…" : "Thêm vào giỏ"}</Button>
      <Button variant="outline" size="icon" type="button" onClick={() => toggleWishlist(product)} aria-pressed={wished} aria-label={wished ? "Bỏ khỏi yêu thích" : "Thêm vào yêu thích"} className="size-11"><Heart size={18} className={wished ? "fill-current" : undefined} /></Button>
    </div>
    {error && <p id={errorId} role="alert" className="flex items-start gap-2 rounded-lg border border-destructive/25 bg-destructive/5 px-3 py-2 text-xs leading-relaxed text-destructive"><AlertCircle size={15} className="mt-0.5 shrink-0" />{error}</p>}
    <Button disabled={blocked} onClick={() => buy(true)} className="h-12 w-full text-[13px]"><Zap size={16} />Mua ngay</Button>
  </div>;
}
