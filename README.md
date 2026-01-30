# 🌲 Natours Application API

![Node.js](https://img.shields.io/badge/Node.js-18.x-green?style=flat-square)
![Express](https://img.shields.io/badge/Express-4.x-blue?style=flat-square)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-forestgreen?style=flat-square)
![Security](https://img.shields.io/badge/Security-OWASP-red?style=flat-square)

> Hệ thống RESTful API quản lý đặt tour du lịch, được xây dựng với kiến trúc Clean Architecture, tối ưu hóa hiệu năng, bảo mật cao và xử lý lỗi tập trung.

## 🌟 Điểm nổi bật (Key Highlights)

Dự án này không chỉ dừng lại ở các chức năng cơ bản mà tập trung sâu vào **Architecture Patterns** và **Security Best Practices**:

### 🏗️ Kiến trúc & Refactoring (Advanced Patterns)
- **Factory Pattern**: Sử dụng `handlerFactory` trong Controller để tạo ra các hàm CRUD chuẩn hóa, giúp giảm thiểu code lặp lại.
- **Service Layer**: Tách biệt logic nghiệp vụ phức tạp sang lớp Service (Base Service), giúp Controller tinh gọn ("Skinny Controller").
- **APIFeatures**: Class tiện ích tùy chỉnh để xử lý nâng cao các query string:
  - `Filter`: Lọc dữ liệu theo tiêu chí.
  - `Sort`: Sắp xếp đa tầng.
  - `LimitFields`: Giới hạn trường trả về (Projecting).
  - `Paginate`: Phân trang dữ liệu.

### 🛡️ Bảo mật & An toàn (Security & Safety)
- **Authentication**: Xác thực người dùng bằng **JWT (JSON Web Token)** và **Passport**.
- **Security Headers**: Sử dụng **Helmet** để thiết lập các HTTP headers an toàn.
- **Data Sanitization**:
  - `express-mongo-sanitize`: Chống tấn công NoSQL Injection.
  - `xss-clean`: Chống tấn công Cross-Site Scripting (XSS).
- **Parameter Pollution**: Sử dụng `hpp` (HTTP Parameter Pollution) để bảo vệ query params.
- **Rate Limiting**: Sử dụng `express-rate-limit` để chống Brute Force và DOS.

### ⚙️ Database & Mongoose Advanced
- **Middleware**: Sử dụng đầy đủ Document, Query, Aggregate, và Model Middlewares (Pre/Post hooks).
- **Virtual Properties**: Các trường ảo không lưu trong DB nhưng được tính toán khi query.
- **Indexes**: Tối ưu hóa hiệu suất truy vấn với Compound Indexes.
- **Static Methods**: Các hàm tiện ích cấp Model.

### 🐞 Xử lý lỗi (Error Handling)
- **Global Error Handler**: Class `AppError` kết hợp với `catchAsync` để bắt lỗi tập trung.
- **Environment Logic**:
  - `Development`: Trả về chi tiết lỗi stack trace.
  - `Production`: Trả về thông báo lỗi thân thiện với người dùng (operational errors).
- **DB Errors**: Tự động xử lý các lỗi MongoDB (CastError, DuplicateKey, ValidationError).

## 🛠️ Công nghệ sử dụng

| Category | Technology |
|----------|------------|
| **Core** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose |
| **Auth** | JWT, Passport, Bcrypt |
| **Email** | Mailtrap (Dev), Nodemailer |
| **Security** | Helmet, XSS-Clean, HPP, Rate-Limit, Mongo-Sanitize |
| **Utilities** | Multer (Upload), Sharp (Image Process) |

## 🚀 Cài đặt và Chạy ứng dụng

Dự án sử dụng **Yarn** để quản lý gói.

### 1. Clone dự án
```bash
git clone [https://github.com/your-username/natours-app.git](https://github.com/your-username/natours-app.git)
cd natours-app
```

### 2. Cài đặt dependencies
```bash
yarn install
```

### 3. Cấu hình biến môi trường
Đổi tên file `example.env` thành `.env` (hoặc `config.env` tùy cấu hình server.js) và điền thông tin:

```env
PORT=3000
DATABASE=mongodb+srv://<USER>:<PASSWORD>@cluster.mongodb.net/natours?retryWrites=true&w=majority
DATABASE_PASSWORD=your_password

JWT_SECRET=your-ultra-long-secret-key
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90

EMAIL_USERNAME=your_mailtrap_username
EMAIL_PASSWORD=your_mailtrap_password
EMAIL_HOST=sandbox.smtp.mailtrap.io
EMAIL_PORT=2525
```

### 4. Chạy ứng dụng

Chạy môi trường Development (với Nodemon):
```bash
yarn dev
```

Chạy môi trường Production:
```bash
yarn start
```

## 📂 Cấu trúc dự án

Cấu trúc thư mục được tổ chức khoa học để dễ dàng mở rộng (Scalability):

```text
.
├── config/                 # Các file cấu hình hệ thống
├── controllers/            # Xử lý request, gọi Service
│   ├── error.controller.js # Xử lý lỗi trung tâm
│   └── handlerFactory.js   # Factory pattern cho CRUD
├── dev-data/               # Dữ liệu mẫu để import/export
├── middlewares/            # Custom middlewares
├── models/                 # Mongoose Schemas & Statics & Hooks
├── public/                 # File tĩnh (HTML, CSS, Img)
├── routes/                 # Định nghĩa API Endpoints
├── services/               # Logic nghiệp vụ (Base Service)
├── utils/                  # Các hàm tiện ích
│   ├── apiFeatures.js      # Class xử lý Filter, Sort, Page
│   ├── appError.js         # Class lỗi tùy chỉnh
│   └── catchAsync.js       # Wrapper async/await
├── views/                  # Server-side rendering (nếu có dùng Pug)
├── app.js                  # Khởi tạo Express App & Middlewares
├── server.js               # Entry point, kết nối DB
└── ...
```

## 📝 API Endpoints chính

| Method | Endpoint | Mô tả |
|:------:|----------|-------|
| GET | `/api/v1/tours` | Lấy danh sách tours (có filter, sort...) |
| GET | `/api/v1/tours/top-5-cheap` | Alias route lấy 5 tour rẻ nhất |
| POST | `/api/v1/users/login` | Đăng nhập hệ thống |
| POST | `/api/v1/users/forgot-password` | Gửi email reset token |
| PATCH | `/api/v1/users/reset-password/:token` | Đặt lại mật khẩu |

## 📘 API Documentation

The Natours API is fully documented using Postman public documentation.

👉 View full API docs here:  
🔗 [Postman Docs](https://documenter.getpostman.com/view/43579262/2sBXVo9TLX)

## 🤝 Đóng góp

Mọi đóng góp đều được hoan nghênh. Vui lòng tạo Pull Request hoặc mở Issue để thảo luận.

## 📄 License

MIT License.
