import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import userAddressApi from "@/api/user_address.api";

const message = (error, fallback) => error?.response?.data?.message || fallback;

/**
 * Sổ địa chỉ của khách: một chỗ duy nhất quản lý danh sách + mọi thao tác ghi,
 * để tab chỉ việc hiển thị (Rule 1 — logic lặp lại tách thành hook).
 */
export const useMyAddresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchAddresses = useCallback(async () => {
    try {
      const response = await userAddressApi.getAll();
      setAddresses(response.data || []);
    } catch (error) {
      toast.error(message(error, "Không tải được sổ địa chỉ"));
      setAddresses([]);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  // Một thao tác ghi một lúc: nút trong dialog/card khóa khi đang gửi.
  const mutate = useCallback(async (call, successMessage, fallbackMessage) => {
    setSaving(true);
    try {
      await call();
      toast.success(successMessage);
      await fetchAddresses();
      return true;
    } catch (error) {
      toast.error(message(error, fallbackMessage));
      return false;
    } finally {
      setSaving(false);
    }
  }, [fetchAddresses]);

  const save = useCallback(
    (payload, id) =>
      id
        ? mutate(
            () => userAddressApi.update(id, payload),
            "Đã cập nhật địa chỉ",
            "Chưa cập nhật được địa chỉ",
          )
        : mutate(
            () => userAddressApi.create(payload),
            "Đã thêm địa chỉ mới",
            "Chưa thêm được địa chỉ",
          ),
    [mutate],
  );

  const remove = useCallback(
    (id) => mutate(() => userAddressApi.delete(id), "Đã xóa địa chỉ", "Chưa xóa được địa chỉ"),
    [mutate],
  );

  const setDefault = useCallback(
    (id) =>
      mutate(
        () => userAddressApi.setDefault(id),
        "Đã đặt lại địa chỉ mặc định",
        "Chưa đổi được địa chỉ mặc định",
      ),
    [mutate],
  );

  return { addresses, loading: !loaded, saving, save, remove, setDefault, refresh: fetchAddresses };
};

export default useMyAddresses;
