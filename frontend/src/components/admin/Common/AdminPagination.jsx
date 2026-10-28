import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../../ui/button";
import { cn } from "../../../lib/utils";

const MAX_VISIBLE = 5;

const pageWindow = (currentPage, totalPages) => {
  let start = Math.max(1, currentPage - Math.floor(MAX_VISIBLE / 2));
  const end = Math.min(totalPages, start + MAX_VISIBLE - 1);
  if (end - start + 1 < MAX_VISIBLE) {
    start = Math.max(1, end - MAX_VISIBLE + 1);
  }
  return Array.from(
    { length: Math.max(end - start + 1, 0) },
    (_, i) => start + i,
  );
};

const NavButton = ({ icon: Icon, disabled, onClick, label }) => (
  <Button
    variant="ghost"
    size="icon"
    disabled={disabled}
    onClick={onClick}
    aria-label={label}
    className="h-8 w-8 rounded-lg border border-border/70 bg-card text-muted-foreground hover:bg-navy-50 hover:text-navy-700 dark:hover:bg-navy-500/15 dark:hover:text-navy-100"
  >
    {Icon && <Icon className="h-4 w-4" strokeWidth={2} />}
  </Button>
);

// Phân trang dùng chung cho mọi DataTable — active = navy đặc chữ trắng
const AdminPagination = ({
  currentPage,
  totalPages,
  totalCount,
  countLabel = "mục",
  onPageChange,
}) => (
  <div className="flex items-center justify-between gap-3 border-t border-border bg-muted/40 px-4 py-2.5">
    <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.02em] text-muted-foreground">
      <span className="h-1 w-1 rounded-full bg-muted-foreground/60" />
      Tổng
      <span className="text-foreground tabular-nums">{totalCount}</span>
      {countLabel}
    </p>

    <div className="flex items-center gap-2">
      <NavButton
        icon={ChevronLeft}
        label="Trang trước"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
      />

      {totalPages > 0 && (
        <div className="flex items-center gap-1 rounded-lg border border-border/70 bg-card px-1.5 py-1">
          {pageWindow(currentPage, totalPages).map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              aria-current={currentPage === page ? "page" : undefined}
              className={cn(
                "h-7 min-w-7 rounded-md px-1.5 text-[11px] font-bold tabular-nums transition-colors",
                currentPage === page
                  ? "bg-navy-600 text-primary-foreground shadow-sm dark:bg-navy-500"
                  : "text-muted-foreground hover:bg-navy-50 hover:text-navy-700 dark:hover:bg-navy-500/15 dark:hover:text-navy-100",
              )}
            >
              {page}
            </button>
          ))}
        </div>
      )}

      <NavButton
        icon={ChevronRight}
        label="Trang sau"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      />
    </div>
  </div>
);

export default AdminPagination;
