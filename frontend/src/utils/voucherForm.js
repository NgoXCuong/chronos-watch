import { VOUCHER_CODE_PATTERN, VOUCHER_MAX } from "../constants/voucherForm";

const pad = (n) => String(n).padStart(2, "0");

// start_date/end_date trong DB là DATE NOT NULL — form dùng input type="date" (yyyy-MM-dd)
export const toLocalDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

const isInt = (value) => Number.isInteger(Number(value)) && Number(value) >= 0;

export const voucherFormOf = (v) => ({
  code: v?.code || '', discount_type: v?.discount_type || 'percentage', discount_value: v?.discount_value ?? '',
  max_discount: Number(v?.max_discount) || '', min_order_value: Number(v?.min_order_value) || '',
  usage_limit: v?.usage_limit ?? '', per_user_limit: v?.per_user_limit ?? '',
  start_date: toLocalDate(v?.start_date), end_date: toLocalDate(v?.end_date),
  is_public: v ? Boolean(v.is_public) : true,
});

export const validateVoucher = (form = {}) => {
  const errors = {};
  const code = (form.code || "").trim().toUpperCase();

  if (!code) errors.code = "Mã voucher không được để trống.";
  else if (code.length > VOUCHER_MAX.code)
    errors.code = `Mã voucher tối đa ${VOUCHER_MAX.code} ký tự.`;
  else if (!VOUCHER_CODE_PATTERN.test(code))
    errors.code = "Mã voucher chỉ dùng chữ hoa, số, - và _.";

  const value = Number(form.discount_value);
  if (form.discount_value === "" || form.discount_value === null)
    errors.discount_value = "Chưa nhập giá trị giảm.";
  else if (!Number.isFinite(value) || value <= 0)
    errors.discount_value = "Giá trị giảm phải lớn hơn 0.";
  else if (form.discount_type === "percentage" && value > 100)
    errors.discount_value = "Giảm phần trăm không thể vượt quá 100%.";

  if (form.max_discount && !isInt(form.max_discount))
    errors.max_discount = "Mức giảm tối đa phải là số ≥ 0.";

  if (form.min_order_value && !isInt(form.min_order_value))
    errors.min_order_value = "Giá trị đơn tối thiểu phải là số ≥ 0.";

  if (form.usage_limit !== "" && !Number.isInteger(Number(form.usage_limit)))
    errors.usage_limit = "Giới hạn sử dụng phải là số nguyên.";

  if (form.per_user_limit !== "" && !isInt(form.per_user_limit))
    errors.per_user_limit = "Giới hạn lượt/người phải là số nguyên ≥ 0.";

  if (!form.start_date) errors.start_date = "Chọn ngày bắt đầu.";
  if (!form.end_date) errors.end_date = "Chọn ngày kết thúc.";
  if (
    form.start_date &&
    form.end_date &&
    new Date(form.start_date) > new Date(form.end_date)
  )
    errors.end_date = "Ngày kết thúc phải sau ngày bắt đầu.";

  return errors;
};

// usage_limit/per_user_limit để trống = NULL (không giới hạn) — validateVoucher phía
// backend bỏ qua khi NULL; discount_value làm tròn vì cột là DECIMAL(15,0)
export const buildVoucherPayload = (form = {}) => {
  const num = (value) => (value === "" || value === null ? null : Number(value));

  return {
    is_public: Boolean(form.is_public),
    code: (form.code || "").trim().toUpperCase(),
    discount_type: form.discount_type,
    discount_value: Math.round(Number(form.discount_value)),
    max_discount:
      form.discount_type === "percentage" ? num(form.max_discount) : null,
    min_order_value: num(form.min_order_value),
    start_date: form.start_date,
    end_date: form.end_date,
    usage_limit: num(form.usage_limit),
    per_user_limit: num(form.per_user_limit),
  };
};
