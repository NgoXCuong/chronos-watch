import { Badge } from "@/components/ui/badge";
import { WARRANTY_STATE, warrantyStateLabel } from "@/constants/warrantyStatus";
import { cn } from "@/lib/utils";

// Badge trạng thái PHIẾU bảo hành — variant lấy thẳng từ WARRANTY_STATE (Rule 3: không màu tự do)
const WarrantyStateBadge = ({ state, className, withIcon = true }) => {
  const config = WARRANTY_STATE[state];

  if (!config) {
    return <Badge variant="muted" className={className}>{warrantyStateLabel(state)}</Badge>;
  }

  const Icon = config.icon;

  return (
    <Badge variant={config.badge} className={cn("shrink-0", className)}>
      {withIcon && <Icon className="h-3 w-3" strokeWidth={2} />}
      {config.label}
    </Badge>
  );
};

export default WarrantyStateBadge;
