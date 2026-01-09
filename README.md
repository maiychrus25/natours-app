# Bắt đầu với Express.js

Đây là hướng dẫn cơ bản để bắt đầu với Express.js, một trong những web framework phổ biến nhất cho Node.js.

## 1. Express.js là gì?

**Express.js** là một framework ứng dụng web của Node.js, được xây dựng dựa trên NodeJs nhưng ở một mức độ trừu tượng cao hơn, được thiết kế tối giản, linh hoạt và không áp đặt quy tắc. Nó cung cấp một bộ tính năng mạnh mẽ để phát triển ứng dụng web và API.

**Các tính năng chính:**

- **Routing mạnh mẽ:** Dễ dàng định nghĩa các route để xử lý các request HTTP khác nhau (GET, POST, PUT, DELETE, v.v.).
- **Middleware:** Cho phép bạn thực thi các hàm trung gian để xử lý request trước khi chúng đến được route handler cuối cùng. Điều này rất hữu ích cho việc xác thực, ghi log, nén dữ liệu, v.v.
- **Tích hợp Template Engines:** Dễ dàng kết hợp với các template engine như Pug, EJS, Handlebars để render các trang web động.
- **Hiệu suất cao:** Vì được xây dựng trên nền tảng Node.js, Express có hiệu suất rất tốt và không bị chặn (non-blocking).
- **Requests, Responses** Dễ dàng có thể xử lý các yêu cầu và phản hồi.
- **MVC** Dễ dàng tổ chức dự án theo mô hình kiến trúc MVC (model, view, control).

Về cơ bản, Express giúp bạn tổ chức ứng dụng Node.js của mình một cách có cấu trúc và dễ quản lý hơn.

---

## 2. Cài đặt và thiết lập Express

Làm theo các bước sau để tạo một ứng dụng "Hello World" với Express.

**Bước 1: Tạo thư mục dự án và khởi tạo npm**

```bash
# Tạo một thư mục mới cho dự án
mkdir my-express-app
cd my-express-app

# Khởi tạo một dự án Node.js
npm init -y
```

**Bước 2: Cài đặt Express**

```bash
# Cài đặt Express và lưu nó vào dependencies
npm install express
```

**Bước 3: Tạo file server chính (ví dụ: `app.js`)**

Tạo một file tên là `app.js` và thêm đoạn code sau:

```javascript
const express = require('express');
const app = express();
const port = 3000;

// Định nghĩa một route cho trang chủ
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Lắng nghe các request trên cổng 3000
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
```

**Bước 4: Chạy ứng dụng**

```bash
yarn add nodemon -D
# or
npm install nodemon --save-dev

yarn nodemon app.js
# or
npm nodemon app.js
```

Bây giờ, hãy mở trình duyệt và truy cập `http://localhost:3000`. Bạn sẽ thấy dòng chữ "Hello World!".

---

## 3. Thiết lập Routing cơ bản

Routing là cách một ứng dụng xác định cách phản hồi một request của client đến một endpoint cụ thể (URI) và một phương thức HTTP cụ thể (GET, POST, v.v.).

Cú pháp cơ bản của một route là:
`app.METHOD(PATH, HANDLER)`

- `app`: là một instance của Express.
- `METHOD`: là một phương thức HTTP (ví dụ: `get`, `post`, `put`).
- `PATH`: là một đường dẫn trên server.
- `HANDLER`: là hàm sẽ được thực thi khi route được khớp.

### Ví dụ về các route

```javascript
// GET request đến trang chủ
app.get('/', (req, res) => {
  res.send('Đây là trang chủ (GET request)');
});

// POST request
app.post('/users', (req, res) => {
  res.send('Tạo người dùng mới (POST request)');
});

// Route với tham số (Route Parameters)
// :id sẽ là một tham số động
app.get('/users/:id', (req, res) => {
  const userId = req.params.id;
  res.send(`Thông tin của người dùng có ID: ${userId}`);
});
```

## 4. Restful API

- **API** Stand for Application Programming Interface
- **API** Ở một cấp độ cao thì **API** là một phần mềm được phần mềm khác sử dụng để cho phép các ứng dụng giao tiếp với nhau.
- **5 nguyên tắc cần thiết để thiết kế API Restful**
  1. Separate API into logical **`resources`**
     - Phân tách API thành các phần tài nguyên logic, tài nguyên thì có thể là các đối tượng trong hệ thống, chẳng hạn là người dùng, sản phẩm, đơn hàng.v.v.
     - Example: **/tours**, **/reviews**, **/users**
  2. Expose structed **`resource-based URLs`**
     - Các URL (Uniform Resource Identifier) phải có cấu trúc dễ hiểu và mô tả rõ ràng tài nguyên mà nó đại diện. Đây là một yếu tố quan trọng giúp API dễ dàng sử dụng và duy trì.
     - Và trong URL phần API endpoint phải là các danh từ thường quy chuẩn là danh từ số nhiều, không được chứa động từ.
     - Phần động từ sẽ được phần HTTP methods chịu trách nhiệm.
     - Example:
       - BAD: **/getUser**, **/addNewUser**
       - GOOD: **GET /users**, **POST /users**, **GET /users/:id**
  3. Use **`HTTP methods (verbs)`**
     - RESTful API sử dụng các phương thức HTTP (GET, POST, PUT (PATCH), DELETE) để thực hiện các thao tác trên tài nguyên.
     - **GET**: được sử dụng để get dữ liệu.
     - **POST**: được sử dụng để tạo mới dữ liệu.
     - **PUT**: được sử dụng để cập nhập dữ liệu, và yêu cầu gửi toàn bộ dữ liệu đã được cập nhật.
     - **PATCH**: cũng được sử dụng để cập nhật dữ liệu, nhưng yêu cầu gửi một phần dữ liệu đã được thay đổi.
     - **DELETE**: được sử dụng để xoá tài nguyên.
  - Dự trên bốn method này --> CRUD đối với phía server và database (creat, read, update, delete).
  4. Send data as **`JSON (usually)`**
     - Trong RESTful API được quy định dữ liệu gưi lên server hay từ server phản hồi về phải được gửi dưới định dạng là JSON.
     - Và khi dữ liệu được phản hồi từ server về thường được Response format lại thành JSEND (JSON IN JSON) tức là kèm theo là các tiêu chí như tình trạng (status: success, error) và kèm theo data.
  5. Be **`Stateless`**
     - Khi xử lý thì không được xử lý phần trạng thái ở phía server.
     - Tức là ví dụ trạng thái người dùng hiện tại là đăng nhập hay chưa, và trang hiện tại người dùng đang truy cập là trang nào.
     - Những trạng thái như này thì cần được xử lý và lưu trữ tại bên client
     - Không nên sử lý tại server khi gửi lên server ví dụ là lấy dữ liệu cho trang 5 (trong tính năng phân trang) thì là **/page/5** server sẽ chỉ cần trả về dữ liệu cho trang 5 mà không cần phải xử lý tìm xem trang hiện tại là trang nào... những thứ đó cần được sử lý tại client.

# Hanlding Requests Method **GET**

- Sử dụng method **GET** để nhận dữ liệu từ server về.
- Cách sử dụng:

```js
// syntax: app.method('api', function hanlding routing)
app.get('/api', (req, res) => {
  // code your here
});
```

# Hanlding Requests Method **POST**

- Sử dụng method **POST** để tạo mới một bản ghi.
- Cách sử dụng tương tự như method **GET**.
- Tuy nhiên để có thể gửi dữ liệu từ client lên server thì cần middleware ở đây chính là **JSON**.
- Để có thể gửi dữ liệu sử dụng:

```js
const express = require('express');
const app = express(); // this is instance of express
app.use(express.json());
```

# Responding To URL Parameters

- Được sử dụng khi ta cần lấy dữ liệu của từng bản ghi hay là khi URL cần có một số biến hay tham số để làm việc với dữ liệu.
- Khi đó URL có dạng: **https:://example.com/movies/:id/:x** chẳng hạn để có thể lấy được biến x và biến id thì ta sử dụng **params** trong req.
- Lưu ý là đây là lấy route parameters chứ không phải là lấy query parameters như **https://example.com/api/user?id=123** khi đó để lấy được 123 thì cần phải sử dụng **req.query** chứ không dùng được **req.params**.
- Example:

```js
app.get('/user/:userId/post/:postId', (req, res) => {
  const { userId, postId } = req.params;
  res.send(`User: ${userId}, Post: ${postId}`);
});
```

# Handling PATCH Requests

- Khi muốn cập nhật dữ liệu của một bản ghi trên server hay database có thể sử dụng 2 method là **PATCH** hoặc là **PUT**.

- **PUT** là method được sử dụng để điều chỉnh tài nguyên ở đó client sẽ gửi dữ liệu của đối tượng đã được cập nhật.

- **PATCH** là một method được sử dụng để điều chỉnh tài nguyên ở đó client sẽ gửi một phần dữ liệu của đối tượng (gồm có thuộc tính và value) cái mà cần được cập nhật chứ không phải là toàn bộ tài nguyên.

- Cách sử dụng:

```js
// syntax: app.method('api', function hanlding routing)
app.patch('/api', (req, res) => {
  // code your here
});
```

# Handling DELETE Requests

- Khi muốn xoá dữ liệu của một bản ghi trên server hay cụ thể là trong database thì ta có thể sử dụng method là **DELETE**

- Cách sử dụng:

```js
// syntax: app.delete('api', function handling route)
app.delete('/api', (req, res) => {
  // code your here
});
```

# Middleware trong ExpressJS

## ✅ Khái niệm Middleware

Middleware là các hàm trung gian có quyền truy cập vào đối tượng request (`req`), response (`res`) và hàm `next()` trong vòng đời xử lý HTTP.

Mục đích: thực hiện một số công việc trước khi gửi phản hồi (response) cho client.

## 🔁 Chu trình Request - Response trong Express

Tất cả đều là middleware, kể cả router.

👉 **Quy trình hoạt động:**

1.  Request đến server.
2.  Request đi qua stack các middleware theo thứ tự được khai báo trong code.
3.  Mỗi middleware:
    - Có thể xử lý dữ liệu.
    - Gọi `next()` để chuyển sang middleware tiếp theo.
    - Hoặc kết thúc chu trình bằng `res.send()`.

## 🧱 Middleware Stack

Mỗi middleware có thể thực hiện một nhiệm vụ cụ thể như:

| STT | Chức năng Middleware   | Ví dụ                           |
| :-- | :--------------------- | :------------------------------ |
| 1   | Phân tích body request | `body-parser`, `express.json()` |
| 2   | Ghi log                | `morgan`, custom logger         |
| 3   | Thiết lập headers      | CORS, bảo mật,...               |
| 4   | Xử lý định tuyến       | Routers                         |
| 5   | Gửi phản hồi           | `res.send()`, `res.json()`      |

## 🔗 `next()` và `res.send()`

- `next()` giúp chuyển tiếp request sang middleware tiếp theo.
- `res.send()` hoặc `res.json()` là điểm kết thúc vòng đời request, gửi dữ liệu về cho client.

📌 **Lưu ý quan trọng**

- Thứ tự khai báo middleware trong code ảnh hưởng trực tiếp đến việc xử lý request.
- **Example**

```js
app.route('/api/v1/tours').get(getAllTours).post(createTour);

app.use((req, res, next) => {
  console.log('Here is Middleware');
});

app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);
```

- Trong ví dụ trên hàm middleware được khai báo sau route có 2 method là get và post nên khi thực thi thì khi người dùng truy cập vào 2 api này thì sẽ không có hàm middleware chạy
- Còn đối với app.route với 3 method dưới thì khai báo sau middleware nên việc thực thi sẽ có middleware vậy nên thứ tự code về middleware cũng trở nên quan trọng.

- Nếu không gọi `next()` hoặc không kết thúc bằng `res.send()`, request sẽ bị treo (timeout).

💡 **Tóm lại**

Express là một chuỗi các middleware xử lý request như một “pipeline”, từ lúc nhận request cho đến lúc gửi response.

```


# Params Middleware
```
