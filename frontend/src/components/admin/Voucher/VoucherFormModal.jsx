import { useState } from "react";
import { Save, Ticket } from "lucide-react";
import {
  Dialog,
  DialogCloseButton,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import FormField from "../Common/FormField";
import FormSelect from "../Common/FormSelect";
import {
  DISCOUNT_TYPE_OPTIONS,
  VOUCHER_MAX,
} from "../../../constants/voucherForm";
import {
  buildVoucherPayload,
  voucherFormOf,
  validateVoucher,
} from "../../../utils/voucherForm";

// Component riêng để state seed từ props khi mở modal (Dialog unmount lúc đóng, không cần effect reset)
const VoucherFormBody = ({ voucher, saving, onSubmit, onClose }) => {
  const [form, setForm] = useState(() => voucherFormOf(voucher));
  const [errors, setErrors] = useState({});

  const set = (key) => (event) =>
    setForm((prev) => ({ ...prev, [key]: event.target.value }));

  const isPercent = form.discount_type === "percentage";

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validateVoucher(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    onSubmit(buildVoucherPayload(form));
  };

  return (
    <>
      <DialogHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <DialogTitle className="flex items-center gap-2">
              <Ticket
                className="h-4 w-4 text-navy-600 dark:text-navy-200"
                strokeWidth={2}
              />
              {voucher ? "Cập nhật voucher" : "Tạo voucher mới"}
            </DialogTitle>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Mã chỉ áp dụng khi đang bật và trong thời hạn. Bật/tắt mã tại danh
              sách voucher.
            </p>
          </div>
          <DialogCloseButton onClick={onClose} />
        </div>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">
          <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
            <FormField label="Hiển thị cho khách" htmlFor="voucher-public" hint="Mã riêng chỉ dùng được sau khi admin tặng cho tài khoản khách hàng."><FormSelect id="voucher-public" value={form.is_public ? "public" : "private"} onChange={(value) => setForm((prev) => ({ ...prev, is_public: value === "public" }))} options={[{ value: "public", label: "Công khai trên website" }, { value: "private", label: "Mã riêng — tặng cho khách" }]} /></FormField>
            <FormField
              label="Mã code"
              htmlFor="voucher-code"
              required
              error={errors.code}
            >
              <Input
                id="voucher-code"
                value={form.code}
                maxLength={VOUCHER_MAX.code}
                onChange={set("code")}
                placeholder="VD: CHRONOS10"
                className="font-mono uppercase"
                error={errors.code}
              />
            </FormField>

            <FormField label="Loại giảm giá" htmlFor="voucher-type" required>
              <FormSelect
                id="voucher-type"
                value={form.discount_type}
                onChange={(next) =>
                  setForm((prev) => ({ ...prev, discount_type: next }))
                }
                options={DISCOUNT_TYPE_OPTIONS}
              />
            </FormField>

            <FormField
              label={isPercent ? "Giá trị (%)" : "Giá trị (VND)"}
              htmlFor="voucher-value"
              required
              error={errors.discount_value}
            >
              <Input
                id="voucher-value"
                type="number"
                min={1}
                step={isPercent ? 1 : 1000}
                value={form.discount_value}
                onChange={set("discount_value")}
                placeholder={isPercent ? "10" : "200000"}
                className="tabular-nums"
                error={errors.discount_value}
              />
            </FormField>

            {isPercent && (
              <FormField
                label="Giảm tối đa (VND)"
                htmlFor="voucher-max"
                hint="Để trống = không giới hạn trần."
                error={errors.max_discount}
              >
                <Input
                  id="voucher-max"
                  type="number"
                  min={0}
                  step={1000}
                  value={form.max_discount}
                  onChange={set("max_discount")}
                  placeholder="500000"
                  className="tabular-nums"
                  error={errors.max_discount}
                />
              </FormField>
            )}

            <FormField
              label="Đơn tối thiểu (VND)"
              htmlFor="voucher-min"
              hint="Để trống = mọi đơn đều dùng được."
              error={errors.min_order_value}
            >
              <Input
                id="voucher-min"
                type="number"
                min={0}
                step={1000}
                value={form.min_order_value}
                onChange={set("min_order_value")}
                placeholder="2000000"
                className="tabular-nums"
                error={errors.min_order_value}
              />
            </FormField>

            <FormField
              label="Giới hạn tổng lượt dùng"
              htmlFor="voucher-usage"
              hint="Để trống = không giới hạn."
              error={errors.usage_limit}
            >
              <Input
                id="voucher-usage"
                type="number"
                min={1}
                step={1}
                value={form.usage_limit}
                onChange={set("usage_limit")}
                placeholder="100"
                className="tabular-nums"
                error={errors.usage_limit}
              />
            </FormField>

            <FormField
              label="Giới hạn lượt / người"
              htmlFor="voucher-per-user"
              error={errors.per_user_limit}
            >
              <Input
                id="voucher-per-user"
                type="number"
                min={0}
                step={1}
                value={form.per_user_limit}
                onChange={set("per_user_limit")}
                placeholder="1"
                className="tabular-nums"
                error={errors.per_user_limit}
              />
            </FormField>

            <FormField
              label="Ngày bắt đầu"
              htmlFor="voucher-start"
              required
              error={errors.start_date}
            >
              <Input
                id="voucher-start"
                type="date"
                value={form.start_date}
                onChange={set("start_date")}
                className="h-11 text-[13px] tabular-nums"
                error={errors.start_date}
              />
            </FormField>

            <FormField
              label="Ngày kết thúc"
              htmlFor="voucher-end"
              required
              error={errors.end_date}
            >
              <Input
                id="voucher-end"
                type="date"
                value={form.end_date}
                onChange={set("end_date")}
                className="h-11 text-[13px] tabular-nums"
                error={errors.end_date}
              />
            </FormField>
          </div>
        </div>

        <DialogFooter className="shrink-0 bg-card px-5 py-4 sm:px-6">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={saving}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            loading={saving}
            className="min-w-[132px] gap-1.5"
          >
            {!saving && <Save className="h-4 w-4" strokeWidth={2} />}
            {voucher ? "Lưu thay đổi" : "Tạo voucher"}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
};

const VoucherFormModal = ({
  open,
  voucher,
  saving = false,
  onSubmit,
  onClose,
}) => {
  if (!open) return null;

  return (
    <Dialog open onOpenChange={(next) => !next && onClose?.()}>
      <DialogContent className="flex max-h-[90dvh] w-full max-w-5xl flex-col">
        <VoucherFormBody
          key={voucher?.id ?? "new"}
          voucher={voucher}
          saving={saving}
          onSubmit={onSubmit}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default VoucherFormModal;
