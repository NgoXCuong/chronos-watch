import { useMemo, useState } from "react";
import { toast } from "sonner";

// Chọn nhiều + chạy một hành động hàng loạt cho mọi bảng admin (Rule 3).
// `action` trả payload backend: { message } hoặc { deleted/updated, failed:[{id, reason}] }.
// Xóa/khóa hàng loạt là thao tác khó hoàn tác nên luôn hỏi trước (confirmMessage).
export const useBulkSelection = ({ rows = [], rowKey = "id", label, onDone }) => {
  const [selectedIds, setSelectedIds] = useState([]);
  const [busy, setBusy] = useState(false);

  // Chỉ tính các id còn xuất hiện trên trang đang hiển thị: đổi trang/lọc lại là
  // selection tự co lại, không xóa nhầm dòng ngoài màn hình
  const selectedRowKeys = useMemo(() => {
    const visible = new Set(rows.map((row) => row?.[rowKey]));
    return selectedIds.filter((id) => visible.has(id));
  }, [rows, selectedIds, rowKey]);

  const selectedRows = useMemo(
    () => rows.filter((row) => selectedRowKeys.includes(row?.[rowKey])),
    [rows, selectedRowKeys, rowKey],
  );

  const clear = () => setSelectedIds([]);

  const run = async (action, confirmMessage) => {
    if (selectedRowKeys.length === 0) {
      toast.error(`Chưa chọn ${label || "dòng"} nào`);
      return;
    }
    if (confirmMessage && !window.confirm(confirmMessage)) return;
    setBusy(true);
    try {
      const result = (await action(selectedRowKeys)) || {};
      const failed = result.failed || [];
      toast.success(result.message || `Đã xử lý ${selectedRowKeys.length} ${label || "dòng"}`);
      if (failed.length > 0) {
        toast.warning(
          `${failed.length} ${label || "dòng"} không xử lý được: ${failed
            .map((item) => item.reason)
            .join(" · ")}`,
        );
      }
      clear();
      await onDone?.();
    } catch (error) {
      toast.error(error?.message || `Không xử lý được hàng loạt`);
    } finally {
      setBusy(false);
    }
  };

  return { selectedIds: selectedRowKeys, setSelectedIds, selectedRows, busy, run, clear };
};

export default useBulkSelection;
