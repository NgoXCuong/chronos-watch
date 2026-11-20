import { CircleAlert } from "lucide-react";
import ImagePickerField from "../Common/ImagePickerField";
import { IMAGE_MAX_MB } from "../../../constants/upload";

export default function BannerImageField({
  coverPreview,
  coverIsNew,
  openCover,
  clearCover,
  pickCover,
  handlePreviewLoad,
  coverInputRef,
  imageTooSmall,
  imageMeta,
  error,
}) {
  return (
    <div className="space-y-2 rounded-lg border border-border bg-muted/30 p-4">
      <ImagePickerField
        label="Ảnh banner"
        alt="Ảnh banner"
        wide
        contain
        hint={`Ảnh ngang 2:1, khuyến nghị 2400×1200 (tối thiểu 1920×960), JPG/PNG/WebP ≤${IMAGE_MAX_MB}MB.`}
        preview={coverPreview}
        isNew={coverIsNew}
        onOpen={openCover}
        onClear={clearCover}
        onSelect={pickCover}
        onPreviewLoad={handlePreviewLoad}
        inputRef={coverInputRef}
      />

      {error && <p className="text-xs font-semibold text-sale">{error}</p>}
      {imageTooSmall && (
        <p className="flex items-start gap-1 text-[11px] font-semibold leading-snug text-warning">
          <CircleAlert className="mt-0.5 h-3 w-3 shrink-0" strokeWidth={2} />
          Ảnh {imageMeta.width}×{imageMeta.height}px nhỏ hơn khuyến nghị
          1920×960 — dễ bị mờ khi phóng to. Nên upload lại ảnh gốc lớn hơn.
        </p>
      )}
    </div>
  );
}
