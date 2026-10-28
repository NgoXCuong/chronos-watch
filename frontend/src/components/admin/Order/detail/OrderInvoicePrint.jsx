import { formatCurrency, formatDate } from "../../../../utils/formatCurrency";
import {
  paymentMethodLabel,
  statusLabel,
} from "../../../../constants/orderStatus";

const addressOf = (order) =>
  [order.address_line, order.ward, order.district, order.city]
    .filter(Boolean)
    .join(", ") || "—";

const SumLine = ({ label, value, strong }) => (
  <div
    className={
      strong
        ? "flex justify-between border-t-2 border-navy-900 pt-2 text-[13px] font-extrabold text-navy-900"
        : "flex justify-between text-[12px] text-navy-700"
    }
  >
    <span>{label}</span>
    <span className="tabular-nums">{value}</span>
  </div>
);

// Bản in A4: ẩn hoàn toàn trên màn hình, chỉ hiện khi window.print()
const OrderInvoicePrint = ({ order }) => {
  const items = order.details || [];

  return (
    <div className="hidden print:block w-full max-w-[800px] mx-auto space-y-6 bg-white p-8 text-navy-900">
      <header className="flex items-start justify-between border-b-2 border-navy-900 pb-4">
        <div>
          <p className="text-2xl font-extrabold uppercase tracking-tight">
            Chronos Watch
          </p>
          <p className="mt-1 text-[11px] text-navy-700">
            Phan Tây Nhạc, Xuân Phương, Nam Từ Liêm, Hà Nội
          </p>
          <p className="text-[11px] text-navy-700">
            Hotline: 1900 8888 66 · contact@chronos-watch.com
          </p>
        </div>
        <div className="text-right">
          <p className="text-base font-extrabold uppercase">
            Hóa đơn bán hàng
          </p>
          <p className="mt-1 text-[11px] font-semibold">
            Mã đơn: <span className="font-mono">{order.order_code || `#${order.id}`}</span>
          </p>
          <p className="text-[11px] font-semibold">
            Ngày lập: {formatDate(new Date())}
          </p>
        </div>
      </header>

      <section className="grid grid-cols-2 gap-6 border-b border-navy-200 pb-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.02em] text-navy-500">
            Khách hàng
          </p>
          <p className="mt-1 text-[13px] font-bold uppercase">
            {order.full_name || "Khách vãng lai"}
          </p>
          <p className="text-[12px] text-navy-700">{order.phone_number || "—"}</p>
          <p className="text-[12px] leading-relaxed text-navy-700">
            {addressOf(order)}
          </p>
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.02em] text-navy-500">
            Thanh toán
          </p>
          <p className="mt-1 text-[12px] text-navy-700">
            Phương thức:{" "}
            <span className="font-bold">{paymentMethodLabel(order.payment_method)}</span>
          </p>
          <p className="text-[12px] text-navy-700">
            Trạng thái:{" "}
            <span className="font-bold uppercase">
              {order.payment_status === "paid" ? "Đã thanh toán" : "Chờ thu tiền"}
            </span>
          </p>
          <p className="text-[12px] text-navy-700">
            Tình trạng đơn: <span className="font-bold">{statusLabel(order.status)}</span>
          </p>
          <p className="text-[12px] text-navy-700">
            Ngày đặt: {formatDate(order.created_at)}
          </p>
        </div>
      </section>

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b-2 border-navy-900 bg-navy-50">
            <th className="w-8 py-2 px-2 text-left text-[11px] font-bold uppercase text-navy-700">
              STT
            </th>
            <th className="py-2 px-2 text-left text-[11px] font-bold uppercase text-navy-700">
              Sản phẩm
            </th>
            <th className="py-2 px-2 text-right text-[11px] font-bold uppercase text-navy-700">
              Đơn giá
            </th>
            <th className="w-16 py-2 px-2 text-center text-[11px] font-bold uppercase text-navy-700">
              SL
            </th>
            <th className="w-28 py-2 px-2 text-right text-[11px] font-bold uppercase text-navy-700">
              Thành tiền
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={item.id} className="border-b border-navy-100">
              <td className="py-2 px-2 text-[12px] text-navy-700">{idx + 1}</td>
              <td className="py-2 px-2">
                <p className="text-[12px] font-bold">
                  {item.product_name || item.product?.name || "—"}
                </p>
                <p className="text-[11px] font-mono uppercase text-navy-500">
                  {item.sku || item.product?.sku || `#${item.product_id}`}
                </p>
              </td>
              <td className="py-2 px-2 text-right text-[12px] tabular-nums text-navy-700">
                {formatCurrency(item.price)}
              </td>
              <td className="py-2 px-2 text-center text-[12px] font-bold tabular-nums">
                {item.quantity}
              </td>
              <td className="py-2 px-2 text-right text-[12px] font-bold tabular-nums">
                {formatCurrency(item.price * item.quantity)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <section className="flex justify-end">
        <div className="w-[280px] space-y-1.5">
          <SumLine label="Tổng tiền hàng" value={formatCurrency(order.subtotal)} />
          <SumLine
            label="Phí vận chuyển"
            value={
              Number(order.shipping_fee) === 0
                ? "Miễn phí"
                : formatCurrency(order.shipping_fee)
            }
          />
          {Number(order.discount_amount) > 0 && (
            <SumLine
              label="Giảm giá"
              value={`−${formatCurrency(order.discount_amount)}`}
            />
          )}
          <SumLine
            label="Tổng cộng"
            value={formatCurrency(order.total_amount)}
            strong
          />
        </div>
      </section>

      <footer className="grid grid-cols-2 gap-8 pt-10 text-center">
        <div>
          <p className="text-[11px] font-bold uppercase">Người mua hàng</p>
          <p className="text-[11px] italic text-navy-500">
            (Ký, ghi rõ họ tên)
          </p>
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase">Người lập hóa đơn</p>
          <p className="text-[11px] italic text-navy-500">
            (Ký, ghi rõ họ tên)
          </p>
        </div>
      </footer>

      <p className="border-t border-navy-200 pt-4 text-center text-[11px] text-navy-700">
        Cảm ơn quý khách đã lựa chọn Chronos Watch. Vui lòng kiểm tra sản phẩm
        trước khi thanh toán — hóa đơn có giá trị đối soát trong 30 ngày.
      </p>
    </div>
  );
};

export default OrderInvoicePrint;
