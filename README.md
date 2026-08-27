# 🕐 Chronos Watch - E-Commerce Platform

Một nền tảng thương mại điện tử chuyên bán đồng hồ cao cấp được xây dựng với công nghệ hiện đại, kết hợp AI để cung cấp trải nghiệm mua sắm tuyệt vời cho khách hàng.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-ISC-green)
![Node.js](https://img.shields.io/badge/Node.js-Compatible-brightgreen)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)

---

## 📋 Mục Lục

- [Tổng Quan Dự Án](#tổng-quan-dự-án)
- [Các Tính Năng Chính](#các-tính-năng-chính)
- [Stack Công Nghệ](#stack-công-nghệ)
- [Kiến Trúc Dự Án](#kiến-trúc-dự-án)
- [Hướng Dẫn Cài Đặt](#hướng-dẫn-cài-đặt)
- [Cấu Hình Biến Môi Trường](#cấu-hình-biến-môi-trường)
- [Chạy Dự Án](#chạy-dự-án)
- [Cấu Trúc Cơ Sở Dữ Liệu](#cấu-trúc-cơ-sở-dữ-liệu)
- [API Documentation](#api-documentation)
- [Hướng Dẫn Triển Khai](#hướng-dẫn-triển-khai)
- [Đóng Góp](#đóng-góp)

---

## 🎯 Tổng Quan Dự Án

**Chronos Watch** là một ứng dụng web toàn diện cho phép:

- Khách hàng duyệt, tìm kiếm và mua đồng hồ
- Quản lý giỏ hàng, đơn hàng và lịch sử mua hàng
- Thanh toán an toàn thông qua VNPay
- Để lại đánh giá và nhận xét sản phẩm
- Sử dụng AI để tìm kiếm và gợi ý sản phẩm
- Quản lý danh sách yêu thích (wishlist)
- Sử dụng mã giảm giá (vouchers)

Dành cho quản trị viên:

- Quản lý sản phẩm, danh mục, thương hiệu
- Quản lý đơn hàng và trạng thái
- Quản lý người dùng và phân quyền
- Thống kê doanh thu và báo cáo

---

## ✨ Các Tính Năng Chính

### 👥 Quản Lý Người Dùng

- ✅ Đăng ký tài khoản với xác thực email
- ✅ Đăng nhập/Đăng xuất an toàn
- ✅ Quên mật khẩu và đặt lại mật khẩu
- ✅ Hồ sơ người dùng với avatar
- ✅ Quản lý địa chỉ giao hàng (thêm, sửa, xóa)
- ✅ Phân quyền (Admin/Customer)

### 🛍️ Quản Lý Sản Phẩm

- ✅ Danh mục sản phẩm phân cấp
- ✅ Thương hiệu đồng hồ
- ✅ Thông tin sản phẩm chi tiết (mô tả HTML, ảnh gallery)
- ✅ Thông số kỹ thuật đồng hồ
- ✅ Theo dõi số lượng tồn kho
- ✅ Lịch sử bán hàng và số lượt xem

### 🛒 Giỏ Hàng & Đơn Hàng

- ✅ Thêm/xóa sản phẩm vào giỏ hàng
- ✅ Cập nhật số lượng sản phẩm
- ✅ Tính giá trị giỏ hàng tự động
- ✅ Tạo đơn hàng từ giỏ hàng
- ✅ Xem chi tiết đơn hàng
- ✅ Theo dõi lịch sử đơn hàng
- ✅ Trạng thái đơn hàng (pending, confirmed, shipped, delivered, cancelled)

### 💳 Thanh Toán

- ✅ Tích hợp VNPay
- ✅ Xác nhận thanh toán tự động
- ✅ Lịch sử giao dịch
- ✅ An toàn và mã hóa

### ⭐ Đánh Giá & Nhận Xét

- ✅ Để lại đánh giá sản phẩm (1-5 sao)
- ✅ Viết nhận xét chi tiết
- ✅ Xem đánh giá từ người khác
- ✅ Tính rating trung bình

### 🎁 Voucher & Giảm Giá

- ✅ Tạo mã voucher
- ✅ Áp dụng mã giảm giá khi thanh toán
- ✅ Theo dõi số lần sử dụng
- ✅ Hạn sử dụng voucher

### ❤️ Danh Sách Yêu Thích

- ✅ Thêm sản phẩm vào wishlist
- ✅ Xem danh sách yêu thích
- ✅ Xóa khỏi wishlist
- ✅ Chuyển từ wishlist vào giỏ hàng

### 🤖 Tính Năng AI

- ✅ Tìm kiếm sản phẩm bằng AI
- ✅ Gợi ý sản phẩm phù hợp
- ✅ Tư vấn chọn đồng hồ
- ✅ Trích xuất thông tin từ hình ảnh

### 📊 Quản Trị & Báo Cáo

- ✅ Dashboard thống kê
- ✅ Quản lý người dùng
- ✅ Quản lý sản phẩm
- ✅ Báo cáo doanh thu
- ✅ Xuất dữ liệu Excel

---

## 🛠️ Stack Công Nghệ

### Backend

| Công Nghệ        | Phiên Bản | Mục Đích              |
| ---------------- | --------- | --------------------- |
| **Express.js**   | ^5.2.1    | Web framework         |
| **Node.js**      | -         | Runtime environment   |
| **MySQL**        | -         | Database              |
| **Sequelize**    | ^6.37.8   | ORM                   |
| **JWT**          | ^9.0.3    | Authentication        |
| **bcryptjs**     | ^3.0.3    | Password encryption   |
| **express-rate-limit** | ^8.x | Rate limiting         |
| **Cloudinary**   | ^1.41.3   | Image hosting         |
| **Multer**       | ^2.1.1    | File upload           |
| **Nodemailer**   | ^8.0.5    | Email service         |
| **Google GenAI** | ^1.48.0   | AI features           |
| **Zod**          | ^4.3.6    | Data validation       |
| **CORS**         | ^2.8.6    | Cross-origin requests |
| **Dotenv**       | ^17.3.1   | Environment variables |

### Frontend

| Công Nghệ          | Phiên Bản | Mục Đích        |
| ------------------ | --------- | --------------- |
| **React**          | ^19.2.4   | UI library      |
| **Vite**           | ^8.0.1    | Build tool      |
| **React Router**   | ^7.13.2   | Routing         |
| **TailwindCSS**    | ^4.2.2    | CSS framework   |
| **Shadcn/ui**      | ^4.1.1    | UI components   |
| **Axios**          | ^1.13.6   | HTTP client     |
| **Recharts**       | ^3.8.0    | Charts & graphs |
| **React Toastify** | ^11.0.5   | Notifications   |
| **SweetAlert2**    | ^11.26.24 | Dialog boxes    |
| **Swiper**         | ^12.1.3   | Carousel        |
| **XLSX**           | ^0.18.5   | Excel export    |

---

## 🏗️ Kiến Trúc Dự Án

```
Chronos-Watch/
├── backend/                          # API Backend (Node.js + Express)
│   ├── src/
│   │   ├── server.js                 # Entry point
│   │   ├── config/
│   │   │   ├── db.js                 # Database configuration
│   │   │   └── cloudinary.js         # Cloudinary config
│   │   ├── controllers/              # Request handlers
│   │   │   ├── auth.controller.js
│   │   │   ├── product.controller.js
│   │   │   ├── cart.controller.js
│   │   │   ├── order.controller.js
│   │   │   ├── payment.controller.js
│   │   │   ├── review.controller.js
│   │   │   ├── admin.controller.js
│   │   │   ├── ai.controller.js
│   │   │   └── ... (other controllers)
│   │   ├── models/                   # Sequelize models
│   │   │   ├── user.model.js
│   │   │   ├── product.model.js
│   │   │   ├── order.model.js
│   │   │   └── ... (other models)
│   │   ├── routes/                   # API routes
│   │   │   ├── index.routes.js
│   │   │   ├── auth.routes.js
│   │   │   ├── product.routes.js
│   │   │   └── ... (other routes)
│   │   ├── services/                 # Business logic
│   │   │   ├── auth.service.js
│   │   │   ├── product.service.js
│   │   │   ├── order.service.js
│   │   │   └── ... (other services)
│   │   ├── middlewares/              # Custom middlewares
│   │   │   ├── auth.middleware.js
│   │   │   ├── admin.middleware.js
│   │   │   └── upload.middleware.js
│   │   └── utils/
│   │       ├── errorHandler.js
│   │       └── mail.js
│   └── package.json
│
├── frontend/                         # React + Vite Frontend
│   ├── src/
│   │   ├── main.jsx                  # Entry point
│   │   ├── App.jsx                   # Main component
│   │   ├── api/                      # API calls
│   │   │   ├── axios.js              # Axios instance
│   │   │   ├── auth.api.js
│   │   │   ├── product.api.js
│   │   │   ├── order.api.js
│   │   │   ├── payment.api.js
│   │   │   └── ... (other APIs)
│   │   ├── components/               # Reusable components
│   │   │   ├── admin/                # Admin dashboard components
│   │   │   ├── auth/                 # Auth components
│   │   │   ├── client/               # Client-side components
│   │   │   ├── home/                 # Home page components
│   │   │   ├── products/             # Product components
│   │   │   └── ui/                   # UI components
│   │   ├── pages/                    # Page components
│   │   ├── context/                  # React Context
│   │   ├── hooks/                    # Custom hooks
│   │   ├── routes/                   # Route definitions
│   │   ├── assets/                   # Images, icons
│   │   ├── utils/                    # Utility functions
│   │   └── index.css                 # Global styles
│   ├── public/                       # Static files
│   ├── package.json
│   └── vite.config.js
│
└── chronos-watch-db.sql              # Database schema
```

---

## 📦 Hướng Dẫn Cài Đặt

### Yêu Cầu Trước

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 hoặc **yarn**
- **MySQL Server** >= 5.7
- **Git**

### Bước 1: Clone Repository

```bash
git clone https://github.com/yourusername/chronos-watch.git
cd chronos-watch
```

### Bước 2: Cài Đặt Dependencies

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd ../frontend
npm install
```

### Bước 3: Thiết Lập Cơ Sở Dữ Liệu

1. Tạo database MySQL:

```bash
mysql -u root -p
```

2. Chạy script SQL:

```sql
SOURCE chronos-watch-db.sql;
```

---

## 🔐 Cấu Hình Biến Môi Trường

### Backend - Tạo file `.env` trong thư mục `backend/`

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=chronos_watch_db
DB_USER=root
DB_PASSWORD=your_password

# Server Configuration
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here_min_32_chars
JWT_EXPIRE=7d

# Email Configuration (Gmail/Nodemailer)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@chronoswatch.com

# Cloudinary Configuration
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Google GenAI Configuration
GOOGLE_GENAI_API_KEY=your_google_genai_key

# VNPay Configuration
VNPAY_TMN_CODE=your_tmn_code
VNPAY_SECRET_KEY=your_secret_key
VNPAY_RETURN_URL=http://localhost:5173/payment/return
VNPAY_NOTIFY_URL=http://localhost:3000/api/payments/vnpay-notify
```

### Frontend - Tạo file `.env` trong thư mục `frontend/`

```env
# API Configuration
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=Chronos Watch
```

---

# Chạy Tests

```bash
cd backend
npm test
```

Test dùng **Vitest** và nằm trong `backend/src/__tests__/`:

- `vnpay.test.js` — kiểm tra tạo URL thanh toán và xác thực chữ ký VNPay (hợp lệ / giả mạo)
- `auth.service.test.js` — kiểm tra đăng ký, đăng nhập, đổi mật khẩu, quên mật khẩu
- `errorHandler.test.js` — kiểm tra format lỗi Sequelize

---

## ▶️ Chạy Dự Án

### Chạy Backend

```bash
cd backend

# Chế độ phát triển (với Nodemon)
npm run dev

# Chế độ production
npm start
```

Backend sẽ chạy tại: **http://localhost:3000**

### Chạy Frontend

```bash
cd frontend

# Chế độ phát triển
npm run dev

# Build cho production
npm run build

# Preview build
npm run preview
```

Frontend sẽ chạy tại: **http://localhost:5173**

---

## 💾 Cấu Trúc Cơ Sở Dữ Liệu

### Bảng Chính

#### 1. **users** - Người dùng

- Lưu thông tin người dùng (tài khoản, mật khẩu, hồ sơ)
- Phân quyền (admin/customer)
- Trạng thái (active/banned)

#### 2. **user_addresses** - Địa chỉ giao hàng

- Danh sách địa chỉ giao hàng của người dùng
- Hỗ trợ địa chỉ mặc định
- Thông tin người nhận

#### 3. **brands** - Thương hiệu

- Danh sách thương hiệu đồng hồ
- Logo, mô tả, quốc gia xuất xứ

#### 4. **categories** - Danh mục

- Danh mục sản phẩm
- Hỗ trợ danh mục cha-con

#### 5. **products** - Sản phẩm

- Thông tin sản phẩm chi tiết
- Hình ảnh (URL chính + Gallery JSON)
- Thông số kỹ thuật (JSON)
- Giá, tồn kho, đã bán
- SEO slug

#### 6. **product_categories** - Liên kết sản phẩm - Danh mục

- Liên kết nhiều-nhiều giữa sản phẩm và danh mục

#### 7. **carts** - Giỏ hàng

- Chi tiết sản phẩm trong giỏ hàng
- Số lượng, giá

#### 8. **orders** - Đơn hàng

- Thông tin đơn hàng chính
- Trạng thái, tổng giá
- Địa chỉ giao hàng

#### 9. **order_details** - Chi tiết đơn hàng

- Danh sách sản phẩm trong đơn hàng
- Giá, số lượng tại thời điểm đặt

#### 10. **order_history** - Lịch sử đơn hàng

- Theo dõi thay đổi trạng thái đơn hàng
- Ghi chú

#### 11. **reviews** - Đánh giá sản phẩm

- Rating (1-5 sao)
- Nhận xét chi tiết
- Người dùng, sản phẩm

#### 12. **wishlists** - Danh sách yêu thích

- Sản phẩm yêu thích của người dùng

#### 13. **vouchers** - Mã giảm giá

- Mã voucher, giá trị giảm
- Hạn sử dụng, số lần sử dụng

---

## 📡 API Documentation

### Authentication API

```
POST /api/auth/register           - Đăng ký tài khoản
POST /api/auth/login              - Đăng nhập
POST /api/auth/logout             - Đăng xuất
POST /api/auth/forgot-password    - Quên mật khẩu
POST /api/auth/reset-password     - Đặt lại mật khẩu
GET  /api/auth/profile            - Lấy hồ sơ người dùng
PUT  /api/auth/update-profile     - Cập nhật hồ sơ
```

### Product API

```
GET  /api/products                - Lấy danh sách sản phẩm
GET  /api/products/:id            - Lấy chi tiết sản phẩm
GET  /api/products/search/:query  - Tìm kiếm sản phẩm
GET  /api/categories              - Lấy danh mục
GET  /api/brands                  - Lấy thương hiệu
POST /api/admin/products          - Tạo sản phẩm (Admin)
PUT  /api/admin/products/:id      - Cập nhật sản phẩm (Admin)
DELETE /api/admin/products/:id    - Xóa sản phẩm (Admin)
```

### Cart API

```
GET    /api/carts              - Lấy giỏ hàng
POST   /api/carts              - Thêm vào giỏ hàng
PUT    /api/carts/:itemId      - Cập nhật giỏ hàng
DELETE /api/carts/:itemId      - Xóa khỏi giỏ hàng
DELETE /api/carts              - Xóa toàn bộ giỏ hàng
```

### Order API

```
GET    /api/orders              - Lấy danh sách đơn hàng
GET    /api/orders/:id          - Lấy chi tiết đơn hàng
POST   /api/orders              - Tạo đơn hàng mới
PUT    /api/orders/:id/status   - Cập nhật trạng thái (Admin)
```

### Payment API

```
POST /api/payments/vnpay         - Tạo URL thanh toán VNPay
GET  /api/payments/vnpay-return  - Xử lý return từ VNPay
POST /api/payments/vnpay-notify  - Webhook thông báo VNPay
```

### Review API

```
GET    /api/reviews                - Lấy danh sách đánh giá
POST   /api/reviews                - Tạo đánh giá
PUT    /api/reviews/:id            - Cập nhật đánh giá
DELETE /api/reviews/:id            - Xóa đánh giá
```

### Wishlist API

```
GET    /api/wishlist           - Lấy danh sách yêu thích
POST   /api/wishlist           - Thêm vào wishlist
DELETE /api/wishlist/:id       - Xóa khỏi wishlist
```

### Voucher API

```
GET  /api/vouchers           - Lấy danh sách voucher
POST /api/vouchers/validate  - Kiểm tra mã voucher
```

### AI API

```
POST /api/ai/search          - Tìm kiếm sản phẩm bằng AI
POST /api/ai/recommend       - Gợi ý sản phẩm
POST /api/ai/chat            - Chat tư vấn với AI
```

### Admin API

```
GET    /api/admin/dashboard      - Thống kê dashboard
GET    /api/admin/users          - Quản lý người dùng
GET    /api/admin/orders         - Quản lý đơn hàng
GET    /api/admin/reports        - Báo cáo doanh thu
POST   /api/admin/export         - Xuất dữ liệu Excel
```

## 🎉 Cảm Ơn

Cảm ơn tất cả những người đã đóng góp vào dự án này!
