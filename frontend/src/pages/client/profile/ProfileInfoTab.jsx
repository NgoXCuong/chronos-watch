import { useRef, useState } from "react";
import { Camera, Mail, Phone, Save, User } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/market/Field";
import authApi from "@/api/auth.api";
import { useAuth } from "@/hooks/useAuth";

const MAX_AVATAR_BYTES = 2 * 1024 * 1024;

const AvatarPicker = ({ preview, inputRef, onPick, onSelect }) => (
  <div className="relative shrink-0">
    <div className="size-24 overflow-hidden rounded-xl border border-border bg-navy-50 md:size-28 dark:bg-navy-500/10">
      {preview ? (
        <img src={preview} alt="Ảnh đại diện" className="size-full object-cover" />
      ) : (
        <span className="flex size-full items-center justify-center">
          <User size={30} strokeWidth={1.6} className="text-navy-300" aria-hidden="true" />
        </span>
      )}
    </div>
    <button
      type="button"
      onClick={onPick}
      aria-label="Chọn ảnh đại diện"
      className="absolute -bottom-2 -right-2 flex size-8 items-center justify-center rounded-full border-2 border-card bg-navy-600 text-white transition-colors hover:bg-navy-700"
    >
      <Camera size={14} strokeWidth={2} aria-hidden="true" />
    </button>
    <input type="file" accept="image/*" className="hidden" onChange={onSelect} ref={inputRef} />
  </div>
);

const ReadOnlyField = ({ label, value, icon }) => (
  <Field label={`${label} · cố định`} value={value || "Chưa có"} icon={icon} readOnly disabled />
);

/** Hồ sơ cá nhân: chỉ hai trường khách tự sửa được (tên, SĐT); avatar upload kèm đơn. */
const ProfileInfoTab = () => {
  const { user, updateUser } = useAuth();
  const [fullName, setFullName] = useState(user?.full_name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [avatarFile, setAvatarFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  const pickFile = () => fileInputRef.current?.click();

  const onFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_AVATAR_BYTES) {
      toast.error("Ảnh quá lớn (tối đa 2MB)");
      event.target.value = "";
      return;
    }
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const data = new FormData();
      data.append("full_name", fullName);
      data.append("phone", phone);
      if (avatarFile) data.append("avatar", avatarFile);

      const response = await authApi.updateProfile(data);
      updateUser(response.data || response);
      setAvatarFile(null);
      setPreviewUrl("");
      toast.success("Đã cập nhật hồ sơ");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Chưa cập nhật được hồ sơ");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-5 border-b border-border pb-6 text-center md:flex-row md:text-left">
        <AvatarPicker
          preview={previewUrl || user?.avatar_url}
          inputRef={fileInputRef}
          onPick={pickFile}
          onSelect={onFileChange}
        />
        <div className="min-w-0 space-y-1.5">
          <Badge variant={user?.role === "admin" ? "brand" : "muted"}>
            {user?.role === "admin" ? "Quản trị viên" : "Khách hàng"}
          </Badge>
          <h2 className="truncate text-xl font-bold text-foreground">
            {user?.full_name || user?.username}
          </h2>
          <p className="text-[13px] text-muted-foreground">
            Chronos dùng thông tin này để liên hệ và giao hàng cho bạn.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-5 md:grid-cols-2">
          <Field
            id="full_name"
            label="Họ và tên"
            required
            icon={User}
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            placeholder="Nhập họ và tên"
          />

          <Field
            id="phone"
            label="Số điện thoại"
            type="tel"
            icon={Phone}
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="09xx xxx xxx"
          />

          <ReadOnlyField label="Tên đăng nhập" value={user?.username} />
          <ReadOnlyField label="Thư điện tử" value={user?.email} icon={Mail} />
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-border pt-5 md:flex-row">
          <p className="text-[12px] text-muted-foreground">
            Ảnh đại diện tối đa 2MB, nên dùng ảnh vuông.
          </p>
          <Button type="submit" loading={saving} className="w-full gap-2 md:w-auto">
            {!saving && <Save size={15} strokeWidth={2} aria-hidden="true" />}
            Lưu thay đổi
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileInfoTab;
