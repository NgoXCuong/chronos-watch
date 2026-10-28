import { useState } from "react";
import { MapPin, Plus } from "lucide-react";
import NoticeCard from "@/components/client/NoticeCard";
import AddressCard from "@/components/client/profile/AddressCard";
import AddressFormDialog from "@/components/client/profile/AddressFormDialog";
import { Button } from "@/components/ui/button";
import { EMPTY_ADDRESS } from "@/constants/addresses";
import { useMyAddresses } from "@/hooks/useMyAddresses";
import { toAddressForm } from "@/utils/addresses";

const AddButton = ({ onClick, children }) => (
  <Button size="sm" onClick={onClick} className="gap-1.5">
    <Plus size={14} strokeWidth={2} aria-hidden="true" />
    {children}
  </Button>
);

const CardSkeleton = () => (
  <div className="h-40 animate-pulse rounded-xl border border-border bg-muted/40" />
);

/** Sổ địa chỉ: card + dialog thêm/sửa; mọi thao tác ghi đi qua useMyAddresses. */
const AddressTab = () => {
  const { addresses, loading, saving, save, remove, setDefault } = useMyAddresses();
  // undefined = đóng dialog · null = thêm mới · object = sửa địa chỉ đó
  const [editing, setEditing] = useState(undefined);

  const addressId = editing?.id ?? null;
  const initial = editing
    ? toAddressForm(editing)
    : { ...EMPTY_ADDRESS, is_default: addresses.length === 0 };

  const handleSubmit = async (form, id) => {
    if (await save(form, id)) setEditing(undefined);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 print:hidden">
        <p className="text-[13px] text-muted-foreground">
          {loading ? "Đang mở sổ địa chỉ…" : `${addresses.length} địa chỉ nhận hàng đã lưu`}
        </p>
        <AddButton onClick={() => setEditing(null)}>Thêm địa chỉ</AddButton>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : addresses.length === 0 ? (
        <NoticeCard
          icon={MapPin}
          title="Chưa có địa chỉ nhận hàng"
          description="Thêm địa chỉ để các đơn sau được giao đúng nơi, không phải nhập lại mỗi lần thanh toán."
        >
          <AddButton onClick={() => setEditing(null)}>Thêm địa chỉ đầu tiên</AddButton>
        </NoticeCard>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              busy={saving}
              onEdit={setEditing}
              onDelete={remove}
              onSetDefault={setDefault}
            />
          ))}
        </div>
      )}

      {editing !== undefined && (
        <AddressFormDialog
          key={addressId ?? "new"}
          open
          onOpenChange={(open) => !open && setEditing(undefined)}
          initial={initial}
          addressId={addressId}
          submitting={saving}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default AddressTab;
