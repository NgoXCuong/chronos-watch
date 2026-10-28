import AdminHeader from "../../../components/admin/Common/AdminHeader";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { useProductForm } from "../../../hooks/useProductForm";
import BasicInfo from "../../../components/admin/Product/Editor/BasicInfo";
import ProductCategorization from "../../../components/admin/Product/Editor/ProductCategorization";
import ProductDescription from "../../../components/admin/Product/Editor/ProductDescription";
import ProductImages from "../../../components/admin/Product/Editor/ProductImages";
import ProductPerformance from "../../../components/admin/Product/Editor/ProductPerformance";
import ProductPricing from "../../../components/admin/Product/Editor/ProductPricing";
import ProductSpecifications from "../../../components/admin/Product/Editor/ProductSpecifications";

const LoadingState = () => (
  <div className="flex h-96 items-center justify-center">
    <span className="h-10 w-10 animate-spin rounded-full border-4 border-navy-600 border-t-transparent" />
  </div>
);

const ProductEditorPage = () => {
  const state = useProductForm();
  const {
    isEdit,
    loading,
    saving,
    product,
    form,
    setForm,
    setField,
    setSlug,
    slugTouched,
    errors,
    brands,
    categories,
    imagePreview,
    pickImage,
    existingGallery,
    galleryPreviews,
    addGalleryFiles,
    removeGalleryItem,
    imageInputRef,
    galleryInputRef,
    dirty,
    submit,
    cancel,
  } = state;

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-5 pb-16">
      <AdminHeader
        title={isEdit ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
        subtitle={
          isEdit
            ? product?.name || "Cập nhật thông tin sản phẩm"
            : "Điền đủ các trường bắt buộc để sản phẩm hiển thị trên website"
        }
        actions={
          <>
            {dirty && (
              <Badge variant="warning" className="mr-1 shrink-0">
                Chưa lưu
              </Badge>
            )}
            <Button type="button" variant="outline" onClick={cancel}>
              Hủy
            </Button>
            <Button type="button" onClick={submit} loading={saving}>
              {saving ? "Đang lưu" : "Lưu sản phẩm"}
            </Button>
          </>
        }
      />

      <form
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
        className="grid grid-cols-1 items-start gap-4 xl:grid-cols-[minmax(0,1fr)_380px]"
      >
        <div className="min-w-0 space-y-4">
          <BasicInfo
            form={form}
            setField={setField}
            setSlug={setSlug}
            errors={errors}
            slugTouched={slugTouched}
          />
          <ProductDescription form={form} setField={setField} />
          <ProductSpecifications form={form} setForm={setForm} errors={errors} />
        </div>

        <div className="min-w-0 space-y-4">
          <ProductCategorization
            form={form}
            setField={setField}
            errors={errors}
            brands={brands}
            categories={categories}
          />
          <ProductPricing form={form} setField={setField} errors={errors} />
          <ProductImages
            imagePreview={imagePreview}
            imageInputRef={imageInputRef}
            pickImage={pickImage}
            galleryPreviews={galleryPreviews}
            galleryInputRef={galleryInputRef}
            addGalleryFiles={addGalleryFiles}
            removeGalleryItem={removeGalleryItem}
            existingCount={existingGallery.length}
          />
          {isEdit && <ProductPerformance product={product} />}
        </div>
      </form>
    </div>
  );
};

export default ProductEditorPage;
