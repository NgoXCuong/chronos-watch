import * as React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "./table";
import { cn } from "@/lib/utils";
import AdminPagination from "../admin/Common/AdminPagination";

/**
 * Highly optimized, reusable DataTable component built with Shadcn/UI Table primitives
 */
function DataTable({
  columns = [],
  data = [],
  loading = false,
  emptyMessage = "Không có dữ liệu",
  emptyIcon: EmptyIcon,
  onRowClick,
  rowClassName,
  selectedRowKeys = [],
  rowKey = "id",
  pagination,
  footer,
  className,
  containerClassName,
  children,
  ...props
}) {
  // Compound component mode: if children are passed, render them directly
  if (children) {
    return (
      <div
        className={cn(
          "bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden",
          containerClassName
        )}
      >
        <Table className={className} {...props}>
          {children}
        </Table>
        {footer}
        {pagination && (React.isValidElement(pagination) ? pagination : <AdminPagination {...pagination} />)}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden",
        containerClassName
      )}
    >
      <Table className={className} {...props}>
        <TableHeader className="bg-slate-50 border-b border-slate-100">
          <TableRow className="hover:bg-transparent border-slate-100">
            {columns.map((col, index) => (
              <TableHead
                key={col.id || col.accessorKey || index}
                className={cn(
                  "px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider",
                  col.align === "center" && "text-center",
                  col.align === "right" && "text-right",
                  col.headerClassName
                )}
                style={col.width ? { width: col.width } : undefined}
              >
                {typeof col.header === "function" ? col.header() : col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-slate-50">
          {loading ? (
            <TableRow>
              <TableCell
                colSpan={columns.length || 1}
                className="py-12 text-center"
              >
                <div className="w-8 h-8 border-3 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto" />
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length || 1}
                className="py-12 text-center text-slate-400 text-sm font-medium"
              >
                <div className="flex flex-col items-center justify-center space-y-2">
                  {EmptyIcon && (
                    <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 text-slate-300">
                      <EmptyIcon className="h-6 w-6" />
                    </div>
                  )}
                  <p className="text-sm font-medium">{emptyMessage}</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, rowIndex) => {
              const key = row[rowKey] !== undefined ? row[rowKey] : rowIndex;
              const isSelected = selectedRowKeys.includes(key);

              return (
                <TableRow
                  key={key}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={cn(
                    "hover:bg-slate-50/70 transition-colors border-slate-50",
                    onRowClick && "cursor-pointer",
                    isSelected && "bg-amber-50/40 hover:bg-amber-50/60",
                    typeof rowClassName === "function"
                      ? rowClassName(row, rowIndex)
                      : rowClassName
                  )}
                >
                  {columns.map((col, colIndex) => {
                    let cellContent = null;
                    if (typeof col.cell === "function") {
                      cellContent = col.cell({
                        row,
                        index: rowIndex,
                        value: col.accessorKey ? row[col.accessorKey] : undefined,
                      });
                    } else if (typeof col.render === "function") {
                      cellContent = col.render(row, rowIndex);
                    } else if (col.accessorKey) {
                      cellContent = row[col.accessorKey];
                    }

                    return (
                      <TableCell
                        key={col.id || col.accessorKey || colIndex}
                        className={cn(
                          "px-4 py-3 align-middle text-sm",
                          col.align === "center" && "text-center",
                          col.align === "right" && "text-right",
                          col.className
                        )}
                        onClick={(e) => {
                          if (col.stopRowClick) {
                            e.stopPropagation();
                          }
                        }}
                      >
                        {cellContent}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
      {footer}
      {pagination && (React.isValidElement(pagination) ? pagination : <AdminPagination {...pagination} />)}
    </div>
  );
}

export { DataTable };
export default DataTable;
