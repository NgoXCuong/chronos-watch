import { Button } from "../../ui/button";
import { cn } from "../../../lib/utils";

const BUTTON_CLASS = {
  outline:
    "h-7 gap-1.5 rounded-md border-border text-[11px] font-semibold text-navy-700 hover:bg-navy-50 dark:text-navy-100 dark:hover:bg-navy-500/15",
  destructive: "h-7 gap-1.5 rounded-md text-[11px] font-semibold",
  default: "h-7 gap-1.5 rounded-md text-[11px] font-semibold",
};

// Nút trên thanh "Đã chọn N/M dòng" — khai báo bằng config để mọi trang dùng chung,
// không copy-paste JSX nút bulk ở 6 trang khác nhau.
// `icon` nhận PHẦN TỬ JSX đã dựng sẵn (<Trash2 className="h-3.5 w-3.5" />): repo không cài
// eslint-plugin-react nên prop kiểu { icon: Icon } rồi render <Icon/> bị no-unused-vars.
export const SelectionActions = ({ actions = [], busy }) => (
  <>
    {actions.map(({ key, label, icon, variant = "outline", onClick }) => (
      <Button
        key={key || label}
        variant={variant}
        size="sm"
        loading={busy}
        onClick={onClick}
        className={cn(BUTTON_CLASS[variant])}
      >
        {icon}
        {label}
      </Button>
    ))}
  </>
);

export default SelectionActions;
