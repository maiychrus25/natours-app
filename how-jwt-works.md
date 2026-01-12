# What is JWT ?

- JWT stand for JSON Web Token.
- Là một chuẩn dùng để truyền thông tin an toàn giữa các bên, thông qua chữ ký số (digital signature).
- Một JWT gồm 3 phần cơ bản:
  - **Header**: là một số siêu dữ liệu về chính token.
  - **Payload**: là chứa dữ liệu được chuẩn bị để mã hoá, và ai cũng có thể decode và đọc.
  - **Signature**: được tạo ra bằng sự kết hợp bởi header, payload và một secret key.
- Sau đó từ ba thành phần này cấu tạo thành JWT. Sau đó JWT được gửi tới client.

## Verifying

- Sau khi client thực hiện request và gửi kèm JWT, sau đó server sẽ thực hiện xác minh bằng việc là lấy **header**, **payload** cùng với **secret key** được lưu trữ trên server tạo ra một **test signature** sau đó thực hiện compare với **signature** được tạo ra lần đầu.
- Nếu như **test signature** trùng với **signature** đầu thì quá trình xác thực thành công.
- Nếu như mà xác thực thất bại chứng tỏ rằng phần **header**, hoặc **payload** đã bị chỉnh sửa.
