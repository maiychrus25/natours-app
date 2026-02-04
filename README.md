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

## Các chức năng chính

- **Quản lý Tours:** CRUD (Tạo, Đọc, Cập nhật, Xóa) cho các tour.
- **Quản lý Users:** Đăng ký, đăng nhập, quản lý thông tin cá nhân, phân quyền.
- **Quản lý Reviews:** Người dùng đã đặt tour có thể tạo, đọc, cập nhật, xóa đánh giá.
- **Xác thực & Phân quyền:** Sử dụng JWT và phân quyền theo vai trò (user, guide, lead-guide, admin).
- **Thanh toán:** Tích hợp với Stripe để xử lý thanh toán online.
- **Upload ảnh:** Hỗ trợ upload ảnh cho tour và avatar người dùng, lưu trữ trên Cloudinary.
- **Gửi Email:** Gửi email tự động (chào mừng, reset mật khẩu) qua SendGrid (production) và Mailtrap (development).
- **Tính năng API nâng cao:** Lọc, sắp xếp, giới hạn trường, phân trang.
- **Truy vấn địa lý (Geospatial Queries):** Tìm tour trong một bán kính nhất định.

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

- **Backend:**
  - [Node.js](https://nodejs.org/): Môi trường chạy JavaScript phía server.
  - [Express.js](https://expressjs.com/): Framework xây dựng ứng dụng web và API.
- **Database:**
  - [MongoDB](https://www.mongodb.com/): Cơ sở dữ liệu NoSQL.
  - [Mongoose](https://mongoosejs.com/): ODM (Object Data Modeling) cho MongoDB.
- **Authentication / Authorization:**
  - [JSON Web Tokens (JWT)](https://jwt.io/): Xác thực người dùng.
  - [Passport.js](http://www.passportjs.org/): Middleware xác thực cho Node.js (bao gồm cả Google OAuth).
  - [bcryptjs](https://www.npmjs.com/package/bcryptjs): Băm mật khẩu.
- **Các thư viện quan trọng:**
  - `dotenv`: Quản lý biến môi trường.
  - `helmet`, `xss-clean`, `hpp`, `express-mongo-sanitize`, `express-rate-limit`: Bảo mật ứng dụng Express.
  - `nodemailer`: Gửi email.
  - `multer`, `cloudinary`, `sharp`: Xử lý upload và tối ưu hóa hình ảnh.
  - `slugify`: Tạo slug thân thiện với SEO.
  - `validator`: Validate dữ liệu đầu vào.
  - `pug`: Template engine để render các trang phía server (chủ yếu cho email).
  - `parcel-bundler`: Build các file JavaScript phía client.

## Yêu cầu hệ thống
- **Node.js:** `>=20.0.0`
- **Package Manager:** `yarn` (dựa trên sự tồn tại của `yarn.lock`)
- **Database:** MongoDB
- **Các service bên thứ ba:**
  - Tài khoản [Cloudinary](https://cloudinary.com/) để lưu trữ ảnh.
  - Tài khoản [SendGrid](https://sendgrid.com/) (cho production) hoặc [Mailtrap](https://mailtrap.io/) (cho development) để gửi email.
  - Tài khoản [Stripe](https://stripe.com/) để xử lý thanh toán.
  - Tài khoản [Mapbox](https://www.mapbox.com/) để hiển thị bản đồ.

## 🚀 Cài đặt và Chạy ứng dụng

Dự án sử dụng **Yarn** để quản lý gói.

### 1. Clone dự án
```bash
git clone [https://github.com/maiychrus25/natours-app.git](https://github.com/maiychrus25/natours-app.git)
cd natours-app
```

### 2. Cài đặt dependencies
```bash
yarn install
```

### 3. Cấu hình biến môi trường
Đổi tên file `example.env` thành `config.env` (hoặc `.env` tùy cấu hình server.js) và điền thông tin:

Đây là danh sách các biến môi trường cần thiết để chạy ứng dụng.

| Biến                    | Mô tả                                                      | Ví dụ                                                       |
| ----------------------- | ---------------------------------------------------------- | ----------------------------------------------------------- |
| `NODE_ENV`              | Môi trường chạy ứng dụng (`development` hoặc `production`) | `development`                                               |
| `PORT`                  | Cổng server lắng nghe                                      | `4000`                                                      |
| `DATABASE`              | Chuỗi kết nối đến MongoDB                                  | `mongodb+srv://user:<PASSWORD>@cluster.mongodb.net/natours` |
| `DATABASE_PASSWORD`     | Mật khẩu database để thay thế vào chuỗi `DATABASE`         | `your-db-password`                                          |
| `JWT_SECRET_KEY`        | Chuỗi bí mật để ký JWT                                     | `a-very-long-and-secret-key-for-jwt`                        |
| `JWT_EXPIRES_IN`        | Thời gian hết hạn của JWT                                  | `90d`                                                       |
| `JWT_COOKIE_EXPIRES_IN` | Thời gian hết hạn của cookie chứa JWT (tính bằng ngày)     | `90`                                                        |
| `EMAIL_FROM`            | Địa chỉ email gửi đi                                       | `Natours Admin <admin@natours.io>`                          |
| `MAILTRAP_HOST`         | Host của Mailtrap (cho development)                        | `smtp.mailtrap.io`                                          |
| `MAILTRAP_PORT`         | Port của Mailtrap (cho development)                        | `2525`                                                      |
| `MAILTRAP_USER`         | Username của Mailtrap (cho development)                    | `your-mailtrap-user`                                        |
| `MAILTRAP_PASS`         | Password của Mailtrap (cho development)                    | `your-mailtrap-pass`                                        |
| `SENDGRID_USERNAME`     | Username của SendGrid (cho production)                     | `apikey`                                                    |
| `SENDGRID_PASSWORD`     | Password (API Key) của SendGrid (cho production)           | `your-sendgrid-api-key`                                     |
| `CLOUDINARY_CLOUD_NAME` | Tên cloud của Cloudinary                                   | `your-cloud-name`                                           |
| `CLOUDINARY_API_KEY`    | API key của Cloudinary                                     | `your-api-key`                                              |
| `CLOUDINARY_API_SECRET` | API secret của Cloudinary                                  | `your-api-secret`                                           |
| `STRIPE_SECRET_KEY`     | Khóa bí mật của Stripe                                     | `sk_test_...`                                               |
| `GOOGLE_CLIENT_ID`      | Client ID cho Google OAuth                                 | `your-google-client-id`                                     |
| `GOOGLE_CLIENT_SECRET`  | Client Secret cho Google OAuth                             | `your-google-client-secret`                                 |

### 4. Scripts

Các scripts được định nghĩa trong `package.json`:

| Script       | Mô tả                                                              |
| ------------ | ------------------------------------------------------------------ |
| `start`      | Chạy server ở chế độ development bằng `nodemon` (tự động restart). |
| `start:prod` | Chạy server ở chế độ production.                                   |
| `lint`       | Kiểm tra lỗi code bằng ESLint.                                     |
| `debug`      | Chạy server ở chế độ debug bằng `ndb`.                             |
| `watch:js`   | Theo dõi và build lại file JS phía client khi có thay đổi.         |
| `build:js`   | Build file JS phía client cho production.                          |

## 📂 Cấu trúc dự án

```
/
├── app.js              # Cấu hình chính của Express, middleware
├── server.js           # Điểm khởi động server, kết nối database
├── package.json        # Danh sách các dependencies và scripts
├── .env.example        # File mẫu cho các biến môi trường
├── .prettierrc         # Cấu hình Prettier
├── .eslintrc.json      # Cấu hình ESLint
│
├── config/             # Chứa các file cấu hình (database, passport)
├── controllers/        # Chứa logic xử lý request (controller layer)
├── middlewares/        # Chứa các Express middleware tùy chỉnh
├── models/             # Định nghĩa Mongoose schema (data layer)
├── routes/             # Định tuyến các endpoint của API
├── services/           # Chứa logic nghiệp vụ (business logic layer)
├── utils/              # Chứa các hàm, lớp tiện ích (email, error handling)
├── public/             # Chứa các file tĩnh (CSS, JS, images)
└── views/              # Chứa các template Pug (chủ yếu cho email)
```

## 📝 API Endpoints chính

| Method | Endpoint | Mô tả |
|:------:|----------|-------|
| GET | `/api/v1/tours` | Lấy danh sách tours (có filter, sort...) |
| GET | `/api/v1/tours/top-5-cheap` | Alias route lấy 5 tour rẻ nhất |
| POST | `/api/v1/users/login` | Đăng nhập hệ thống |
| POST | `/api/v1/users/forgot-password` | Gửi email reset token |
| PATCH | `/api/v1/users/reset-password/:token` | Đặt lại mật khẩu |
| GET | `/api/v1/tours/tours-within/200/center/34.111745,-118.113491/unit/mi` | Lấy các tour quanh bán kính |

## 📘 API Documentation

Tài liệu Natours API sử dụng Postman public document.

👉 View full API docs here:  
🔗 [Postman Docs](https://documenter.getpostman.com/view/43579262/2sBXVo9TLX)

## 🤝 Đóng góp

Mọi đóng góp đều được hoan nghênh. Vui lòng tạo Pull Request hoặc mở Issue để thảo luận.

## 📄 License

MIT License.
