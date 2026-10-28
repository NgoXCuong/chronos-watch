import { useState } from "react";
import { Lock, Save, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PasswordField } from "@/components/market/Field";
import authApi from "@/api/auth.api";

const MIN_LENGTH = 6;
const EMPTY_FORM = { oldPassword: "", newPassword: "", confirmPassword: "" };

// Xác thực ngay tại field (không toast) để khách thấy lỗi trước khi gửi
const validate = (form) => {
  const errors = {};
  if (!form.oldPassword) errors.oldPassword = "Cần nhập mật khẩu hiện tại";
  if (form.newPassword.length < MIN_LENGTH)
    errors.newPassword = `Tối thiểu ${MIN_LENGTH} ký tự`;
  if (form.newPassword !== form.confirmPassword)
    errors.confirmPassword = "Mật khẩu nhập lại chưa khớp";
  return errors;
};

const ChangePasswordTab = () => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [show, setShow] = useState({ old: false, new: false, confirm: false });
  const [saving, setSaving] = useState(false);

  const setField = (key) => (event) => {
    const value = event.target.value;
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const toggle = (key) => () => setShow((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSaving(true);
    try {
      await authApi.changePassword({
        oldPassword: form.oldPassword,
        newPassword: form.newPassword,
      });
      setForm(EMPTY_FORM);
      toast.success("Đã đổi mật khẩu");
    } catch (error) {
      const message = error?.response?.data?.message || "Mật khẩu hiện tại không đúng";
      setErrors({ oldPassword: message });
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-navy-50 text-navy-600 dark:bg-navy-500/15">
          <ShieldCheck size={20} strokeWidth={2} aria-hidden="true" />
        </span>
        <div className="space-y-1">
          <h2 className="text-base font-bold text-foreground">Đổi mật khẩu đăng nhập</h2>
          <p className="text-[13px] leading-relaxed text-muted-foreground">
            Mật khẩu mới cần ít nhất {MIN_LENGTH} ký tự. Phiên đăng nhập hiện tại vẫn được giữ,
            các thiết bị khác sẽ phải đăng nhập lại.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
        <PasswordField
          id="oldPassword"
          label="Mật khẩu hiện tại"
          required
          icon={Lock}
          autoComplete="current-password"
          value={form.oldPassword}
          onChange={setField("oldPassword")}
          error={errors.oldPassword}
          show={show.old}
          onToggle={toggle("old")}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <PasswordField
            id="newPassword"
            label="Mật khẩu mới"
            required
            icon={Lock}
            autoComplete="new-password"
            placeholder={`Tối thiểu ${MIN_LENGTH} ký tự`}
            value={form.newPassword}
            onChange={setField("newPassword")}
            error={errors.newPassword}
            show={show.new}
            onToggle={toggle("new")}
          />

          <PasswordField
            id="confirmPassword"
            label="Nhập lại mật khẩu mới"
            required
            icon={Lock}
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={setField("confirmPassword")}
            error={errors.confirmPassword}
            show={show.confirm}
            onToggle={toggle("confirm")}
          />
        </div>

        <Button type="submit" loading={saving} className="gap-2">
          {!saving && <Save size={15} strokeWidth={2} aria-hidden="true" />}
          Đổi mật khẩu
        </Button>
      </form>
    </div>
  );
};

export default ChangePasswordTab;
