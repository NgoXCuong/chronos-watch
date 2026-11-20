<div align="center">

# CHRONOS WATCH

**Nền tảng thương mại điện tử đồng hồ · Đồ án Công nghệ phần mềm**

Mua sắm, thanh toán VietQR, tư vấn AI và quản trị trên cùng một hệ thống.

![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-17304F?logo=express)
![MySQL](https://img.shields.io/badge/MySQL-Sequelize-4479A1?logo=mysql&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)

[Tổng quan](#tong-quan) · [Chức năng](#chuc-nang) · [Cài đặt](#cai-dat) · [Cấu hình](#cau-hinh) · [API](#api) · [Kiểm thử](#kiem-thu)

</div>

---

<a id="tong-quan"></a>
## Tổng quan

Chronos Watch phục vụ hai nhóm người dùng: khách hàng tìm và mua đồng hồ; quản trị viên quản lý danh mục, đơn hàng, ưu đãi và kế hoạch tồn kho.

| Thành phần | Công nghệ |
| --- | --- |
| Frontend | React 19, Vite 8, React Router, Tailwind CSS v4, shadcn/ui, Lucide |
| Backend | Node.js, Express 5, Sequelize, MySQL |
| Xác thực | JWT, cookie HttpOnly, bcryptjs, danh sách token đã vô hiệu hóa |
| Thanh toán | COD, chuyển khoản/VietQR qua SePay |
| Dịch vụ tích hợp | Cloudinary, SMTP, Groq và Gemini |
| Số liệu & kiểm thử | Recharts, XLSX, Vitest |

```text
Chronos-Watch/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Xử lý HTTP
│   │   ├── services/       # Nghiệp vụ
│   │   ├── models/         # Sequelize models
│   │   ├── migrations/     # Cập nhật cấu trúc dữ liệu
│   │   ├── routes/         # API endpoints
│   │   └── middlewares/    # Xác thực, phân quyền, upload
│   └── scripts/            # Lệnh migration bổ sung
├── frontend/src/
│   ├── components/         # Giao diện khách hàng, admin và UI dùng chung
│   ├── pages/              # Các trang
│   ├── hooks/              # Logic tải dữ liệu và tương tác
│   ├── context/            # Tài khoản, giỏ hàng, yêu thích, giao diện
│   ├── api/                # HTTP client
│   └── styles/             # Kiểu dáng các trang
└── chronos-watch-db.sql    # Bản dữ liệu SQL có sẵn trong repository
```

<a id="chuc-nang"></a>
## Chức năng

<details open>
<summary><strong>Khách hàng — tìm kiếm và mua sắm</strong></summary>

- Trang chủ có banner, thương hiệu, bộ sưu tập, Flash Sale và voucher.
- Lọc sản phẩm theo danh mục, thương hiệu, giá và thông số kỹ thuật.
- Xem ảnh, thông số, tình trạng còn hàng và đánh giá của sản phẩm.
- Giỏ hàng hỗ trợ nhập số lượng, kiểm tra vượt tồn và tính ưu đãi.
- Đặt hàng, thanh toán COD/VietQR, theo dõi đơn và lịch sử trạng thái.
- Quản lý hồ sơ, địa chỉ, sản phẩm yêu thích và thông báo.
- Xem phiếu bảo hành và gửi yêu cầu bảo hành.

</details>

<details>
<summary><strong>Quản trị — catalog và vận hành</strong></summary>

- Quản lý sản phẩm, gallery, thương hiệu, cây danh mục và banner.
- Bảng dùng chung hỗ trợ tìm kiếm, lọc, phân trang, sort phía server và tác vụ hàng loạt.
- Quản lý khách hàng, đơn hàng, thanh toán, bảo hành và đánh giá.
- Dashboard doanh thu, phân bố đơn hàng, sản phẩm bán chạy và khách mua nhiều nhất.
- Xếp hạng khách hàng dựa trên số chiếc trong các đơn đã giao; khi bằng nhau xét tổng chi tiêu rồi số đơn.
- Thông báo admin tập trung vào đơn mới/hủy, yêu cầu bảo hành, đánh giá tiêu cực và cảnh báo kho quan trọng.

</details>

<details>
<summary><strong>Ưu đãi — Flash Sale và voucher riêng</strong></summary>

- Flash Sale có thời gian áp dụng, giá riêng, số suất và giới hạn mua.
- Voucher hỗ trợ phần trăm/số tiền, đơn tối thiểu, mức giảm tối đa và giới hạn lượt dùng.
- Mã công khai xuất hiện trong danh sách ưu đãi khi có hiệu lực.
- Admin tặng mã riêng cho tài khoản khách; khách nhận thông báo và xem tại “Voucher của tôi”.
- Checkout gợi ý mã phù hợp; backend kiểm tra điều kiện và đúng người nhận trước khi cho dùng mã riêng.

</details>

<details>
<summary><strong>Kế hoạch tồn kho — theo nhu cầu mua</strong></summary>

Không cảnh báo chỉ vì số tồn thấp. Hệ thống dựa trên lịch sử mua hợp lệ và thời gian nhập hàng:

```text
Tốc độ bán/ngày = Số chiếc đã bán / Số ngày theo dõi
Số ngày đủ hàng = Tồn kho / Tốc độ bán/ngày
```

Mặc định quan sát 28 ngày, nhập hàng 7 ngày và dự phòng 7 ngày. Chỉ dự báo khi có ít nhất 14 ngày theo dõi và bán ít nhất 3 chiếc.

| Điều kiện | Kết quả |
| --- | --- |
| Tồn bằng 0 | Hết hàng |
| Chưa đủ lịch sử hoặc số lượng bán | Cần đối chiếu thủ công |
| Đủ hàng không quá thời gian nhập | Nguy cơ hết hàng trước khi nhập |
| Đủ hàng không quá thời gian nhập + dự phòng | Cần lên kế hoạch nhập |
| Đủ hàng lâu hơn ngưỡng trên | Chưa cần nhập |

Chỉ tính nhu cầu từ đơn đã xác nhận, đang xử lý, đang giao hoặc đã giao. Tham số có thể điều chỉnh cho từng sản phẩm. Đây là ước tính hỗ trợ quyết định, không tự tạo đơn nhập hàng.

</details>

<details>
<summary><strong>Chronos AI — tư vấn theo dữ liệu shop</strong></summary>

- Dùng Groq khi có cấu hình, chuyển sang Gemini khi cần dự phòng.
- Đọc mới danh mục còn hàng theo từng lượt hỏi.
- Cung cấp tên, giá, thông số, bảo hành và link sản phẩm cho model.
- Kiểm tra lại link và tồn kho trước khi trả thẻ sản phẩm về giao diện.
- Khi nhà cung cấp AI lỗi, phản hồi rõ tình trạng thay vì tự gợi ý sản phẩm ngẫu nhiên.
- Chất lượng trả lời vẫn phụ thuộc model và độ đầy đủ của dữ liệu sản phẩm.

</details>

<a id="cai-dat"></a>
## Cài đặt và chạy local

**Chuẩn bị:** Git, MySQL 8 và Node.js 22.12+ tương thích Vite 8; hai cổng mặc định là `3000` và `5173`.

**1. Lấy mã nguồn**

```powershell
git clone https://github.com/NgoXCuong/chronos-watch.git
cd chronos-watch
```

**2. Chuẩn bị MySQL**

Tạo database theo `DB_NAME`, rồi import `chronos-watch-db.sql` bằng MySQL Workbench hoặc công cụ MySQL của bạn. Bản SQL là dữ liệu snapshot, không phải bản đồng bộ tự động từ máy phát triển.

**3. Chạy backend — terminal thứ nhất**

```powershell
cd backend
npm ci
Copy-Item .env.example .env
# Điền thông tin MySQL và các dịch vụ cần dùng trong .env.
npm run migrate
npm run dev
```

Sao lưu database đang sử dụng trước khi chạy migration; migration hiện tại có thay đổi cấu trúc đơn hàng và bảo hành. Không import lại SQL lên database đang có dữ liệu cần giữ.

**4. Chạy frontend — terminal thứ hai tại thư mục dự án**

```powershell
cd frontend
npm ci
npm run dev
```

Mở [website local](http://localhost:5173). Frontend mặc định gọi API tại `http://localhost:3000/api`.

<a id="cau-hinh"></a>
## Cấu hình

<details open>
<summary><strong>Backend — backend/.env</strong></summary>

Sao chép từ [backend/.env.example](backend/.env.example). Không commit file `.env` hoặc API key thật.

| Nhóm | Biến |
| --- | --- |
| MySQL | `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` |
| Connection pool | `DB_POOL_MAX`, `DB_POOL_MIN` |
| Server & xác thực | `PORT` (mặc định 3000), `NODE_ENV`, `JWT_SECRET`, `JWT_EXPIRE`, `FRONTEND_URL` |
| Upload ảnh | `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` |
| SMTP | `EMAIL_SERVICE`, `EMAIL_USER`, `EMAIL_PASS` |
| Chatbot | `GROQ_API_KEY`, `GROQ_MODEL` (tùy chọn), `GEMINI_API_KEY` hoặc `GOOGLE_GENAI_API_KEY` |
| SePay | `SEPAY_API_KEY`, `SEPAY_BANK`, `SEPAY_ACCOUNT_NO`, `SEPAY_ACCOUNT_NAME`, `SEPAY_CONTENT_PREFIX` |
| VietQR | `BANK_ID`, `ACCOUNT_NO`, `ACCOUNT_NAME`, `VIETQR_TEMPLATE`, `VIETQR_BASE_URL` |
| Demo thanh toán | `ENABLE_MOCK_PAYMENTS=false` mặc định; chỉ dành cho admin khi bật ở môi trường demo, tắt trên production |

Webhook SePay cần endpoint backend có thể truy cập từ bên ngoài và khóa xác thực khớp cấu hình trên SePay. Không xem một mã QR đã tạo là thanh toán đã thành công.

</details>

<details>
<summary><strong>Frontend — frontend/.env (tùy chọn)</strong></summary>

```dotenv
VITE_API_URL=http://localhost:3000/api
```

Chỉ đưa URL/cấu hình công khai vào các biến `VITE_*`; không đưa khóa AI, MySQL hay Cloudinary secret vào frontend.

</details>

<a id="api"></a>
## API và cấu trúc dữ liệu

Base URL local: `http://localhost:3000/api`. Route có phân quyền khách hàng/admin; xem [khai báo routes](backend/src/routes) để tra phương thức và middleware cụ thể.

| Nhóm | Tiền tố |
| --- | --- |
| Tài khoản, địa chỉ | `/auth`, `/addresses` |
| Catalog, banner | `/products`, `/categories`, `/brands`, `/banners` |
| Mua sắm | `/cart`, `/wishlist`, `/orders`, `/payments` |
| Ưu đãi | `/flash-sales`, `/vouchers` |
| Sau mua | `/reviews`, `/warranties`, `/notifications` |
| Tư vấn và quản trị | `/ai`, `/admin` |

Các bảng nghiệp vụ gồm tài khoản/địa chỉ; sản phẩm/thương hiệu/danh mục; giỏ/đơn/chi tiết đơn; Flash Sale; voucher/quyền nhận mã/lượt sử dụng; đánh giá; bảo hành/yêu cầu bảo hành và thông báo. Định nghĩa thực tế nằm trong [models](backend/src/models) và [migrations](backend/src/migrations).

<a id="kiem-thu"></a>
## Kiểm thử và build

```powershell
# Tại backend
npm test

# Tại frontend
npm run build
npm run lint
```

Các lệnh migration theo phạm vi, chạy từ `backend`:

```powershell
npm run migrate:inventory
npm run migrate:vouchers
npm run migrate:voucher-grants
```

Không chia sẻ tài khoản demo hoặc mật khẩu cố định trong README. Tạo tài khoản qua giao diện; cấp quyền admin trong database local bằng tài khoản quản trị MySQL của bạn.

---

<div align="center">

[Tổng quan](#tong-quan) · [Chức năng](#chuc-nang) · [Cài đặt](#cai-dat) · [Cấu hình](#cau-hinh) · [API](#api) · [Kiểm thử](#kiem-thu)

</div>
