import { CheckCircle2, MapPin, Plus } from 'lucide-react';
import { Field } from '../market/Field';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

const AddressCard = ({ address, selected, onSelect }) => (
    <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        className={cn(
            'relative rounded-xl border p-4 text-left transition-all focus-visible:outline-none focus-visible:shadow-[0_0_0_3px_rgba(15,42,74,.18)]',
            selected ? 'border-navy-600 bg-navy-50/70 shadow-card' : 'border-border bg-card hover:border-navy-300',
        )}
    >
        <div className="flex items-start justify-between gap-2">
            <p className="text-[13px] font-bold text-foreground">{address.recipient_name}</p>
            {address.is_default && (
                <span className="rounded bg-navy-600 px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.02em] text-white">Mặc định</span>
            )}
        </div>
        <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
            {address.address_line}
            {address.ward ? `, ${address.ward}` : ''}
            {address.district ? `, ${address.district}` : ''}
            {address.city ? `, ${address.city}` : ''}
        </p>
        <p className="mt-1 text-[13px] tabular-nums text-muted-foreground">{address.recipient_phone}</p>
        {selected && <CheckCircle2 size={16} strokeWidth={2} className="absolute right-3 top-9 text-navy-600" aria-hidden="true" />}
    </button>
);

/** Chọn địa chỉ đã lưu hoặc nhập địa chỉ mới cho đơn này. */
const AddressSection = ({ addresses, selectedAddressId, onSelect, useNewAddress, onUseNewAddress, onUseSaved, formData, setFormField }) => (
    <section className="rounded-xl border border-border bg-card p-5 shadow-card">
        <h2 className="mb-4 flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.02em] text-navy-700">
            <MapPin size={16} strokeWidth={2} className="text-navy-500" aria-hidden="true" />
            Thông tin giao hàng
        </h2>

        {!useNewAddress && addresses.length > 0 && (
            <div className="grid gap-3 md:grid-cols-2">
                {addresses.map((address) => (
                    <AddressCard
                        key={address.id}
                        address={address}
                        selected={selectedAddressId === address.id}
                        onSelect={() => onSelect(address.id)}
                    />
                ))}
                <button
                    type="button"
                    onClick={onUseNewAddress}
                    className="flex min-h-24 flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-navy-300 hover:text-navy-600"
                >
                    <Plus size={16} strokeWidth={2} aria-hidden="true" />
                    <span className="text-[12px] font-semibold uppercase tracking-[0.02em]">Nhận ở địa chỉ khác</span>
                </button>
            </div>
        )}

        {useNewAddress && (
            <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-bold text-foreground">Địa chỉ nhận hàng</h3>
                    {addresses.length > 0 && (
                        <Button type="button" variant="link" size="sm" className="h-7 px-1 normal-case" onClick={onUseSaved}>
                            Chọn từ địa chỉ đã lưu
                        </Button>
                    )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Field id="recipient_name" label="Người nhận" placeholder="Họ và tên" required value={formData.recipient_name} onChange={setFormField('recipient_name')} />
                    <Field id="recipient_phone" label="Số điện thoại" placeholder="SĐT liên hệ" required inputMode="tel" value={formData.recipient_phone} onChange={setFormField('recipient_phone')} />
                    <Field
                        id="address_line"
                        label="Địa chỉ chi tiết"
                        placeholder="Số nhà, tên đường..."
                        required
                        className="md:col-span-2"
                        value={formData.address_line}
                        onChange={setFormField('address_line')}
                    />
                    <Field id="ward" label="Phường/Xã" placeholder="Phường/Xã" value={formData.ward} onChange={setFormField('ward')} />
                    <Field id="district" label="Quận/Huyện" placeholder="Quận/Huyện" value={formData.district} onChange={setFormField('district')} />
                    <Field id="city" label="Tỉnh/Thành phố" placeholder="Tỉnh/Thành phố" required value={formData.city} onChange={setFormField('city')} className="md:col-span-2" />
                </div>
            </div>
        )}
    </section>
);

export default AddressSection;
