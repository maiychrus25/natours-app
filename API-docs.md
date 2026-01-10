# Tours API

API này cho phép lấy danh sách các tour với các tùy chọn **lọc (filtering)**, **sắp xếp (sorting)**, **phân trang (pagination)** và **chọn field (field limiting)**.

---

## Endpoint

GET /api/tours

---

## Query Parameters

### 1️⃣ Filtering

Bạn có thể lọc theo bất kỳ field nào của Tour. Hỗ trợ cả **toán tử MongoDB**:

| Parameter    | Description                    | Example           |
| ------------ | ------------------------------ | ----------------- |
| `duration`   | Lọc theo độ dài tour (số ngày) | `duration=5`      |
| `difficulty` | Lọc theo độ khó của tour       | `difficulty=easy` |
| `price[gte]` | Giá >= giá trị                 | `price[gte]=500`  |
| `price[lte]` | Giá <= giá trị                 | `price[lte]=2000` |
| `rating[gt]` | Đánh giá > giá trị             | `rating[gt]=4.5`  |

**Ví dụ:**

GET /api/tours?duration=5&difficulty=easy&price[gte]=500

---

### 2️⃣ Sorting

Sắp xếp theo bất kỳ field nào. Format: `field:asc` hoặc `field:desc`

| Parameter | Description        | Example          |
| --------- | ------------------ | ---------------- |
| `sort`    | Sắp xếp theo field | `sort=price:asc` |

**Ví dụ:**

GET /api/tours?sort=price:desc

---

### 3️⃣ Pagination

- `page` – Trang hiện tại (default = 1)
- `limit` – Số bản ghi mỗi trang (default = 10)

**Ví dụ:**

GET /api/tours?page=2&limit=5

---

### 4️⃣ Field Limiting (Chọn field muốn hiển thị)

- `fields` – Liệt kê các field cần trả về, cách nhau bằng dấu phẩy

**Ví dụ:**

GET /api/tours?fields=name,price,duration

---

## Full Example

GET /api/tours?duration[gte]=5&difficulty=easy&price[lte]=2000&sort=price:asc&page=1&limit=5&fields=name,price,duration

### Response

```json
{
  "status": "success",
  "results": 5,
  "data": {
    "docs": [
      {
        "_id": "63f1f2d4a...",
        "name": "Amazing Safari",
        "price": 1200,
        "duration": 7
      },
      {
        "_id": "63f1f2d4b...",
        "name": "Beach Holiday",
        "price": 1500,
        "duration": 5
      }
    ],
    "totalDocs": 12,
    "limit": 5,
    "page": 1,
    "totalPages": 3,
    "hasNextPage": true,
    "hasPrevPage": false,
    "nextPage": 2,
    "prevPage": null
  }
}
```

Notes
Toán tử hỗ trợ: gte, gt, lte, lt

Sorting mặc định: createdAt:desc nếu không truyền sort

Pagination mặc định: page=1, limit=10

Nếu không truyền fields, API trả về tất cả các trường của Tour
