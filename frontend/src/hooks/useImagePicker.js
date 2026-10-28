import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { rejectImage } from "../utils/imageFile";

/**
 * Một ảnh đại diện/logo trong form admin: giữ File chưa upload + object URL có revoke,
 * cho phép đổi đối tượng đang chọn (reset(url)) mà không lẫn ảnh của dòng trước.
 */
export const useImagePicker = (initialUrl = null) => {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [objectUrl, setObjectUrl] = useState(null);
  const [existingUrl, setExistingUrl] = useState(initialUrl || null);

  useEffect(
    () => () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    },
    [objectUrl],
  );

  const open = useCallback(() => inputRef.current?.click(), []);

  const pick = useCallback((event) => {
    const chosen = event.target.files?.[0];
    event.target.value = "";
    if (!chosen) return null;
    const reason = rejectImage(chosen);
    if (reason) {
      toast.error(reason);
      return null;
    }
    setFile(chosen);
    setObjectUrl(URL.createObjectURL(chosen));
    return chosen;
  }, []);

  const reset = useCallback((url) => {
    setFile(null);
    setObjectUrl(null);
    setExistingUrl(url || null);
  }, []);

  const clear = useCallback(() => reset(null), [reset]);

  return {
    inputRef,
    file,
    preview: objectUrl || existingUrl || null,
    isNew: !!objectUrl,
    open,
    pick,
    clear,
    reset,
  };
};

export default useImagePicker;
