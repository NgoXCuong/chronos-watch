/** Bảng mô tả các trường của form địa chỉ — dialog chỉ việc map ra Field. */
export const EMPTY_ADDRESS = {
  recipient_name: "",
  recipient_phone: "",
  address_line: "",
  ward: "",
  district: "",
  city: "",
  is_default: false,
};

export const ADDRESS_FIELDS = [
  {
    name: "recipient_name",
    label: "Người nhận",
    placeholder: "Họ và tên người nhận",
    required: true,
    span: "sm:col-span-1",
  },
  {
    name: "recipient_phone",
    label: "Số điện thoại",
    placeholder: "09xx xxx xxx",
    required: true,
    type: "tel",
    span: "sm:col-span-1",
  },
  {
    name: "address_line",
    label: "Số nhà, đường",
    placeholder: "Số nhà, tên đường, thôn/xóm",
    required: true,
    span: "sm:col-span-2",
  },
  { name: "ward", label: "Phường/Xã", placeholder: "Phường/Xã", span: "sm:col-span-1" },
  { name: "district", label: "Quận/Huyện", placeholder: "Quận/Huyện", span: "sm:col-span-1" },
  {
    name: "city",
    label: "Tỉnh/Thành",
    placeholder: "Tỉnh/Thành phố",
    required: true,
    span: "sm:col-span-2",
  },
];

/** Trường bắt buộc theo CSDL (user_address.model) — dùng để chặn gửi thiếu trước khi gọi API. */
export const REQUIRED_ADDRESS_FIELDS = ADDRESS_FIELDS.filter((field) => field.required).map(
  (field) => field.name,
);
