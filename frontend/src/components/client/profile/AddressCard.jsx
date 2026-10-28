import { useState } from "react";
import { Check, MapPin, Pencil, Star, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatAddress } from "@/utils/addresses";
import { cn } from "@/lib/utils";

const InfoRow = ({ icon: Icon, children }) => (
  <div className="flex items-baseline gap-2 text-[13px]">
    <Icon size={13} strokeWidth={2} className="shrink-0 translate-y-[2px] text-navy-300" aria-hidden="true" />
    <span className="min-w-0 leading-relaxed text-muted-foreground">{children}</span>
  </div>
);

/** Một địa chỉ trong sổ: mặc định nổi bật hơn, xóa có confirm nội dòng (không window.confirm). */
const AddressCard = ({ address, busy, onEdit, onDelete, onSetDefault }) => {
  const [askDelete, setAskDelete] = useState(false);
  const isDefault = Boolean(address.is_default);

  if (askDelete) {
    return (
      <div className="flex flex-col justify-center gap-3 rounded-xl border border-sale/30 bg-sale-soft p-4 text-center sm:flex-row sm:items-center sm:text-left">
        <p className="flex-1 text-[13px] font-medium text-sale">
          Xóa địa chỉ của {address.recipient_name}? Đơn đã đặt không bị ảnh hưởng.
        </p>
        <Button
          variant="destructive"
          size="sm"
          disabled={busy}
          onClick={() => onDelete(address.id)}
        >
          Xóa
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setAskDelete(false)}>
          Để lại
        </Button>
      </div>
    );
  }

  return (
    <article
      className={cn(
        "flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-card transition-colors",
        isDefault ? "border-navy-600/40 bg-navy-50/60 dark:bg-navy-500/10" : "border-border",
      )}
    >
      <header className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span
            className={cn(
              "flex size-9 items-center justify-center rounded-lg",
              isDefault ? "bg-navy-600 text-white" : "bg-navy-50 text-navy-500 dark:bg-navy-500/15",
            )}
          >
            <MapPin size={16} strokeWidth={2} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-foreground">{address.recipient_name}</p>
            <p className="text-[12px] tabular-nums text-muted-foreground">{address.recipient_phone}</p>
          </div>
        </div>
        {isDefault && (
          <Badge variant="brand" className="gap-1">
            <Star size={11} strokeWidth={2} aria-hidden="true" />
            Mặc định
          </Badge>
        )}
      </header>

      <div className="min-h-10">
        <InfoRow icon={MapPin}>{formatAddress(address) || "Chưa có địa chỉ"}</InfoRow>
      </div>

      <footer className="flex items-center justify-between gap-2 border-t border-border pt-3">
        {!isDefault ? (
          <Button
            variant="ghost"
            size="sm"
            disabled={busy}
            onClick={() => onSetDefault(address.id)}
            className="gap-1.5 text-navy-600 hover:text-navy-700"
          >
            <Check size={14} strokeWidth={2} aria-hidden="true" />
            Đặt làm mặc định
          </Button>
        ) : (
          <span className="text-[12px] text-muted-foreground">Dùng khi thanh toán</span>
        )}

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(address)}
            aria-label="Sửa địa chỉ"
            className="size-8 text-navy-600 hover:text-navy-700"
          >
            <Pencil size={14} strokeWidth={2} aria-hidden="true" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setAskDelete(true)}
            aria-label="Xóa địa chỉ"
            className="size-8 text-sale hover:text-sale"
          >
            <Trash2 size={14} strokeWidth={2} aria-hidden="true" />
          </Button>
        </div>
      </footer>
    </article>
  );
};

export default AddressCard;
