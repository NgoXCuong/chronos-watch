export function productQuantityError(value, stock, inCart = 0) {
  const inventory = Number(stock);
  if (!Number.isSafeInteger(inventory) || inventory <= 0) return "Sản phẩm đã hết hàng.";
  const text = String(value ?? "").trim();
  if (!text) return "Vui lòng nhập số lượng.";
  const quantity = Number(text);
  if (!/^\d+$/.test(text) || !Number.isSafeInteger(quantity) || quantity < 1) {
    return "Số lượng phải là số nguyên lớn hơn hoặc bằng 1.";
  }
  if (quantity > inventory) return `Chỉ còn ${inventory} sản phẩm trong kho. Vui lòng chọn số lượng không vượt quá ${inventory}.`;
  const already = Math.max(0, Math.floor(Number(inCart) || 0));
  if (already + quantity > inventory) {
    const remaining = Math.max(0, inventory - already);
    return remaining > 0
      ? `Bạn đã có ${already} sản phẩm trong giỏ. Chỉ có thể thêm tối đa ${remaining} sản phẩm.`
      : "Giỏ hàng đã có đủ số lượng còn trong kho của sản phẩm này.";
  }
  return "";
}
