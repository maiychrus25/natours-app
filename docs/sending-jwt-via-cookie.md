## What is it?

- Cookie về cơ bản chỉ là một đoạn văn bản nhỏ mà máy chủ có thể gửi đến máy khách.
- Sau đó, khi máy khách nhận được cookie, nó sẽ tự động lưu trữ và tự động gửi kèm cùng với tất cả các requests.

## Cách thực hiện

[!NOTE] Syntax:

```js
res.cookie(cookie_name, value, options);

// Example:
res.cookie('jwt', token, {
  maxAge: time, // this is when it expired. convert it to Date
  secure: true, // cookie sẽ chỉ được gửi trên kết nối được mã hoá, về cơ bản là https.
  httpOnly: true, // điều này sẽ giúp cookie không thể bị truy cập hoặc sử đổi bằng bất kì cách nào bởi trình duyệt, và rất giúp ích đối với các cuộc tấn công XSS Attacks.
  // httpOnly: khi set true có thể hiểu là trình duyệt nhận cookie, lưu trữ cooki và tự động gửi nó kèm với các requests.
});
```
