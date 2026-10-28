import { useCallback, useState } from "react";
import { slugify } from "../utils/slugify";

/**
 * slug là UNIQUE và backend không tự sinh → tự điền từ tên cho tới khi admin
 * sửa tay. Dùng cho form thương hiệu và danh mục.
 */
export const useSlugField = (setForm) => {
  const [touched, setTouched] = useState(false);

  const setName = useCallback(
    (value) =>
      setForm((prev) =>
        touched
          ? { ...prev, name: value }
          : { ...prev, name: value, slug: slugify(value) },
      ),
    [setForm, touched],
  );

  const setSlug = useCallback(
    (value) => {
      setTouched(true);
      setForm((prev) => ({ ...prev, slug: value }));
    },
    [setForm],
  );

  // Đổi đối tượng đang chọn: component form được remount nên không cần reset thủ công
  return { setName, setSlug, slugTouched: touched };
};

export default useSlugField;
