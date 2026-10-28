import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { TableHead, TableHeader, TableRow, TableCell } from "./table";
import { Checkbox } from "./checkbox";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { columnId } from "@/utils/dataTableColumns";

/** Các phần render của DataTable (tách ra để data-table.jsx ≤ 300 dòng). */

// 12px + leading rộng: chữ hoa có dấu tiếng Việt ở 11px bị nhoè/dính dấu
const HEAD_CELL =
  "px-4 py-2.5 text-xs leading-5 font-bold uppercase tracking-[0.02em] whitespace-nowrap text-navy-700 dark:text-navy-100";

const alignClass = (col) =>
  cn(
    col.align === "center" && "text-center",
    col.align === "right" && "text-right",
  );

const renderCellValue = (col, row, rowIndex) => {
  if (typeof col.cell === "function") {
    return col.cell({
      row,
      index: rowIndex,
      value: col.accessorKey ? row[col.accessorKey] : undefined,
    });
  }
  if (typeof col.render === "function") return col.render(row, rowIndex);
  return col.accessorKey ? row[col.accessorKey] : null;
};

const SortHeaderButton = ({ col, sort, onSortChange }) => {
  const active = sort?.key === col.sortKey;
  const Icon = active
    ? sort.dir === "asc"
      ? ArrowUp
      : ArrowDown
    : ArrowUpDown;
  return (
    <button
      type="button"
      onClick={() =>
        onSortChange({
          key: col.sortKey,
          dir: active && sort.dir === "asc" ? "desc" : "asc",
        })
      }
      className={cn(
        "flex items-center gap-1.5 uppercase transition-colors hover:text-navy-700 dark:hover:text-navy-50",
        col.align === "right" && "ml-auto flex-row-reverse",
      )}
    >
      {typeof col.header === "function" ? col.header() : col.header}
      <Icon
        className={cn(
          "h-3.5 w-3.5 shrink-0",
          active
            ? "text-navy-600 dark:text-navy-200"
            : "text-muted-foreground/50",
        )}
        strokeWidth={2}
      />
    </button>
  );
};

const HeadLabel = ({ col, sort, onSortChange }) =>
  col.sortKey && onSortChange ? (
    <SortHeaderButton col={col} sort={sort} onSortChange={onSortChange} />
  ) : typeof col.header === "function" ? (
    col.header()
  ) : (
    col.header
  );

const SelectCell = ({ checked, onChange, label }) => (
  <TableCell className="w-10 px-3" onClick={(event) => event.stopPropagation()}>
    <Checkbox aria-label={label} checked={checked} onCheckedChange={onChange} />
  </TableCell>
);

export const TableHeadRow = ({
  columns,
  selectable,
  allChecked,
  onToggleAll,
  sort,
  onSortChange,
}) => (
  <TableHeader className="border-b border-border bg-navy-50/60 dark:bg-navy-500/10">
    <TableRow className="hover:bg-transparent">
      {selectable && (
        <TableHead className="w-10 px-3">
          <Checkbox
            aria-label="Chọn tất cả"
            checked={allChecked}
            onCheckedChange={onToggleAll}
          />
        </TableHead>
      )}
      {columns.map((col, index) => (
        <TableHead
          key={columnId(col, index)}
          className={cn(HEAD_CELL, alignClass(col), col.headerClassName)}
          style={col.width ? { width: col.width } : undefined}
        >
          <HeadLabel col={col} sort={sort} onSortChange={onSortChange} />
        </TableHead>
      ))}
    </TableRow>
  </TableHeader>
);

export const StateRow = ({ colSpan, children }) => (
  <TableRow>
    <TableCell colSpan={colSpan} className="py-12 text-center">
      {children}
    </TableCell>
  </TableRow>
);

export const BodyRows = ({
  columns,
  data,
  rowKey,
  selectable,
  selectedRowKeys,
  onRowSelect,
  onRowClick,
  rowClassName,
}) =>
  data.map((row, rowIndex) => {
    const key = row[rowKey] !== undefined ? row[rowKey] : rowIndex;
    const isSelected = selectedRowKeys.includes(key);

    return (
      <TableRow
        key={key}
        data-state={isSelected ? "selected" : undefined}
        onClick={onRowClick ? () => onRowClick(row) : undefined}
        className={cn(
          "border-border transition-colors hover:bg-accent/60",
          onRowClick && "cursor-pointer",
          // Zebra nhạt: dòng lẻ một lớp navy mỏng (dòng đã chọn vẫn đậm hơn nên không dùng even:)
          !isSelected && rowIndex % 2 === 1 && "bg-navy-50/40 dark:bg-navy-500/5",
          isSelected && "bg-navy-50/80 dark:bg-navy-500/15",
          typeof rowClassName === "function"
            ? rowClassName(row, rowIndex)
            : rowClassName,
        )}
      >
        {selectable && (
          <SelectCell
            checked={isSelected}
            label={`Chọn dòng ${key}`}
            onChange={() => onRowSelect(key, !isSelected)}
          />
        )}
        {columns.map((col, colIndex) => (
          <TableCell
            key={columnId(col, colIndex)}
            className={cn(
              "px-4 py-2.5 align-middle text-sm text-card-foreground",
              alignClass(col),
              col.className,
            )}
            onClick={
              col.stopRowClick ? (event) => event.stopPropagation() : undefined
            }
          >
            {renderCellValue(col, row, rowIndex)}
          </TableCell>
        ))}
      </TableRow>
    );
  });

export const SelectionBar = ({ count, total, onClear, children }) => (
  <div className="flex flex-wrap items-center gap-3 border-t border-border bg-navy-50/60 px-4 py-2 dark:bg-navy-500/10">
    <p className="text-xs font-bold uppercase tracking-[0.02em] text-navy-700 tabular-nums dark:text-navy-100">
      Đã chọn {count}/{total} dòng
    </p>
    <div className="ml-auto flex items-center gap-2">
      {children}
      <Button
        variant="ghost"
        size="sm"
        onClick={onClear}
        className="h-7 px-2 text-[11px] font-semibold text-muted-foreground hover:text-navy-700 dark:hover:text-navy-100"
      >
        Bỏ chọn
      </Button>
    </div>
  </div>
);
