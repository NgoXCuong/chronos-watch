import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import productApi from "../api/product.api";
import brandApi from "../api/brand.api";
import categoryApi from "../api/category.api";
import { rejectImage } from "../utils/imageFile";
import { slugify } from "../utils/slugify";
import {
  EMPTY_FORM,
  buildPayload,
  flattenCategories,
  toFormShape,
  toGalleryArray,
  toRows,
  validateForm,
} from "../utils/productForm";

/**
 * Toàn bộ state của form thêm/sửa sản phẩm: giá trị theo cột trong bảng products,
 * brands/categories để chọn, ảnh + gallery (object URL có revoke), validate và submit.
 */
export const useProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState(EMPTY_FORM);
  const [snapshot, setSnapshot] = useState(EMPTY_FORM);
  const [product, setProduct] = useState(null);
  const [errors, setErrors] = useState({});
  const [showErrors, setShowErrors] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [existingGallery, setExistingGallery] = useState([]);
  const [newGalleryFiles, setNewGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [slugTouched, setSlugTouched] = useState(false);

  const imageInputRef = useRef(null);
  const galleryInputRef = useRef(null);
  const objectUrls = useRef([]);

  const keepUrl = useCallback((file) => {
    const url = URL.createObjectURL(file);
    objectUrls.current.push(url);
    return url;
  }, []);

  useEffect(
    () => () => {
      objectUrls.current.forEach((url) => URL.revokeObjectURL(url));
      objectUrls.current = [];
    },
    [],
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [brandRes, catRes] = await Promise.all([
          brandApi.getAll({ limit: 200 }),
          categoryApi.getAll(),
        ]);
        if (cancelled) return;
        setBrands(toRows(brandRes).map((b) => ({ id: b.id, name: b.name })));
        setCategories(flattenCategories(toRows(catRes)));
      } catch (err) {
        if (!cancelled) toast.error("Không tải được danh sách thương hiệu/danh mục");
        console.error(err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    let cancelled = false;
    (async () => {
      try {
        const data = await productApi.getAdminDetail(id);
        if (cancelled) return;
        const shape = toFormShape(data);
        setForm(shape);
        setSnapshot(shape);
        setProduct(data);
        setSlugTouched(!!shape.slug);
        const gallery = toGalleryArray(data.image_gallery);
        setExistingGallery(gallery);
        setGalleryPreviews(gallery);
      } catch (err) {
        if (cancelled) return;
        console.error(err);
        toast.error("Không tìm thấy sản phẩm cần chỉnh sửa");
        navigate("/admin/products");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, isEdit, navigate]);

  // Sau lần submit đầu, sửa đến đâu validate đến đó
  useEffect(() => {
    if (showErrors) setErrors(validateForm(form));
  }, [form, showErrors]);

  const setField = useCallback(
    (key, value) => {
      setForm((prev) => {
        if (key !== "name") return { ...prev, [key]: value };
        const next = { ...prev, name: value };
        // slug là UNIQUE và backend không tự sinh → tự điền khi admin chưa sửa tay
        if (!slugTouched) next.slug = slugify(value);
        return next;
      });
    },
    [slugTouched],
  );

  const setSlug = useCallback((value) => {
    setSlugTouched(true);
    setForm((prev) => ({ ...prev, slug: value }));
  }, []);

  const pickImage = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const reason = rejectImage(file);
    if (reason) return toast.error(reason);
    setImageFile(file);
    setImagePreview(keepUrl(file));
  };

  const addGalleryFiles = (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    const accepted = [];
    files.forEach((file) => {
      const reason = rejectImage(file);
      if (reason) toast.error(reason);
      else accepted.push(file);
    });
    if (!accepted.length) return;
    setNewGalleryFiles((prev) => [...prev, ...accepted]);
    setGalleryPreviews((prev) => [
      ...prev,
      ...accepted.map((file) => keepUrl(file)),
    ]);
  };

  // Index gộp [ảnh cũ ..., ảnh mới ...]; ảnh mới tính từ cuối existingGallery
  const removeGalleryItem = (index) => {
    if (index < existingGallery.length) {
      setExistingGallery((prev) => prev.filter((_, i) => i !== index));
      setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
      return;
    }
    const newIndex = index - existingGallery.length;
    setNewGalleryFiles((prev) => prev.filter((_, i) => i !== newIndex));
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const dirty = useMemo(
    () =>
      JSON.stringify(form) !== JSON.stringify(snapshot) ||
      !!imageFile ||
      newGalleryFiles.length > 0 ||
      existingGallery.length !== toGalleryArray(product?.image_gallery).length,
    [form, snapshot, imageFile, newGalleryFiles, existingGallery, product],
  );

  const submit = async () => {
    const nextErrors = validateForm(form);
    setErrors(nextErrors);
    setShowErrors(true);
    const count = Object.keys(nextErrors).length;
    if (count > 0) {
      toast.error(`Còn ${count} trường chưa hợp lệ — xem hướng dẫn trong form.`);
      return;
    }

    setSaving(true);
    try {
      const payload = buildPayload(form, {
        imageFile,
        newGalleryFiles,
        existingGallery,
      });
      if (isEdit) {
        await productApi.update(id, payload);
        toast.success("Cập nhật sản phẩm thành công!");
      } else {
        await productApi.create(payload);
        toast.success("Thêm sản phẩm thành công!");
      }
      setSnapshot(form);
      navigate("/admin/products");
    } catch (err) {
      toast.error(err?.message || "Có lỗi xảy ra khi lưu sản phẩm");
    } finally {
      setSaving(false);
    }
  };

  const cancel = () => {
    if (dirty && !window.confirm("Bỏ tất cả thay đổi chưa lưu?")) return;
    navigate("/admin/products");
  };

  return {
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
    imageFile,
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
  };
};

export default useProductForm;
