import { ClipboardList } from "lucide-react";
import DetailSection from "./DetailSection";

const addressOf = (order) =>
  [order.address_line, order.ward, order.district, order.city]
    .filter(Boolean)
    .join(", ") || "Chưa cập nhật";

// Cột phụ hẹp nên mỗi dòng một thông tin: nhãn trái · giá trị phải
const Fact = ({ label, children }) => (
  <div className="flex items-baseline gap-3 bg-card px-5 py-2.5">
    <dt className="w-[104px] shrink-0 text-xs font-bold uppercase tracking-[0.02em] text-muted-foreground">
      {label}
    </dt>
    <dd className="min-w-0 flex-1 text-[13px] font-semibold break-words text-card-foreground">
      {children}
    </dd>
  </div>
);

// Toàn bộ thông tin đơn + khách trong một bảng một cột (đối soát nhanh)
const OrderFactTable = ({ order }) => {
  const email = order.email || order.user?.email;
  const name =
    order.full_name ||
    order.user?.full_name ||
    order.user?.username ||
    "Khách vãng lai";

  return (
    <DetailSection
      title="Thông tin đơn"
      icon={ClipboardList}
      bodyClassName="p-0"
    >
      <dl className="divide-y divide-border">
        <Fact label="Khách hàng">{name}</Fact>
        <Fact label="Điện thoại">
          {order.phone_number ? (
            <a
              href={`tel:${order.phone_number}`}
              className="font-mono whitespace-nowrap tabular-nums hover:text-navy-700 dark:hover:text-navy-100"
            >
              {order.phone_number}
            </a>
          ) : (
            "Chưa cập nhật"
          )}
        </Fact>
        <Fact label="Email">{email || "Không có"}</Fact>
        <Fact label="Tài khoản">
          {order.user?.username ? (
            <span className="font-mono">{order.user.username}</span>
          ) : (
            "Khách vãng lai"
          )}
        </Fact>
        <Fact label="Giao tới">{addressOf(order)}</Fact>
        <Fact label="Phương thức">
          {order.payment_method ? (
            <span className="uppercase">{order.payment_method}</span>
          ) : (
            "Chưa chọn"
          )}
        </Fact>
        <Fact label="Trạng thái tiền">
          {order.payment_status === "paid" ? (
            <span className="whitespace-nowrap text-success">Đã thu</span>
          ) : (
            <span className="whitespace-nowrap text-warning">Chờ thu</span>
          )}
        </Fact>
        <Fact label="Ghi chú khách">
          {order.order_note ? (
            order.order_note
          ) : (
            <span className="font-normal text-muted-foreground">
              Không có ghi chú nào từ khách.
            </span>
          )}
        </Fact>
      </dl>
    </DetailSection>
  );
};

export default OrderFactTable;
