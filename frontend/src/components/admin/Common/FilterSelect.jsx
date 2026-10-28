import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { buttonVariants } from "../../ui/button";
import { cn } from "../../../lib/utils";

/**
 * Dropdown lọc một giá trị (thay cho chips chiếm hết toolbar) — dùng chung mọi trang
 * danh sách (Rule 3 — AGENTS.md). options: { value, label, dot? }; value "" = tất cả.
 */
const FilterSelect = ({
  label,
  value = "",
  onChange,
  options = [],
  className,
  contentClassName,
}) => {
  const current = options.find((option) => option.value === value);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          buttonVariants({ variant: "outline" }),
          "h-10 shrink-0 gap-2 rounded-lg border-border text-[13px] font-semibold text-navy-700 hover:bg-navy-50 hover:text-navy-800 dark:text-navy-100 dark:hover:bg-navy-500/15",
          className,
        )}
      >
        <span className="text-muted-foreground">{label}</span>
        <span className="flex items-center gap-1.5">
          {current?.dot && (
            <span className={cn("h-1.5 w-1.5 rounded-full", current.dot)} />
          )}
          {current?.label ?? options[0]?.label}
        </span>
        <ChevronDown className="h-4 w-4 opacity-60" strokeWidth={2} />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className={cn("w-52 p-1.5", contentClassName)}
      >
        <DropdownMenuRadioGroup
          value={value}
          onValueChange={(next) => onChange?.(next)}
        >
          {options.map((option) => (
            <DropdownMenuRadioItem
              key={option.value || "__all"}
              value={option.value}
              className="gap-2 rounded-lg py-1.5 pl-2 text-[13px] font-medium"
            >
              {option.dot && (
                <span
                  className={cn("h-1.5 w-1.5 shrink-0 rounded-full", option.dot)}
                />
              )}
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FilterSelect;
