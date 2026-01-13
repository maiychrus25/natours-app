# What is JWT ?

- JWT stand for JSON Web Token.
- Là một chuẩn dùng để truyền thông tin an toàn giữa các bên, thông qua chữ ký số (digital signature).
- Một JWT gồm 3 phần cơ bản:
  - **Header**: là một số siêu dữ liệu về chính token.
  - **Payload**: là chứa dữ liệu được chuẩn bị để mã hoá, và ai cũng có thể decode và đọc.
  - **Signature**: được tạo ra bằng sự kết hợp bởi header, payload và một secret key.
- Sau đó từ ba thành phần này cấu tạo thành JWT. Sau đó JWT được gửi tới client.

# Verifying

- Sau khi client thực hiện request và gửi kèm JWT, sau đó server sẽ thực hiện xác minh bằng việc là lấy **header**, **payload** cùng với **secret key** được lưu trữ trên server tạo ra một **test signature** sau đó thực hiện compare với **signature** được tạo ra lần đầu.
- Nếu như **test signature** trùng với **signature** đầu thì quá trình xác thực thành công.
- Nếu như mà xác thực thất bại chứng tỏ rằng phần **header**, hoặc **payload** đã bị chỉnh sửa.

## Protecting Routes

- Quy trình gồm những bước như sau:
  - 1. Kiểm tra xem có token được gửi kèm không.
  - 2. Xác thực token.
  - 3. Kiểm tra xem có tồn tại user đó không.
  - 4. Nếu như user mới cập nhật mật khẩu cần check xem liệu token có tồn tài trước khi thay đổi không.

## Verify function in JWT

- **jwt.verify** là một hàm có thể sử dụng bất đồng bộ, hoặc là đồng bộ nhưng hàm này nếu sử dụng bất đồng bộ thì không thể sử dụng trực tiếp với async await do cách nó được triển khai là thông qua callback function khi thực thi xong.

```js
function asyncFunc(arg1, arg2, callback) {
  callback(err, result);
}
```

- nên không thể sử dụng trực tiếp được.
- thay vào đó có thể chuyển đổi từ callback function này thành một promise để có thể thực thi với async await.
- bằng việc sử dụng promisify nhận vào một hàm và trả về một hàm mới khi gọi sẽ trả về promise.

```js
const { promisify } = require('util');

const cur = promisify(jwt.verify);
// cur bây giờ là một promise

const decoded = await cur(token, process.env.SECRET_KEY);
```
