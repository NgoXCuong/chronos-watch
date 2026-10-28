import {
  CANCELABLE_STATUSES,
  CLOSED_STATUSES,
  TRANSFER_PAYMENT_METHODS,
  WARRANTY_VISIBLE_STATUSES,
} from "@/constants/myOrders";

/**
 * DECIMAL(15,0) qua MySQL driver về dạng CHUỖI ("100080000") — mọi phép tính hoặc
 * so sánh số đều phải qua đây, không `Number(order.total_amount) > x` trực tiếp.
 */
export const toMoney = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
};

export const orderCode = (order) => order?.order_code || `#${order?.id ?? ""}`;

/** Một dòng sản phẩm trong đơn: snapshot của đơn cũ thắng, product hiện tại chỉ fallback. */
export const orderItems = (order) =>
  (order?.details || []).map((detail, index) => ({
    key: detail.id ?? `${order?.id}-${index}`,
    id: detail.product_id ?? detail.id,
    name: detail.product_name || detail.product?.name || "Sản phẩm đã gỡ",
    image: detail.product_image || detail.product?.image_url || "",
    sku: detail.sku || detail.product?.sku || "",
    slug: detail.product?.slug || "",
    productId: detail.product?.id ?? detail.product_id ?? null,
    status: detail.product?.status ?? null,
    quantity: toMoney(detail.quantity) || 1,
    unitPrice: toMoney(detail.price),
    lineTotal: toMoney(detail.subtotal) || toMoney(detail.price),
    warrantyMonths: detail.warranty_months == null ? null : toMoney(detail.warranty_months),
  }));

export const orderSummary = (order) => {
  const items = orderItems(order);
  return {
    items,
    firstItem: items[0] || null,
    extraCount: Math.max(0, items.length - 1),
    unitCount: items.reduce((sum, item) => sum + item.quantity, 0),
  };
};

/** Khách tự báo "đã chuyển khoản" khi đơn chuyển khoản vẫn chưa được ghi nhận đã trả. */
export const needsTransferAction = (order) =>
  Boolean(order) &&
  TRANSFER_PAYMENT_METHODS.includes(order.payment_method) &&
  order.payment_status !== "paid";

export const canCancelOrder = (order) =>
  Boolean(order) && CANCELABLE_STATUSES.includes(order.status);

/** Đơn đã giao là đơn khách có thể đánh giá và có phiếu bảo hành. */
export const isDeliveredOrder = (order) => order?.status === "delivered";

/** Link đánh giá: deep link #reviews trên trang sản phẩm (tab đọc từ hash). */
export const reviewLink = (item) =>
  item?.status === "inactive"
    ? ""
    : item?.slug || item?.productId
      ? `/products/${item.slug || item.productId}#reviews`
      : "";

/** Số tiền còn phải trả = tổng đơn khi chưa paid (COD thì đối chiếu khi nhận). */
export const unpaidAmount = (order) =>
  order?.payment_status === "paid" ? 0 : toMoney(order?.total_amount);

/** Địa chỉ chỉn một dòng — dùng snapshot của đơn, không tra lại sổ địa chỉ (có thể đã sửa/xóa). */
export const addressLine = (order) =>
  [order?.address_line, order?.ward, order?.district, order?.city]
    .map((part) => String(part || "").trim())
    .filter(Boolean)
    .join(", ");

/** Lịch sử đơn tăng dần theo thời gian để dựng timeline (mảng nhỏ, không phân trang). */
export const orderHistory = (order) =>
  [...(order?.history || [])].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  );

/** Đơn đã dừng (hủy/hoàn) — stepper 5 mốc không còn ý nghĩa, thay bằng banner kết thúc. */
export const isClosedOrder = (order) =>
  CLOSED_STATUSES.includes(order?.status);

/** Đường dẫn tới phiếu bảo hành sinh ra từ chính đơn này. */
export const warrantiesLinkForOrder = (orderId) => `/warranties?order=${orderId}`;

/** Đơn đã giao (kể cả hoàn trả sau đó) thì mới có phiếu bảo hành để xem. */
export const showsWarrantyLink = (order) =>
  WARRANTY_VISIBLE_STATUSES.includes(order?.status);
