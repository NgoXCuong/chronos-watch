import FilterSelect from "../Common/FilterSelect";
import {
  ORDER_STATUS,
  ORDER_STATUS_KEYS,
} from "../../../constants/orderStatus";

// Bỏ dấu chấm màu của "Tất cả" để phân biệt với trạng thái đang chọn
const STATUS_OPTIONS = [
  { value: "", label: "Tất cả" },
  ...ORDER_STATUS_KEYS.map((key) => ({
    value: key,
    label: ORDER_STATUS[key].label,
    dot: ORDER_STATUS[key].dot,
  })),
];

// Lọc đơn hàng theo trạng thái — đặt trong slot children của SearchBanner
const OrderStatusFilter = ({ activeStatus, onStatusChange }) => (
  <FilterSelect
    label="Trạng thái"
    value={activeStatus}
    onChange={onStatusChange}
    options={STATUS_OPTIONS}
  />
);

export default OrderStatusFilter;
