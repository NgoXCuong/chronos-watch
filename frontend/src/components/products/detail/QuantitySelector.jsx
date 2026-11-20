import { Minus, Plus } from "lucide-react";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { cn } from "../../../lib/utils";

export default function QuantitySelector({ value, onChange, onStep, max, disabled, error, inputId, errorId, onBlur, onKeyDown, inputLabel = 'Số lượng sản phẩm' }) {
  return <div className={cn("inline-flex h-11 w-[138px] shrink-0 items-center overflow-hidden rounded-lg border bg-card", error ? "border-destructive" : "border-border")}>
    <Button variant="ghost" size="icon" type="button" aria-label="Giảm số lượng" className="h-11 w-9 shrink-0 rounded-none" disabled={disabled || Number(value) <= 1} onPointerDown={(e) => e.preventDefault()} onClick={() => onStep(-1)}><Minus size={14} /></Button>
    <div className="w-16 shrink-0"><Input id={inputId} type="text" inputMode="numeric" autoComplete="off" aria-label={inputLabel} aria-invalid={!!error} aria-describedby={error ? errorId : undefined} onBlur={onBlur} onKeyDown={onKeyDown}
      value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled}
      className="h-11 rounded-none border-0 px-1 text-center font-bold tabular-nums focus-visible:shadow-none" /></div>
    <Button variant="ghost" size="icon" type="button" aria-label="Tăng số lượng" className="h-11 w-9 shrink-0 rounded-none" disabled={disabled || Number(value) >= max} onPointerDown={(e) => e.preventDefault()} onClick={() => onStep(1)}><Plus size={14} /></Button>
  </div>;
}
