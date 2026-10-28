import { useState } from "react";
import { Save, ShieldCheck } from "lucide-react";
import {
  Dialog,
  DialogCloseButton,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Button } from "../../ui/button";
import FormField from "../Common/FormField";
import FormSelect from "../Common/FormSelect";
import {
  WARRANTY_STATE,
  WARRANTY_STATE_LABELS,
  WARRANTY_STATUSES,
} from "../../../constants/warrantyStatus";
import { formatDate } from "../../../utils/formatCurrency";

const SERIAL_MAX = 50;
const NOTE_MAX = 500;

// 'expired' không nằm trong WARRANTY_STATUSES (DB) nên danh sách chọn chỉ có 4 giá trị ghi được
const STATUS_OPTIONS = WARRANTY_STATUSES.map((value) => ({
  value,
  label: WARRANTY_STATE_LABELS[value] ?? value,
  dot: WARRANTY_STATE[value]?.dot,
}));

const formOf = (warranty) => ({
  serial: warranty?.serial ?? "",
  status: warranty?.status ?? "active",
  note: warranty?.note ?? "",
});

// Component riêng để state seed từ props khi mở (Dialog unmount lúc đóng, không cần effect reset)
const WarrantyEditBody = ({ warranty, saving, onSubmit, onClose }) => {
  const [form, setForm] = useState(() => formOf(warranty));

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      serial: form.serial.trim(),
      status: form.status,
      note: form.note.trim(),
    });
  };

  return (
    <>
      <DialogHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-navy-600 dark:text-navy-200" strokeWidth={2} />
              Cập nhật phiếu bảo hành
            </DialogTitle>
            <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
              {warranty?.code} · {warranty?.product_name} ·{" "}
              {formatDate(warranty?.start_date)} → {formatDate(warranty?.end_date)}
            </p>
          </div>
          <DialogCloseButton onClick={onClose} />
        </div>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4 p-5">
        <FormField
          label="Số serial"
          htmlFor="warranty-serial"
          hint={`Tối đa ${SERIAL_MAX} ký tự, để trống nếu khách chưa cung cấp. Serial trùng sẽ bị backend chặn.`}
        >
          <Input
            id="warranty-serial"
            value={form.serial}
            maxLength={SERIAL_MAX}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, serial: event.target.value }))
            }
            placeholder="VD: CHR-WT-84920"
            className="font-mono uppercase tabular-nums"
          />
        </FormField>

        <FormField
          label="Trạng thái phiếu"
          htmlFor="warranty-status"
          required
          hint="Trạng thái là SET trực tiếp — lưu lại sẽ ghi đè, không phải bật/tắt theo trạng thái cũ."
        >
          <FormSelect
            id="warranty-status"
            value={form.status}
            onChange={(next) => setForm((prev) => ({ ...prev, status: next }))}
            options={STATUS_OPTIONS}
          />
        </FormField>

        <FormField
          label="Ghi chú kỹ thuật"
          htmlFor="warranty-note"
          hint={`${form.note.length}/${NOTE_MAX} ký tự — hiển thị ở bảng chi tiết.`}
        >
          <Textarea
            id="warranty-note"
            rows={4}
            value={form.note}
            maxLength={NOTE_MAX}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, note: event.target.value }))
            }
            placeholder="VD: Đã đổi pin tháng 3/2026, khách hẹn kiểm tra lại mặt số."
          />
        </FormField>

        <DialogFooter className="border-t-0 px-0 pb-0 pt-1">
          <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
            Hủy
          </Button>
          <Button type="submit" loading={saving} className="min-w-[150px] gap-1.5">
            {!saving && <Save className="h-4 w-4" strokeWidth={2} />}
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </form>
    </>
  );
};

const WarrantyEditModal = ({ open, warranty, saving = false, onSubmit, onClose }) => {
  if (!open || !warranty) return null;

  return (
    <Dialog open onOpenChange={(next) => !next && onClose?.()}>
      <DialogContent className="max-w-lg">
        <WarrantyEditBody
          key={warranty.id}
          warranty={warranty}
          saving={saving}
          onSubmit={onSubmit}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default WarrantyEditModal;
