import { Badge } from '../../ui/badge';
import { INVENTORY_LEVELS } from '../../../constants/inventoryPlanning';

export default function InventoryHealthBadge({ health }) {
    const config = INVENTORY_LEVELS[health?.level];
    if (!config) return null;
    return <Badge variant={config.badge} className="whitespace-nowrap">{config.label}</Badge>;
}
