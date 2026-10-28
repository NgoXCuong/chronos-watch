import { ADDRESS_FIELDS, EMPTY_ADDRESS, REQUIRED_ADDRESS_FIELDS } from "@/constants/addresses";

/** Địa chỉ trong CSDL → form dialog (chỉ các trường khách sửa được). */
export const toAddressForm = (address) => {
  const values = Object.fromEntries(
    ADDRESS_FIELDS.map((field) => [field.name, address?.[field.name] ?? ""]),
  );
  return { ...EMPTY_ADDRESS, ...values, is_default: Boolean(address?.is_default) };
};

/** "Số 12, P. Bến Nghé, Q.1, TP.HCM" — bỏ trống phần không có, không dấu phẩy thừa. */
export const formatAddress = (address) =>
  [address?.address_line, address?.ward, address?.district, address?.city]
    .map((part) => String(part || "").trim())
    .filter(Boolean)
    .join(", ");

/** Trả về { errors } theo tên field; rỗng nghĩa là hợp lệ. */
export const validateAddressForm = (form) => {
  const errors = {};
  REQUIRED_ADDRESS_FIELDS.forEach((name) => {
    if (!String(form[name] || "").trim()) errors[name] = "Không được để trống";
  });
  const phone = String(form.recipient_phone || "").replace(/\s+/g, "");
  if (phone && !/^\d{8,12}$/.test(phone)) errors.recipient_phone = "Số điện thoại không hợp lệ";
  return errors;
};
