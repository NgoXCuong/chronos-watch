import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogCloseButton,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/market/Field";
import { ADDRESS_FIELDS } from "@/constants/addresses";
import { validateAddressForm } from "@/utils/addresses";

/**
 * Dialog thêm/sửa một địa chỉ. Trang cha mount lại theo `key` mỗi lần mở nên
 * form không cần effect đồng bộ lại từ prop.
 */
const AddressFormDialog = ({ open, onOpenChange, initial = {}, addressId = null, submitting, onSubmit }) => {
  const [form, setForm] = useState(() => ({ ...initial }));
  const [errors, setErrors] = useState({});

  const setValue = (name) => (event) => {
    const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validateAddressForm(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      toast.error("Chưa điền đủ các mục bắt buộc");
      return;
    }
    onSubmit?.(form, addressId);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader className="flex-row items-start justify-between gap-3">
          <DialogTitle>{addressId ? "Cập nhật địa chỉ" : "Thêm địa chỉ mới"}</DialogTitle>
          <DialogCloseButton onClick={() => !submitting && onOpenChange?.(false)} />
        </DialogHeader>

        <form onSubmit={handleSubmit} id="address-form">
          <div className="grid gap-4 px-5 py-4 sm:grid-cols-2">
            {ADDRESS_FIELDS.map((field) => (
              <Field
                key={field.name}
                id={`address-${field.name}`}
                name={field.name}
                label={field.label}
                type={field.type || "text"}
                placeholder={field.placeholder}
                required={field.required}
                value={form[field.name] || ""}
                onChange={setValue(field.name)}
                error={errors[field.name]}
                className={field.span}
              />
            ))}

            <label className="flex items-center gap-2.5 text-[13px] font-medium text-foreground sm:col-span-2">
              <Checkbox
                name="is_default"
                checked={Boolean(form.is_default)}
                onCheckedChange={(checked) =>
                  setForm((prev) => ({ ...prev, is_default: Boolean(checked) }))
                }
              />
              Đặt làm địa chỉ mặc định
            </label>
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange?.(false)}>
              Hủy
            </Button>
            <Button type="submit" loading={submitting}>
              {addressId ? "Lưu thay đổi" : "Thêm địa chỉ"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddressFormDialog;
