import { useState } from "react";
import { ImageIcon, Save } from "lucide-react";
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
import BannerImageField from "./BannerImageField";
import useImagePicker from "../../../hooks/useImagePicker";
import { BANNER_DEFAULT_LINK, BANNER_MAX } from "../../../constants/bannerForm";
import {
  buildBannerPayload,
  normalizeBannerTitle,
  toLocalInput,
  validateBanner,
} from "../../../utils/bannerForm";

// banners: eyebrow(100) · title(255, NOT NULL) · subtitle(500) · image_url(NOT NULL)
// · link_url(255) · sort_order INT · start_date/end_date DATETIME nullable
const EMPTY_FORM = {
  eyebrow: "",
  title: "",
  subtitle: "",
  link_url: BANNER_DEFAULT_LINK,
  sort_order: 0,
  start_date: "",
  end_date: "",
};

const formOf = (banner) =>
  banner
    ? {
        eyebrow: banner.eyebrow || "",
        title: normalizeBannerTitle(banner.title),
        subtitle: banner.subtitle || "",
        link_url: banner.link_url || BANNER_DEFAULT_LINK,
        sort_order: banner.sort_order ?? 0,
        start_date: toLocalInput(banner.start_date),
        end_date: toLocalInput(banner.end_date),
      }
    : EMPTY_FORM;

// Component riêng để state seed từ props khi mở modal (Dialog unmount lúc đóng, không cần effect reset)
const BannerFormBody = ({ banner, saving, onSubmit, onClose }) => {
  const [form, setForm] = useState(() => formOf(banner));
  const [errors, setErrors] = useState({});
  const [imageMeta, setImageMeta] = useState(null);
  const cover = useImagePicker(banner?.image_url);
  const {
    file: coverFile,
    preview: coverPreview,
    isNew: coverIsNew,
    open: openCover,
    clear: clearCover,
    pick: pickCover,
    inputRef: coverInputRef,
  } = cover;

  const set = (key) => (event) =>
    setForm((prev) => ({ ...prev, [key]: event.target.value }));

  const handlePreviewLoad = (event) => {
    const { naturalWidth: width, naturalHeight: height } = event.currentTarget;
    if (!width || !height) return;
    setImageMeta({ width, height });
  };

  const imageTooSmall = Boolean(imageMeta && imageMeta.width < 1920);

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validateBanner(form);
    if (!banner && !coverFile)
      nextErrors.image = "Banner mới bắt buộc phải có ảnh.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    onSubmit(buildBannerPayload(form, coverFile));
  };

  return (
    <>
      <DialogHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <DialogTitle className="flex items-center gap-2">
              <ImageIcon
                className="h-4 w-4 text-navy-600 dark:text-navy-200"
                strokeWidth={2}
              />
              {banner ? "Cập nhật banner" : "Thêm banner mới"}
            </DialogTitle>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Hero slider trang chủ — chỉ banner đang bật và trong khoảng hiệu
              lực mới hiện
            </p>
          </div>
          <DialogCloseButton onClick={onClose} />
        </div>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
            <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                label="Nhãn nhỏ (eyebrow)"
                htmlFor="banner-eyebrow"
                error={errors.eyebrow}
              >
                <Input
                  id="banner-eyebrow"
                  value={form.eyebrow}
                  maxLength={BANNER_MAX.eyebrow}
                  onChange={set("eyebrow")}
                  placeholder="VD: Bộ Sưu Tập Mới 2026"
                  error={errors.eyebrow}
                />
              </FormField>

              <FormField
                label="Link khi bấm banner"
                htmlFor="banner-link"
                error={errors.link_url}
              >
                <Input
                  id="banner-link"
                  value={form.link_url}
                  maxLength={BANNER_MAX.link_url}
                  onChange={set("link_url")}
                  placeholder="/products"
                  className="font-mono text-[13px]"
                  error={errors.link_url}
                />
              </FormField>

              <FormField
                label="Tiêu đề"
                htmlFor="banner-title"
                required
                className="sm:col-span-2"
                hint='Chỉ đè lên ảnh dọc/vuông. Mỗi dòng một cụm, cách nhau bởi "|"; thêm "!" đầu dòng để tô màu nhấn. VD: NGHỆ | !THUẬT | CỦA THỜI | GIAN'
                error={errors.title}
              >
                <Input
                  id="banner-title"
                  value={form.title}
                  maxLength={BANNER_MAX.title}
                  onChange={set("title")}
                  placeholder="NGHỆ | !THUẬT | CỦA THỜI | GIAN"
                  className="font-mono text-[13px]"
                  error={errors.title}
                />
              </FormField>

              <FormField
                label="Mô tả ngắn"
                htmlFor="banner-subtitle"
                className="sm:col-span-2"
                error={errors.subtitle}
              >
                <Textarea
                  id="banner-subtitle"
                  rows={3}
                  value={form.subtitle}
                  maxLength={BANNER_MAX.subtitle}
                  onChange={set("subtitle")}
                  placeholder="Câu giới thiệu dưới tiêu đề, hiển thị trên hero slider..."
                />
              </FormField>
            </div>
            <div className="min-w-0 space-y-4">
              <BannerImageField
                coverPreview={coverPreview}
                coverIsNew={coverIsNew}
                openCover={openCover}
                clearCover={clearCover}
                pickCover={pickCover}
                handlePreviewLoad={handlePreviewLoad}
                coverInputRef={coverInputRef}
                imageTooSmall={imageTooSmall}
                imageMeta={imageMeta}
                error={errors.image}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  className="sm:col-span-2"
                  label="Thứ tự hiển thị"
                  htmlFor="banner-sort"
                  error={errors.sort_order}
                >
                  <Input
                    id="banner-sort"
                    type="number"
                    min={0}
                    step={1}
                    value={form.sort_order}
                    onChange={set("sort_order")}
                    placeholder="0"
                    className="tabular-nums"
                    error={errors.sort_order}
                  />
                </FormField>

                <FormField
                  label="Bắt đầu hiển thị"
                  htmlFor="banner-start"
                  error={errors.start_date}
                >
                  <Input
                    id="banner-start"
                    type="datetime-local"
                    value={form.start_date}
                    onChange={set("start_date")}
                    className="h-11 text-[13px] tabular-nums"
                    error={errors.start_date}
                  />
                </FormField>

                <FormField
                  label="Kết thúc hiển thị"
                  htmlFor="banner-end"
                  error={errors.end_date}
                >
                  <Input
                    id="banner-end"
                    type="datetime-local"
                    value={form.end_date}
                    onChange={set("end_date")}
                    className="h-11 text-[13px] tabular-nums"
                    error={errors.end_date}
                  />
                </FormField>
              </div>
            </div>
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
            {banner ? "Lưu thay đổi" : "Tạo banner"}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
};

const BannerFormModal = ({
  open,
  banner,
  saving = false,
  onSubmit,
  onClose,
}) => {
  if (!open) return null;

  return (
    <Dialog open onOpenChange={(next) => !next && onClose?.()}>
      <DialogContent className="flex max-h-[90dvh] w-full max-w-5xl flex-col">
        <BannerFormBody
          key={banner?.id ?? "new"}
          banner={banner}
          saving={saving}
          onSubmit={onSubmit}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default BannerFormModal;
