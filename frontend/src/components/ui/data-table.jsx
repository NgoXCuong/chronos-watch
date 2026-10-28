import * as React from "react";
import { Table, TableBody } from "./table";
import { cn } from "@/lib/utils";
import AdminPagination from "../admin/Common/AdminPagination";
import {
  BodyRows,
  SelectionBar,
  StateRow,
  TableHeadRow,
} from "./data-table-parts";

/**
 * Bảng dùng chung của admin (Rule 3 — AGENTS.md): mọi trang danh sách đi qua
 * DataTable + SearchBanner + AdminPagination, không tự dựng <table>/toolbar.
 * columns: { id | accessorKey, header, cell({ row, index }) | render(row, i),
 *            align, width, headerClassName, className, stopRowClick,
 *            sortKey (cột sort được) }
 * Năng lực: selectable (checkbox + select-all), sort/onSortChange (server-side),
 * selectionActions (thanh hành động hàng loạt).
 */

const LoadingState = () => (
  <span
    aria-label="Đang tải"
    className="mx-auto block h-7 w-7 animate-spin rounded-full border-2 border-navy-600 border-t-transparent dark:border-navy-200"
  />
);

const EmptyState = ({ icon: Icon, message }) => (
  <div className="flex flex-col items-center justify-center gap-2">
    {Icon && (
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Icon className="h-5 w-5" strokeWidth={2} />
      </span>
    )}
    <p className="text-sm font-medium text-muted-foreground">{message}</p>
  </div>
);

function DataTable({
  columns = [],
  data = [],
  loading = false,
  emptyMessage = "Không có dữ liệu",
  emptyIcon,
  onRowClick,
  rowClassName,
  selectedRowKeys = [],
  rowKey = "id",
  selectable = false,
  onSelectionChange,
  sort,
  onSortChange,
  selectionActions,
  pagination,
  footer,
  className,
  containerClassName,
  children,
  ...props
}) {
  const colSpan = columns.length + (selectable ? 1 : 0);
  const keys = data.map((row) =>
    row[rowKey] !== undefined ? row[rowKey] : null,
  );
  const allChecked =
    keys.length > 0 && keys.every((key) => selectedRowKeys.includes(key));

  const toggleAll = (checked) =>
    onSelectionChange?.(
      checked
        ? [...new Set([...selectedRowKeys, ...keys])]
        : selectedRowKeys.filter((key) => !keys.includes(key)),
    );

  const body = () => {
    if (loading)
      return (
        <StateRow colSpan={colSpan}>
          <LoadingState />
        </StateRow>
      );
    if (data.length === 0)
      return (
        <StateRow colSpan={colSpan}>
          <EmptyState icon={emptyIcon} message={emptyMessage} />
        </StateRow>
      );
    return (
      <BodyRows
        columns={columns}
        data={data}
        rowKey={rowKey}
        selectable={selectable}
        selectedRowKeys={selectedRowKeys}
        onRowSelect={(key, checked) =>
          onSelectionChange?.(
            checked
              ? [...selectedRowKeys, key]
              : selectedRowKeys.filter((item) => item !== key),
          )
        }
        onRowClick={onRowClick}
        rowClassName={rowClassName}
      />
    );
  };

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-card shadow-card",
        containerClassName,
      )}
    >
      {children ? (
        <Table className={className} {...props}>
          {children}
        </Table>
      ) : (
        <Table className={className} {...props}>
          <TableHeadRow
            columns={columns}
            selectable={selectable}
            allChecked={allChecked}
            onToggleAll={toggleAll}
            sort={sort}
            onSortChange={onSortChange}
          />
          <TableBody className="divide-y divide-border">{body()}</TableBody>
        </Table>
      )}
      {footer}
      {selectable && selectedRowKeys.length > 0 && (
        <SelectionBar
          count={selectedRowKeys.length}
          total={data.length}
          onClear={() => onSelectionChange?.([])}
        >
          {selectionActions}
        </SelectionBar>
      )}
      {pagination &&
        (React.isValidElement(pagination) ? (
          pagination
        ) : (
          <AdminPagination {...pagination} />
        ))}
    </div>
  );
}

export { DataTable };
export default DataTable;
