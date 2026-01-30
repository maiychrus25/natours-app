## 1. Passport.js là gì?

**Passport** là một Middleware xác thực (Authentication) dành cho Node.js.
Nó được thiết kế với một mục đích duy nhất: **Xác thực request**.

Điểm mạnh của Passport là tính **mô-đun hóa**. Thay vì viết logic đăng nhập cứng nhắc, Passport sử dụng các **Strategies** (Chiến lược). Bạn muốn đăng nhập bằng Username/Password? Có Strategy. Muốn đăng nhập bằng Google/Facebook? Có Strategy. Muốn dùng JWT? Cũng có Strategy.

---

## 2. Cơ chế hoạt động (Core Concepts) - Cần phải hiểu

Để dùng được Passport, bạn phải nắm vững 3 khái niệm sau:

### A. Strategies (Chiến lược)

Passport không tự mình biết cách kiểm tra user. Nó nhờ cậy vào các "Plugins" gọi là Strategy.

- `passport-local`: Dùng cho username/password truyền thống.
- `passport-jwt`: Dùng cho API token (RESTful API).
- `passport-google-oauth20`: Dùng cho Login with Google.

### B. Middleware `passport.authenticate()`

Đây là cái "cổng bảo vệ". Bạn đặt nó vào route nào (ví dụ `/login`), nó sẽ kích hoạt Strategy tương ứng để kiểm tra thông tin người dùng gửi lên.

### C. Sessions (Serialize & Deserialize)

Đây là phần khó hiểu nhất nhưng quan trọng nhất nếu bạn làm web dạng MVC (có Session/Cookie).

1.  **SerializeUser (Đóng gói):** Khi user đăng nhập thành công lần đầu, Passport cần biết nên lưu cái gì vào Cookie (thường là `id` của user) để tiết kiệm bộ nhớ.
2.  **DeserializeUser (Giải nén):** Với mỗi request tiếp theo, Passport lấy cái `id` từ Cookie, tìm trong Database để lấy lại toàn bộ thông tin User và gắn nó vào `req.user`.

---

## 3. Cài đặt và Cấu hình (Ví dụ với Local Strategy)

Giả sử bạn đang làm tính năng đăng nhập bằng Email/Password.

### Bước 1: Cài đặt thư viện

```bash
npm install passport passport-local express-session
```

### Bước 2: Cấu hình Strategy (config/passport.j)

Tạo file cấu hình riêng để code gọn gàng.

```js
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User'); // Giả sử bạn có model User
const bcrypt = require('bcryptjs'); // Dùng để so sánh password mã hóa

module.exports = function (passport) {
  // Định nghĩa chiến lược 'local'
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // 1. Tìm user trong DB
      User.findOne({ email: email })
        .then((user) => {
          if (!user) {
            // done(lỗi, user, message)
            return done(null, false, { message: 'Email chưa được đăng ký' });
          }

          // 2. So sánh password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              return done(null, user); // Thành công -> trả về user
            } else {
              return done(null, false, { message: 'Sai mật khẩu' });
            }
          });
        })
        .catch((err) => console.log(err));
    }),
  );

  // --- Cấu hình Session (Quan trọng) ---

  // Ghi id user vào session cookie
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Lấy id từ cookie -> Tìm user trong DB -> Gán vào req.user
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
```

### Bước 3: Tích hợp vào app.js

Thứ tự khai báo middleware cực kỳ quan trọng:

1. Session.
2. Passport Init.
3. Passport Session.

```js
const express = require('express');
const session = require('express-session');
const passport = require('passport');

const app = express();

// Import cấu hình Passport ở bước 2
require('./config/passport')(passport);

// Body parser (để đọc dữ liệu form)
app.use(express.urlencoded({ extended: false }));

// 1. Cấu hình Express Session
app.use(
  session({
    secret: 'secret_key_cua_ban', // Chuỗi bí mật để ký cookie
    resave: true,
    saveUninitialized: true,
  }),
);

// 2. Khởi tạo Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// ... Các routes ...
```

### Bước 4: Cách sử dụng trong Route

#### A. Route Login (POST /login)

Sử dụng **passport.authenticate** làm middleware xử lý.

```js
app.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard', // Đăng nhập đúng thì chuyển hướng về đây
    failureRedirect: '/login', // Sai thì đá về trang login
    failureFlash: true, // (Tùy chọn) Bật thông báo lỗi
  })(req, res, next);
});
```

#### B. Route Protect (Chỉ user đã login mới vào được)

Chúng ta viết một middleware đơn giản để kiểm tra.

```js
// Middleware kiểm tra
function ensureAuthenticated(req, res, next) {
  // Hàm isAuthenticated() được Passport tự động thêm vào request
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

// Áp dụng vào route
app.get('/dashboard', ensureAuthenticated, (req, res) => {
  // req.user chứa thông tin user lấy từ DeserializeUser
  res.send(`Chào mừng User: ${req.user.name}`);
});
```

#### C. Logout

```js
app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/login');
  });
});
```

## 5. Passport cho RESTful API (JWT)

**Lưu ý quan trọng**: Nếu bạn làm Backend API tách biệt với Frontend (React/Vue) hoặc Mobile App, bạn **không nên dùng Session** (Cookie). Thay vào đó, nên sử dụng **JSON Web Token (JWT)**.

Khi đó luồng sẽ thay đổi:

1. **Không dùng** **serializeUser** và **deserializeUser** (ví API thường stateless).
2. **Không dùng** **express-session**.
3. Sử dụng thư viện **passport-jwt**.
4. Khi login thành công -> Server tự tạo Token và trả về Client.
5. Client gửi Token lên ở Headere -> **passport-jwt** sẽ hứng và verify token đó.
