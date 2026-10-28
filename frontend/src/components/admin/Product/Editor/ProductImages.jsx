import { Image as ImageIcon, Plus, Upload, X } from "lucide-react";
import { Badge } from "../../../ui/badge";
import FormField from "../../Common/FormField";
import FormSection from "../../Common/FormSection";
import { IMAGE_MAX_MB } from "../../../../constants/upload";

// products.image_url (1 ảnh chính) · products.image_gallery (JSON mảng path Cloudinary)
const ProductImages = ({
  imagePreview,
  imageInputRef,
  pickImage,
  galleryPreviews,
  galleryInputRef,
  addGalleryFiles,
  removeGalleryItem,
  existingCount,
}) => (
  <FormSection
    title="Hình ảnh"
    hint={`JPG/PNG/WebP, tối đa ${IMAGE_MAX_MB}MB mỗi file`}
    icon={ImageIcon}
    actions={
      galleryPreviews.length > 0 ? (
        <Badge variant="muted" className="shrink-0 tabular-nums">
          {galleryPreviews.length}
        </Badge>
      ) : null
    }
  >
    <FormField label="Ảnh đại diện">
      <button
        type="button"
        onClick={() => imageInputRef.current?.click()}
        className="group relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-border bg-navy-50/60 transition-colors hover:border-navy-300 focus-visible:shadow-[0_0_0_3px_rgba(15,42,74,0.14)] focus-visible:outline-none dark:bg-navy-500/8"
      >
        {imagePreview ? (
          <>
            <img
              src={imagePreview}
              alt="Ảnh đại diện"
              className="h-full w-full object-cover"
            />
            <span className="absolute inset-0 flex items-center justify-center bg-navy-900/55 opacity-0 transition-opacity group-hover:opacity-100">
              <Upload className="h-5 w-5 text-white" strokeWidth={2} />
            </span>
          </>
        ) : (
          <span className="flex flex-col items-center gap-1.5 text-muted-foreground">
            <Upload className="h-6 w-6" strokeWidth={1.8} />
            <span className="text-[11px] font-semibold uppercase tracking-[0.02em]">
              Tải ảnh lên
            </span>
          </span>
        )}
      </button>
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={pickImage}
      />
    </FormField>

    <FormField label="Bộ sưu tập ảnh">
      <div className="grid grid-cols-4 gap-2">
        {galleryPreviews.map((url, index) => {
          const pending = index >= existingCount;
          return (
            <div
              key={`${url}-${index}`}
              className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-navy-50"
            >
              <img
                src={url}
                alt={`Ảnh ${index + 1}`}
                className="h-full w-full object-cover"
              />
              {pending && (
                <span className="absolute bottom-0 left-0 rounded-tr-md bg-warning px-1 py-0.5 text-[11px] font-bold uppercase text-white">
                  Mới
                </span>
              )}
              <button
                type="button"
                onClick={() => removeGalleryItem(index)}
                aria-label={`Xóa ảnh ${index + 1}`}
                className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-md bg-navy-900/70 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-sale"
              >
                <X className="h-3 w-3" strokeWidth={2.5} />
              </button>
            </div>
          );
        })}

        <button
          type="button"
          onClick={() => galleryInputRef.current?.click()}
          className="flex aspect-square items-center justify-center rounded-lg border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-navy-300 hover:text-navy-600 focus-visible:shadow-[0_0_0_3px_rgba(15,42,74,0.14)] focus-visible:outline-none"
        >
          <Plus className="h-5 w-5" strokeWidth={2} />
        </button>
      </div>
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={addGalleryFiles}
      />
    </FormField>
  </FormSection>
);

export default ProductImages;
