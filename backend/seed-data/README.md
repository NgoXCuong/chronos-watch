# Catalog bổ sung: 30 đồng hồ

Chạy từ `backend/` với MySQL cấu hình trong `.env`:

```sh
npm run seed:catalog -- --dry-run
npm run seed:catalog
```

Dry-run thực thi trong transaction rồi rollback. Lần chạy sau bỏ qua SKU/slug đã có;
không sửa giá, tồn kho, nội dung sản phẩm hoặc danh mục/thương hiệu cũ.
Toàn bộ lần nhập được rollback nếu một bản ghi lỗi.

- 10 mẫu Casio / G-SHOCK / EDIFICE / BABY-G, 10 Seiko, 10 Tissot.
- Nguồn thông số và ảnh chính thức được lưu ở `source_url`, `source_image_url`
  trong ba file `catalog-*.json`. Mô tả sản phẩm cũng có link nguồn hãng.
- Ảnh gốc đúng mã nằm tại `frontend/public/products/catalog/` và hoạt động offline.
- Thông số được chuẩn hóa theo tám khóa bộ lọc của website, bổ sung kích thước,
  trọng lượng, pin/độ chính xác hoặc bộ máy/trữ cót tùy công bố của hãng.
- Mức `Water Resistant` không có chỉ số bar được giữ nguyên, không suy thành 3 bar.
- Hai mẫu MTP-V001D / MTP-V002D không được hãng nêu vật liệu vỏ trên trang
  nguồn nên ghi rõ điều đó, không tự suy đoán. Quốc gia thương hiệu không đồng
  nghĩa với nơi sản xuất của từng chiếc.
- Tên và thông số là mẫu thật. Giá VND, tồn kho 12 chiếc/mẫu và bảo hành cửa hàng
  24 tháng là cấu hình demo cho đồ án, không phải báo giá/tồn kho hay cam kết
  phân phối chính hãng. Không tạo lượt mua hoặc đánh giá giả.
- G-SHOCK, EDIFICE, BABY-G là các thương hiệu thuộc Casio, được mô tả rõ trong dữ liệu.

Kiểm tra dữ liệu sau khi nhập:

```sh
node scripts/verify-catalog.js
```

Nếu cần tải lại ảnh gốc: `node scripts/download-catalog-images.mjs` (cần mạng).
Không cần chạy các bước nghiên cứu lại để seed: ba file JSON đã chứa đầy đủ dữ liệu.
`build-catalog.py` chỉ dùng khi cập nhật manifest từ các trang nguồn đã lưu tại
`docs/catalog-import/` (thư mục nghiên cứu local, không phải phụ thuộc khi seed).

Chatbot cache catalog tối đa 10 phút; khởi động lại backend để nhận dữ liệu ngay.
