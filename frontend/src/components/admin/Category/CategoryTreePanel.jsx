import { useMemo, useState } from "react";
import { ChevronRight, ChevronsDownUp, ChevronsUpDown, FolderOpen, Layers, Package, Plus } from "lucide-react";
import FormSection from "../Common/FormSection";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { cn } from "@/lib/utils";
import { CategoryGlyph } from "../../../constants/categoryIcons";
import { collectExpandableIds } from "../../../utils/categoryTree";

const rowButton =
  "flex items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-navy-100/70 hover:text-navy-700 dark:hover:bg-navy-500/20 dark:hover:text-navy-100";

const CountPill = ({ value }) => (
  <span
    title={`${value} sản phẩm trực tiếp`}
    className="flex shrink-0 items-center gap-1 text-[11px] font-bold tabular-nums text-muted-foreground"
  >
    <Package className="h-3 w-3" strokeWidth={2} />
    {value}
  </span>
);

// Đệ quy: một nhánh cây = hàng chọn + <ul> các con (thu gọn theo cấp, không pad tay)
const TreeBranch = ({
  node,
  expanded,
  forceOpen,
  selectedId,
  onSelect,
  onToggle,
}) => {
  const children = node.children || [];
  const isOpen = forceOpen || expanded.has(Number(node.id));
  const isSelected = Number(node.id) === Number(selectedId);

  return (
    <li>
      <div
        className={cn(
          "flex items-center gap-1 rounded-lg pr-2 transition-colors",
          isSelected
            ? "bg-navy-100/80 ring-1 ring-navy-500/25 dark:bg-navy-500/18"
            : "hover:bg-navy-50/80 dark:hover:bg-navy-500/8",
        )}
      >
        <button
          type="button"
          aria-label={isOpen ? "Thu gọn nhánh" : "Mở rộng nhánh"}
          onClick={() => onToggle(node.id)}
          className={cn(rowButton, "h-7 w-6", children.length === 0 && "invisible")}
        >
          <ChevronRight
            className={cn("h-3.5 w-3.5 transition-transform duration-150", isOpen && "rotate-90")}
            strokeWidth={2.5}
          />
        </button>

        <button
          type="button"
          onClick={() => onSelect(node.id)}
          className="flex min-w-0 flex-1 items-center gap-2 py-2 text-left"
        >
          <span className="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-md bg-card ring-1 ring-navy-500/15">
            {node.image_url ? (
              <img src={node.image_url} alt="" className="h-full w-full object-cover" />
            ) : (
              <CategoryGlyph
                category={node}
                className={cn(
                  "h-3.5 w-3.5",
                  isSelected ? "text-navy-700 dark:text-navy-100" : "text-navy-600/70 dark:text-navy-200",
                )}
                strokeWidth={2}
              />
            )}
          </span>
          <span
            className={cn(
              "min-w-0 flex-1 truncate text-[13px]",
              isSelected
                ? "font-bold text-navy-800 dark:text-navy-50"
                : "font-semibold text-foreground",
            )}
          >
            {node.name}
          </span>
          {!node.is_active && (
            <Badge variant="muted" className="shrink-0 px-1.5 py-0">Ẩn</Badge>
          )}
          <CountPill value={node.product_count ?? 0} />
        </button>
      </div>

      {children.length > 0 && isOpen && (
        <ul className="ml-3 space-y-0.5 border-l border-border pl-2">
          {children.map((child) => (
            <TreeBranch
              key={child.id}
              node={child}
              expanded={expanded}
              forceOpen={forceOpen}
              selectedId={selectedId}
              onSelect={onSelect}
              onToggle={onToggle}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

const SkeletonRow = () => (
  <div className="flex items-center gap-2 py-2">
    <span className="h-6 w-6 shrink-0 animate-pulse rounded-md bg-muted" />
    <span className="h-3 flex-1 animate-pulse rounded bg-muted" />
    <span className="h-3 w-8 shrink-0 animate-pulse rounded bg-muted" />
  </div>
);

/**
 * Cột trái trang Danh mục: cây phân cấp chọn 1 node (master).
 * Bảng DataTable không dùng được ở đây vì bố cục là cây lồng nhau (Rule 3 cho phép).
 */
const CategoryTreePanel = ({
  nodes,
  loading,
  isFiltering,
  selectedId,
  onSelect,
  onCreateRoot,
  totalCategories,
}) => {
  // null = chưa thao tác → mặc định mở cấp 1; Set tự do khi "giãn nở/thu gọn tất cả"
  const [overrides, setOverrides] = useState(null);
  const defaultExpanded = useMemo(
    () => new Set(nodes.filter((node) => node.children?.length).map((node) => Number(node.id))),
    [nodes],
  );
  const expanded = overrides ?? defaultExpanded;

  const toggle = (id) => {
    const next = new Set(expanded);
    const key = Number(id);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setOverrides(next);
  };

  const expandAll = () => setOverrides(new Set(collectExpandableIds(nodes)));
  const collapseAll = () => setOverrides(new Set());

  const headerActions = (
    <div className="flex shrink-0 items-center gap-1">
      <button type="button" onClick={expandAll} title="Giãn nở tất cả" className={cn(rowButton, "h-7 w-7")}>
        <ChevronsUpDown className="h-3.5 w-3.5" strokeWidth={2} />
      </button>
      <button type="button" onClick={collapseAll} title="Thu gọn tất cả" className={cn(rowButton, "h-7 w-7")}>
        <ChevronsDownUp className="h-3.5 w-3.5" strokeWidth={2} />
      </button>
    </div>
  );

  return (
    <FormSection
      title="Cấu trúc danh mục"
      hint={`${totalCategories} danh mục trong hệ thống`}
      icon={Layers}
      actions={headerActions}
      bodyClassName="p-2"
    >
      {loading && (
        <div className="space-y-1 px-2 py-1">
          {[0, 1, 2, 3].map((key) => (
            <SkeletonRow key={key} />
          ))}
        </div>
      )}

      {!loading && nodes.length === 0 && (
        <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
          <FolderOpen className="h-6 w-6 text-muted-foreground" strokeWidth={1.75} />
          <p className="text-[13px] font-semibold text-foreground">
            {isFiltering ? "Không có danh mục khớp bộ lọc" : "Chưa có danh mục nào"}
          </p>
          {isFiltering ? (
            <p className="max-w-[220px] text-[11px] text-muted-foreground">
              Thử rút ngắn từ khóa hoặc đặt lại bộ lọc trạng thái.
            </p>
          ) : (
            <Button variant="buy" size="sm" onClick={onCreateRoot} className="mt-1 gap-1.5">
              <Plus className="h-3.5 w-3.5" strokeWidth={2.5} /> Thêm danh mục gốc
            </Button>
          )}
        </div>
      )}

      {!loading && nodes.length > 0 && (
        <ul className="space-y-0.5">
          {nodes.map((node) => (
            <TreeBranch
              key={node.id}
              node={node}
              expanded={expanded}
              forceOpen={isFiltering}
              selectedId={selectedId}
              onSelect={onSelect}
              onToggle={toggle}
            />
          ))}
        </ul>
      )}
    </FormSection>
  );
};

export default CategoryTreePanel;
