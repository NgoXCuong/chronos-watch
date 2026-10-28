// Tiện ích định nghĩa cột cho DataTable (tách riêng để file component chỉ export component)
export const columnId = (col, index) =>
  col.id || col.accessorKey || col.sortKey || `col-${index}`;
