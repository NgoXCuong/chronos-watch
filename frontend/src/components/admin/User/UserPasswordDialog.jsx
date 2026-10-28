import { useState } from "react";
import { KeyRound, Save } from "lucide-react";
import {
  Dialog,
  DialogCloseButton,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { PasswordField } from "../../market/Field";
import { getUserDisplayName } from "../../../utils/userManage";

// Ngưỡng 6 ký tự khớp validate của /auth/change-password và form register
const PASSWORD_MIN = 6;

const UserPasswordBody = ({ user, saving, onSubmit, onClose }) => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [touched, setTouched] = useState(false);

  const tooShort = password.length < PASSWORD_MIN;
  const mismatch = confirm.length > 0 && confirm !== password;
  const error = tooShort
    ? `Mật khẩu mới phải có ít nhất ${PASSWORD_MIN} ký tự.`
    : mismatch
      ? "Mật khẩu nhập lại chưa khớp."
      : undefined;

  const handleSubmit = (event) => {
    event.preventDefault();
    setTouched(true);
    if (tooShort || mismatch) return;
    onSubmit(password);
  };

  return (
    <>
      <DialogHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <DialogTitle className="flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-navy-600 dark:text-navy-200" strokeWidth={2} />
              Đặt lại mật khẩu
            </DialogTitle>
            <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
              {getUserDisplayName(user)} · @{user.username} · {user.email}
            </p>
          </div>
          <DialogCloseButton onClick={onClose} />
        </div>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4 p-5">
        <PasswordField
          id="admin-new-password"
          label="Mật khẩu mới"
          required
          autoComplete="new-password"
          show={show}
          onToggle={() => setShow((prev) => !prev)}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={touched ? error : undefined}
          hint="Không có mật khẩu cũ ở luồng này — admin cần truyền mật khẩu mới cho khách bằng kênh riêng."
        />

        <PasswordField
          id="admin-new-password-confirm"
          label="Nhập lại mật khẩu"
          required
          autoComplete="new-password"
          show={show}
          onToggle={() => setShow((prev) => !prev)}
          value={confirm}
          onChange={(event) => setConfirm(event.target.value)}
          error={touched && mismatch ? "Mật khẩu nhập lại chưa khớp." : undefined}
          hint="Khách đang đăng nhập vẫn dùng phiên cũ tới khi token hết hạn (1 giờ)."
        />

        <DialogFooter className="border-t-0 px-0 pb-0 pt-1">
          <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
            Hủy
          </Button>
          <Button type="submit" loading={saving} className="min-w-[170px] gap-1.5">
            {!saving && <Save className="h-4 w-4" strokeWidth={2} />}
            Đổi mật khẩu
          </Button>
        </DialogFooter>
      </form>
    </>
  );
};

const UserPasswordDialog = ({ open, user, saving = false, onSubmit, onClose }) => {
  if (!open || !user) return null;

  return (
    <Dialog open onOpenChange={(next) => !next && onClose?.()}>
      <DialogContent className="max-w-md">
        <UserPasswordBody
          key={user.id}
          user={user}
          saving={saving}
          onSubmit={onSubmit}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UserPasswordDialog;
