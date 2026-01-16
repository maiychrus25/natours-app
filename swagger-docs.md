# Hướng dẫn tích hợp Swagger (OpenAPI 3.0) vào Node.js

## 1. Giới thiệu

Swagger giúp tự động hóa việc tạo tài liệu API và cung cấp giao diện UI để test API trực tiếp mà không cần Postman.

## 2. Cài đặt

Chạy lệnh sau trong terminal:

```bash
npm install swagger-ui-express swagger-jsdoc
```

## 3. Cấu hình (swagger.js)

Tạo file **swagger.js** tại thư mục gốc:

```js
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'Mô tả API cho dự án Node.js',
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Local Development' },
    ],
    // Định nghĩa Schema dùng chung (Model)
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
          },
        },
      },
    },
  },
  // Đường dẫn tới các file routes chứa comment
  apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);
module.exports = specs;
```

## 4. Tích hợp vào Server (app.js)

```js
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swagger');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
```

## 5. Viết Document trong Route

Ví dụ tại **routes/users.js**

```js
/**
 * @swagger
 * /users:
 * get:
 * summary: Lấy danh sách users
 * tags: [Users]
 * responses:
 * 200:
 * description: Thành công
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * $ref: '#/components/schemas/User'
 */
router.get('/', userController.getAll);
```

# Phần 2: Bước nâng cao - Cấu hình xác thực (JWT Auth)

Trong thực tế, API Backend thường được bảo vệ bằng Token (JWT). Nếu không cấu hình bước này, khi bạn bấm "Try it out" trên Swagger, request sẽ bị lỗi `401 Unauthorized`.

Chúng ta cần thêm nút **"Authorize"** (biểu tượng ổ khóa) vào giao diện Swagger.

## Bước 1: Cập nhật file cấu hình `swagger.js`

Bạn cần khai báo `securitySchemes` trong phần `components`. Ở đây mình ví dụ dùng **Bearer Token** (phổ biến nhất).

```javascript
// swagger.js
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      /* ... giữ nguyên ... */
    },

    components: {
      // 1. Định nghĩa cơ chế bảo mật
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        /* ... giữ nguyên ... */
      },
    },

    // 2. (Tùy chọn) Áp dụng bảo mật cho TOÀN BỘ API
    // Nếu bạn muốn tất cả API đều cần login, bỏ comment dòng dưới:
    // security: [{ bearerAuth: [] }],
  },
  apis: ['./routes/*.js'],
};
```

## Bước 2: Áp dụng bảo mật vào từng Route cụ thể

Nếu bạn không áp dụng bảo mật toàn cục (bước trên), bạn cần thêm security vào từng API nào yêu cầu đăng nhập.

Ví dụ: API lấy thông tin cá nhân **(/profile)** cần token.

```js
/**
 * @swagger
 * /profile:
 * get:
 * summary: Lấy thông tin cá nhân (Cần Login)
 * tags: [Auth]
 * security:
 * - bearerAuth: []   <-- Thêm dòng này để hiện ổ khóa
 * responses:
 * 200:
 * description: Thông tin user
 * 401:
 * description: Chưa đăng nhập hoặc Token hết hạn
 */
router.get('/profile', authMiddleware, (req, res) => {
  // Logic xử lý
});
```

## Bước 3: Cách sử dụng trên giao diện

1. Mở trang **/api-docs**
2. Bạn sẽ thấy nút **Authorize** màu xanh lá ở góc phải. Bấm vào đó.
3. Nhập chuỗi JWT của bạn vào ô value.
4. Bấm Authorize --> Close.
5. Bây giờ khi bạn test case API có hình ổ khoá, Swagger sẽ tự động chèn Header Authorization: Bearer <token> vào request cho bạn.
