# How To Security Best Pratices ?

## Attack to Database:

- Đối với các cuộc tấn công vét cạn, kẻ tấn công sẽ cố gắng:
  - Thử mật khẩu liên tục cho đến khi đăng nhập được.
  - Điều này có thể làm thao tác đăng nhập bị chậm lại.
  - Do gửi request liên tục tới server.
  - Để có thể ngăn chặn vấn đề này nên sử dụng các cách sau.

- Strongly encrypt password with salt and hash (bcrypt).
- Strongly encrypt password reset tokens (SHA 256).

---

- Brute Force Attacks:
  - Use bcrypt (to make login requests slow).
  - Implement rate limiting (express-rate-limit).
  - Implement maximum login attempts.

---

## Cross-Site Scripting (XSS) Attacks

- Đối với tấn công XSS kẻ tấn công sẽ cố gắng chèn mã độc vào trang của chúng ta.
- Sau đó chạy ở phía máy khách, thậm chí máy chủ có thể xâm chiến các biến cục bộ được trữ ở local storage.

- Store JWT in HTTPOnly cookies
- Sanitize user input data
- Set special HTTP headers (helmet package)

## Denial-Of-Service (DOS) Attack

- Kẻ tấn công cố gắng gửi hàng triệu request tới server của chúng ta khiến server quá tải.
- Dẫn đến sập và để tránh được các cuộ tấn công này nên áp dụng một số cách sau:
  - Implement rate limiting (express-rate-limit).
  - Limit body payload (in body-parser).
  - Avoid evil regular expressions.

- Tránh sử dụng các biểu thức chính quy độc hại, có thể có những biểu thức chính quy độ phức được tính đến cấp độ mũ.
- Do đó cần lựa chọn các biểu thức chính quy một cách phù hợp.

## NoSQL Query Injection

- Kẻ tấn công sẽ cố gắng chèn các đoạn mã NoSQL truy vấn tới cơ sử dữ liệu (như là cố gắng thực hiện login mà không cần email, ...).
- Để tránh được kiểu tấn công này chúng ta nên áp dụng một số cách sau:
  - Use mongoose for MongoDB (because of SchemaTypes).
  - Sanitize user input data.

- Sử dụng mongoose cho MongoDB là một lựa chọn tốt bởi vì, SchemaTypes sẽ khiến cho việc dữ liệu đầu vào yêu cầu chặt chẽ hơn,
  như là kiểu dữ liệu yêu cầu, xác thực đầu vào hợp lệ.

## Other Best Practices And Suggestions for Authentication and Authorization

- Always use HTTPs.
- Create random password reset tokens with expiry dates.
- Deny access to JWT after password change.
- Dont't commit sensetive config data to Git.
- Don't send error details to clients.

- Prevent Cross-Site request Forgery (csurf pakage).
- Require re-authentication before a high-value action.
- Implement a backlist of untrusted JWT.
- Confirm user email address after first creating account.
- Keep user logged in with refresh token.
- Implement two-factor authentication.
- Prevent parameter pollution causing Uncaught Exceptions.
