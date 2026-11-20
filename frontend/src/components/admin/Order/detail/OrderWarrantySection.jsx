import { useCallback, useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import warrantyApi from "../../../../api/warranty.api";
import { DataTable } from "../../../ui/data-table";
import { Button } from "../../../ui/button";
import DetailSection from "./DetailSection";
import WarrantyEditModal from "../../Warranty/WarrantyEditModal";
import { getOrderWarrantyColumns } from "./orderWarrantyColumns";

const PAGE_SIZE = 5;

export default function OrderWarrantySection({ orderId }) {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await warrantyApi.getAll({ order_id: orderId, page, limit: PAGE_SIZE });
      setRows(data.warranties || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err.message || "Không tải được phiếu bảo hành.");
    } finally { setLoading(false); }
  }, [orderId, page]);
  useEffect(() => { load(); }, [load]);
  const save = async (payload) => {
    setSaving(true);
    try {
      await warrantyApi.update(editing.id, payload);
      setEditing(null);
      toast.success("Đã cập nhật phiếu bảo hành.");
      await load();
    } catch (err) { toast.error(err.message || "Không lưu được phiếu bảo hành."); }
    finally { setSaving(false); }
  };
  return (
    <DetailSection title="Phiếu bảo hành" icon={ShieldCheck}>
      <p className="mb-3 text-xs text-muted-foreground">
        Mỗi phiếu được nhận diện bằng mã phiếu và liên kết với sản phẩm trong đơn hàng.
        Phiếu được tạo khi đơn giao thành công.
      </p>
      {error ? <div role="alert" className="space-y-2 text-sm text-destructive">
        <p>{error}</p><Button variant="outline" onClick={load}>Thử lại</Button>
      </div> : <DataTable columns={getOrderWarrantyColumns(setEditing)} data={rows}
        loading={loading} emptyIcon={ShieldCheck} emptyMessage="Đơn hàng chưa có phiếu bảo hành."
        pagination={total >= PAGE_SIZE ? { currentPage: page, totalPages: Math.ceil(total / PAGE_SIZE), totalCount: total,
          countLabel: "phiếu", onPageChange: setPage } : undefined} />}
      <WarrantyEditModal open={!!editing} warranty={editing} saving={saving}
        onSubmit={save} onClose={() => !saving && setEditing(null)} />
    </DetailSection>
  );
}
