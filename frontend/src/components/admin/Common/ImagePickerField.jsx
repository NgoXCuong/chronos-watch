import { Image as ImageIcon, Plus, Upload, X } from "lucide-react";
import FormField from "./FormField";
import { Button } from "../../ui/button";
import { cn } from "@/lib/utils";
import { IMAGE_ACCEPT } from "../../../constants/upload";

/**
 * Ô chọn MỘT ảnh (logo/ảnh danh mục) cho form admin: box xem trước + nút đổi/bỏ + hidden input.
 * inputRef và handler nhận từ props (đã tách thành biến cục bộ ở component cha) — React Compiler
 * chặn đọc thuộc tính chứa ref của object trả về từ hook ngay trong JSX.
 */
const ImagePickerField = ({
  label = "Hình đại diện",
  hint,
  preview,
  isNew = false,
  onOpen,
  onClear,
  onSelect,
  inputRef,
  onPreviewLoad,
  alt = "Ảnh",
  contain = false,
  wide = false,
  accept = IMAGE_ACCEPT,
  className,
}) => (
  <FormField label={label} hint={hint} className={className}>
    <div className="flex items-center gap-2.5">
      <button
        type="button"
        onClick={onOpen}
        className={cn(
          "flex h-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-border bg-navy-50/60 transition-colors hover:border-navy-300 focus-visible:shadow-[0_0_0_3px_rgba(15,42,74,0.14)] focus-visible:outline-none dark:bg-navy-500/8",
          wide ? "h-20 w-40" : "w-16",
        )}
      >
        {preview ? (
          <img
            src={preview}
            alt={alt}
            onLoad={onPreviewLoad}
            className={cn("h-full w-full", contain ? "object-contain p-1" : "object-cover")}
          />
        ) : (
          <Upload className="h-4 w-4 text-muted-foreground" strokeWidth={2} />
        )}
      </button>

      <div className="min-w-0 flex-1 space-y-1.5">
        <Button
          type="button"
          variant="buy"
          size="sm"
          onClick={onOpen}
          className="w-full gap-1.5 px-3"
        >
          {preview ? (
            <>
              <ImageIcon className="h-3.5 w-3.5" strokeWidth={2} /> Đổi ảnh
            </>
          ) : (
            <>
              <Plus className="h-3.5 w-3.5" strokeWidth={2.5} /> Chọn ảnh
            </>
          )}
        </Button>

        {isNew && (
          <button
            type="button"
            onClick={onClear}
            className="flex w-full items-center justify-center gap-1 rounded-lg border border-border bg-card py-1 text-[11px] font-bold uppercase tracking-[0.02em] text-muted-foreground transition-colors hover:border-sale hover:text-sale"
          >
            <X className="h-3 w-3" strokeWidth={2.5} /> Bỏ ảnh vừa chọn
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={onSelect}
      />
    </div>
  </FormField>
);

export default ImagePickerField;
