import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import UserAddress from "../models/user_address.model.js";
import AppError from "../utils/AppError.js";

const positiveInteger = (value, label) => {
  if (!['number', 'string'].includes(typeof value) || !/^\d+$/.test(String(value))) {
    throw new AppError(400, `${label} phải là số nguyên dương`);
  }
  const number = Number(value);
  if (!Number.isSafeInteger(number) || number < 1 || number > 2147483647) {
    throw new AppError(400, `${label} không hợp lệ`);
  }
  return number;
};

export const loadCheckoutItems = async (userId, data) => {
  const cartItems = await Cart.findAll({
    where: { user_id: userId }, include: [{ model: Product, as: 'product' }],
  });
  const source = cartItems.length ? cartItems : data.items;
  if (!Array.isArray(source) || !source.length) throw new AppError(400, 'Giỏ hàng trống');
  const grouped = new Map();
  for (const item of source) {
    const productId = positiveInteger(item?.product_id, 'Mã sản phẩm');
    const quantity = positiveInteger(item?.quantity, 'Số lượng');
    const existing = grouped.get(productId);
    if (existing) {
      existing.quantity = positiveInteger(existing.quantity + quantity, 'Số lượng');
      continue;
    }
    const product = cartItems.length ? item.product : await Product.findByPk(productId);
    if (!product) throw new AppError(400, `Sản phẩm #${productId} không còn tồn tại`);
    grouped.set(productId, { product_id: productId, quantity, product });
  }
  return { checkoutItems: [...grouped.values()], cartItems };
};

export const buildShippingAddress = async (userId, user, data) => {
  const snapshot = {
    full_name: data.full_name || data.recipient_name,
    phone_number: data.phone_number || data.recipient_phone,
    address_line: data.address_line, ward: data.ward, district: data.district,
    city: data.city, email: user.email, address_id: null, order_note: data.order_note,
  };
  if (data.address_id != null) {
    const addressId = positiveInteger(data.address_id, 'Mã địa chỉ');
    const address = await UserAddress.findOne({ where: { id: addressId, user_id: userId } });
    if (!address) throw new AppError(404, 'Địa chỉ giao hàng không tồn tại hoặc không thuộc tài khoản của bạn');
    Object.assign(snapshot, {
      address_id: address.id, full_name: address.recipient_name,
      phone_number: address.recipient_phone, address_line: address.address_line,
      ward: address.ward, district: address.district, city: address.city,
    });
  }
  for (const field of ['full_name', 'phone_number', 'address_line', 'city']) {
    if (typeof snapshot[field] !== 'string' || !snapshot[field].trim()) {
      throw new AppError(400, 'Vui lòng điền đầy đủ thông tin giao hàng');
    }
    snapshot[field] = snapshot[field].trim();
  }
  return snapshot;
};
