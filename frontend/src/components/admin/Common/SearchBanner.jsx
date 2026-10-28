import { Search, RefreshCw } from "lucide-react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { cn } from "../../../lib/utils";

// Toolbar dùng chung cho mọi trang danh sách: search + refresh + slot bộ lọc
const SearchBanner = ({
  searchTerm,
  setSearchTerm,
  placeholder,
  onRefresh,
  loading,
  count,
  countLabel,
  children,
}) => (
  <div className="flex flex-wrap items-center gap-3 rounded-xl border border-navy-200/70 bg-navy-50/70 px-4 py-3 shadow-card dark:border-navy-500/25 dark:bg-navy-500/10">
    <div className="group relative flex-1 md:max-w-sm">
      <Search
        strokeWidth={2}
        className={cn(
          "pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground",
          "transition-colors group-focus-within:text-navy-600 dark:group-focus-within:text-navy-200",
        )}
      />
      <Input
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        placeholder={placeholder || "Tìm kiếm..."}
        className="h-10 rounded-lg border-input pl-9 text-sm shadow-none focus-visible:border-navy-600 focus-visible:ring-0 focus-visible:shadow-[0_0_0_3px_rgba(15,42,74,.18)]"
      />
    </div>

    {onRefresh && (
      <Button
        variant="ghost"
        size="icon"
        aria-label="Làm mới danh sách"
        onClick={onRefresh}
        className="h-9 w-9 shrink-0 rounded-lg border border-border bg-muted/50 text-muted-foreground hover:bg-navy-50 hover:text-navy-700 dark:hover:bg-navy-500/15 dark:hover:text-navy-100"
      >
        <RefreshCw
          strokeWidth={2}
          className={cn("h-4 w-4 transition-all", loading && "animate-spin")}
        />
      </Button>
    )}

    {children}

    {count !== undefined && count !== null && (
      <p className="ml-auto hidden text-xs font-semibold uppercase tracking-[0.02em] text-muted-foreground tabular-nums md:block">
        {countLabel || "Tổng"} {count}
      </p>
    )}
  </div>
);

export default SearchBanner;
