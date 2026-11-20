import test from "node:test";
import assert from "node:assert/strict";
import { productQuantityError } from "./productQuantity.js";

test("Cho phép số nguyên dương tới đúng số tồn, kể cả hàng đã có trong giỏ", () => {
  assert.equal(productQuantityError("1", 5), "");
  assert.equal(productQuantityError("5", 5), "");
  assert.equal(productQuantityError("3", 5, 2), "");
});
test("Từ chối bỏ trống, số không dương, số thập phân và định dạng không hợp lệ", () => {
  for (const value of ["", " ", "0", "-1", "1.5", "1e2", "abc", "Infinity", "9007199254740992"]) {
    assert.ok(productQuantityError(value, 200), `Phải chặn: ${value}`);
  }
});
test("Cảnh báo rõ tồn kho khi số nhập vượt kho", () => {
  assert.match(productQuantityError("6", 5), /Chỉ còn 5/);
});
test("Chặn cộng dồn vượt kho và thông báo số có thể thêm", () => {
  assert.match(productQuantityError("4", 5, 2), /tối đa 3/);
  assert.match(productQuantityError("1", 5, 5), /đã có đủ/);
});
test("Chặn mua sản phẩm hết hàng hoặc tồn kho không hợp lệ", () => {
  for (const stock of [0, -1, undefined, "abc"]) assert.match(productQuantityError("1", stock), /hết hàng/);
});
