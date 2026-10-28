import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { cn } from "@/lib/utils";

/**
 * Select cho form (repo không có ui/select.jsx) — cùng cơ chế DropdownMenuRadioGroup
 * với FilterSelect, nhưng trigger full-width có placeholder + trạng thái lỗi.
 * options: { value: string|number, label, dot? } — value rỗng không được dùng làm mục chọn.
 */
const FormSelect = ({
  value,
  onChange,
  options = [],
  placeholder = "— Chọn —",
  invalid,
  disabled,
  id,
  className,
  contentClassName,
}) => {
  const current = options.find(
    (option) => String(option.value) === String(value ?? ""),
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        id={id}
        disabled={disabled}
        aria-invalid={invalid ? true : undefined}
        className={cn(
          "flex h-11 w-full items-center justify-between gap-2 rounded-lg border border-input bg-card px-3 text-sm font-medium text-foreground transition-colors",
          "hover:border-navy-300 focus-visible:border-navy-600 focus-visible:shadow-[0_0_0_3px_rgba(15,42,74,0.14)] focus-visible:outline-none",
          "disabled:cursor-not-allowed disabled:opacity-50",
          invalid &&
            "border-sale focus-visible:border-sale focus-visible:shadow-[0_0_0_3px_rgba(220,38,38,0.12)]",
          className,
        )}
      >
        <span className={cn("truncate text-left", !current && "text-muted-foreground")}>
          {current?.label ?? placeholder}
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 opacity-60" strokeWidth={2} />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className={cn("max-h-72 overflow-y-auto p-1.5", contentClassName)}
      >
        <DropdownMenuRadioGroup
          value={String(value ?? "")}
          onValueChange={(next) => onChange?.(next)}
        >
          {options.map((option) => (
            <DropdownMenuRadioItem
              key={String(option.value)}
              value={String(option.value)}
              className="gap-2 rounded-lg py-1.5 pl-2 text-[13px] font-medium"
            >
              {option.dot && (
                <span
                  className={cn("h-1.5 w-1.5 shrink-0 rounded-full", option.dot)}
                />
              )}
              <span className="truncate">{option.label}</span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FormSelect;
