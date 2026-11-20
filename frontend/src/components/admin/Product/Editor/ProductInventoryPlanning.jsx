import { PackageSearch } from 'lucide-react';
import { Input } from '../../../ui/input';
import FormField from '../../Common/FormField';
import FormSection from '../../Common/FormSection';
import InventoryHealthBadge from '../../Common/InventoryHealthBadge';
import { INVENTORY_FIELDS, inventoryCoverText, inventoryReasonText } from '../../../../constants/inventoryPlanning';

export default function ProductInventoryPlanning({ form, setField, errors, product }) {
    const health = product?.inventory_health;
    return (
        <FormSection title="Kế hoạch nhập hàng" hint="Cảnh báo theo tốc độ mua và thời gian đủ hàng" icon={PackageSearch}>
            {INVENTORY_FIELDS.map(({ key, label, min, max, hint }) => (
                <FormField key={key} label={`${label} (ngày)`} htmlFor={`field-${key}`} error={errors[key]} hint={hint} required>
                    <Input id={`field-${key}`} type="number" min={min} max={max} step="1" value={form[key]} onChange={(event) => setField(key, event.target.value)} error={errors[key]} className="h-10 tabular-nums" />
                </FormField>
            ))}
            <p className="rounded-lg bg-muted p-3 text-xs leading-relaxed text-muted-foreground">Cảnh báo khi số ngày đủ hàng chạm thời gian nhập + dự phòng. Dự báo cần ít nhất 14 ngày quan sát và 3 chiếc mua hợp lệ; sản phẩm vừa có hàng trở lại được quan sát từ đầu.</p>
            {health && <div className="space-y-2 border-t border-border pt-3">
                <p className="text-xs font-semibold text-foreground">Đánh giá từ dữ liệu đã lưu</p>
                <InventoryHealthBadge health={health} />
                <p className="text-xs text-muted-foreground">{inventoryCoverText(health)}</p>
                <p className="text-xs leading-relaxed text-muted-foreground">{health.level === 'insufficient' ? inventoryReasonText(health) : `${health.units_sold} chiếc mua hợp lệ trong ${health.observation_days} ngày quan sát.`}</p>
                <p className="text-[11px] text-muted-foreground">Lưu sản phẩm để áp dụng các thông số mới.</p>
            </div>}
        </FormSection>
    );
}
