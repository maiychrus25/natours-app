# 1. Create A local Database

- Để tạo một cơ sở dữ liệu bằng mongo shell sử dụng câu lệnh sau:

```shell
syntax: use db_name
use natours-test
```

- Khi sử dụng câu lệnh use thì nếu như db đã tồn tại thì sẽ chuyển sang sử dụng db đó.
- Còn nếu db đó chưa tồn tại thì sẽ tạo mới và chuyển sang db đó.

2. Creating documents

- Đầu tiên để tạo mới một document (bản ghi) thì cần tạo trước một collections (bảng).

```shell
syntax: db.name_collection.insertOne, db.name_collection.insertMany
db.natours-test.insertOne({ name: "Ha Giang Trekker", price: 5000, rating: 4.8 });
```

3. Querying Reading Documents

- Để truy vấn các documents trong collections thì sử dụng câu lệnh db.collection_name.find({ condition filter }).

- Trong condition filter có thể kết hợp với các toán tử như sau:
  - **$eq**: tương đương là **=**
  - **$lte**: tương đương là less than equal **<=** ngược lại với **gte**
  - **$lt**: tương đương là less than **<** ngước lại với **gt**
  - **$or**: để có thể sử dụng điều kiện hoặc **||**

```js
Atlas atlas-wryki1-shard-0 [primary] natours-test> db.tours.find({ name: { $eq: "Ha Giang Trikker" }})
[
  {
    _id: ObjectId('68d64eabb5f56739a5cebea4'),
    name: 'Ha Giang Trikker',
    price: 5000,
    rating: 4.9
  }
]
Atlas atlas-wryki1-shard-0 [primary] natours-test> db.tours.find({ price: { $lte: 500} })
[
  {
    _id: ObjectId('68d5bfd10e028aad4acebea4'),
    name: 'The Forest Hiker',
    price: 298,
    rating: 4.8
  },
  {
    _id: ObjectId('68d651f4b5f56739a5cebea5'),
    name: 'The sea Explorer',
    price: 497,
    rating: 4.8
  }
]
Atlas atlas-wryki1-shard-0 [primary] natours-test> db.tours.find({ price: { $gte: 500 }})
[
  {
    _id: ObjectId('68d64eabb5f56739a5cebea4'),
    name: 'Ha Giang Trikker',
    price: 5000,
    rating: 4.9
  },
  {
    _id: ObjectId('68d651f4b5f56739a5cebea6'),
    name: 'The Snow Adventure',
    price: 997,
    raing: 4.9,
    difficulty: 'example'
  }
]
Atlas atlas-wryki1-shard-0 [primary] natours-test> db.tours.find({ price: { $gte: 5000 }})
[
  {
    _id: ObjectId('68d64eabb5f56739a5cebea4'),
    name: 'Ha Giang Trikker',
    price: 5000,
    rating: 4.9
  }
]
Atlas atlas-wryki1-shard-0 [primary] natours-test> db.tours.find({ price: { $lte: 500 }, rating: { $gte: 4.8 }})
[
  {
    _id: ObjectId('68d5bfd10e028aad4acebea4'),
    name: 'The Forest Hiker',
    price: 298,
    rating: 4.8
  },
  {
    _id: ObjectId('68d651f4b5f56739a5cebea5'),
    name: 'The sea Explorer',
    price: 497,
    rating: 4.8
  }
]
Atlas atlas-wryki1-shard-0 [primary] natours-test> db.tours.find({ $or: [ { price: { $lte: 500 } }, { rating: { $gte: 4.8 } } ] })
[
  {
    _id: ObjectId('68d5bfd10e028aad4acebea4'),
    name: 'The Forest Hiker',
    price: 298,
    rating: 4.8
  },
  {
    _id: ObjectId('68d64eabb5f56739a5cebea4'),
    name: 'Ha Giang Trikker',
    price: 5000,
    rating: 4.9
  },
  {
    _id: ObjectId('68d651f4b5f56739a5cebea5'),
    name: 'The sea Explorer',
    price: 497,
    rating: 4.8
  }
]
Atlas atlas-wryki1-shard-0 [primary] natours-test>

# Cú pháp để có thể thực hiện chỉ định trường nào trong các documents cần được lấy ra

Atlas atlas-wryki1-shard-0 [primary] natours-test> db.tours.find({ price: { $lte: 500 }}, { name: 1 })
[
  {
    _id: ObjectId('68d5bfd10e028aad4acebea4'),
    name: 'The Forest Hiker'
  },
  {
    _id: ObjectId('68d651f4b5f56739a5cebea5'),
    name: 'The sea Explorer'
  }
]
Atlas atlas-wryki1-shard-0 [primary] natours-test> db.tours.find({ price: { $lte: 500 }}, { name: 0 })
[
  {
    _id: ObjectId('68d5bfd10e028aad4acebea4'),
    price: 298,
    rating: 4.8
  },
  {
    _id: ObjectId('68d651f4b5f56739a5cebea5'),
    price: 497,
    rating: 4.8
  }
]

```

# 3. Updating Documents

- Để có thể cật nhật giữ liệu cho một document hay nhiều documents thì cần phải thực hiện:
  - Chỉ định ra các documents cần được update.
  - Thực hiện **{ $set: { key: value }}** cặp thuộc tính cần được cập nhật

```js
Atlas atlas-wryki1-shard-0 [primary] natours-test> db.tours.updateOne({ price: { $lte: 400 }}, { $set: { price: 500 } })
{
  acknowledged: true,
  insertedId: null,
  matchedCount: 1,
  modifiedCount: 1,
  upsertedCount: 0
}
Atlas atlas-wryki1-shard-0 [primary] natours-test> db.tours.find({})
[
  {
    _id: ObjectId('68d5bfd10e028aad4acebea4'),
    name: 'The Forest Hiker',
    price: 500,
    rating: 4.8
  },
  {
    _id: ObjectId('68d64eabb5f56739a5cebea4'),
    name: 'Ha Giang Trikker',
    price: 5000,
    rating: 4.9
  },
  {
    _id: ObjectId('68d651f4b5f56739a5cebea5'),
    name: 'The sea Explorer',
    price: 497,
    rating: 4.8
  },
  {
    _id: ObjectId('68d651f4b5f56739a5cebea6'),
    name: 'The Snow Adventure',
    price: 997,
    raing: 4.9,
    difficulty: 'example'
  }
]
Atlas atlas-wryki1-shard-0 [primary] natours-test> db.tours.updateOne({ name: 'Ha Giang Trekker' }, { $set: { rating: 4.9 }})
{
  acknowledged: true,
  insertedId: null,
  matchedCount: 0,
  modifiedCount: 0,
  upsertedCount: 0
}
Atlas atlas-wryki1-shard-0 [primary] natours-test> db.tours.find()
[
  {
    _id: ObjectId('68d5bfd10e028aad4acebea4'),
    name: 'The Forest Hiker',
    price: 500,
    rating: 4.8
  },
  {
    _id: ObjectId('68d64eabb5f56739a5cebea4'),
    name: 'Ha Giang Trikker',
    price: 5000,
    rating: 4.9
  },
  {
    _id: ObjectId('68d651f4b5f56739a5cebea5'),
    name: 'The sea Explorer',
    price: 497,
    rating: 4.8
  },
  {
    _id: ObjectId('68d651f4b5f56739a5cebea6'),
    name: 'The Snow Adventure',
    price: 997,
    raing: 4.9,
    difficulty: 'example'
  }
]
Atlas atlas-wryki1-shard-0 [primary] natours-test>

# NOTE: Thuộc tính chưa tồn tại khi update thì sẽ được tự động thêm vào.
Atlas atlas-wryki1-shard-0 [primary] natours-test> db.tours.updateOne({ name: 'Ha Giang Trikker' }, { $set: { tourguide: 'T. Thuy' }})
{
  acknowledged: true,
  insertedId: null,
  matchedCount: 1,
  modifiedCount: 1,
  upsertedCount: 0
}
Atlas atlas-wryki1-shard-0 [primary] natours-test> db.tours.find()
[
  {
    _id: ObjectId('68d5bfd10e028aad4acebea4'),
    name: 'The Forest Hiker',
    price: 500,
    rating: 4.8,
    premium: true
  },
  {
    _id: ObjectId('68d64eabb5f56739a5cebea4'),
    name: 'Ha Giang Trikker',
    price: 5000,
    rating: 4.9,
    premium: true,
    tourguide: 'T. Thuy'
  },
  {
    _id: ObjectId('68d651f4b5f56739a5cebea5'),
    name: 'The sea Explorer',
    price: 497,
    rating: 4.8
  },
  {
    _id: ObjectId('68d651f4b5f56739a5cebea6'),
    name: 'The Snow Adventure',
    price: 997,
    raing: 4.9,
    difficulty: 'example'
  }
]
Atlas atlas-wryki1-shard-0 [primary] natours-test>

Atlas atlas-wryki1-shard-0 [primary] natours-test> db.tours.updateMany({ price: { $gte: 500 }, rating: { $gte: 4.8 }}, { $set: { premium: true }})
{
  acknowledged: true,
  insertedId: null,
  matchedCount: 2,
  modifiedCount: 2,
  upsertedCount: 0
}
Atlas atlas-wryki1-shard-0 [primary] natours-test> db.tours.find()
[
  {
    _id: ObjectId('68d5bfd10e028aad4acebea4'),
    name: 'The Forest Hiker',
    price: 500,
    rating: 4.8,
    premium: true
  },
  {
    _id: ObjectId('68d64eabb5f56739a5cebea4'),
    name: 'Ha Giang Trikker',
    price: 5000,
    rating: 4.9,
    premium: true
  },
  {
    _id: ObjectId('68d651f4b5f56739a5cebea5'),
    name: 'The sea Explorer',
    price: 497,
    rating: 4.8
  },
  {
    _id: ObjectId('68d651f4b5f56739a5cebea6'),
    name: 'The Snow Adventure',
    price: 997,
    raing: 4.9,
    difficulty: 'example'
  }
]
Atlas atlas-wryki1-shard-0 [primary] natours-test>

# Lưu ý: sử dụng replaceOne và replaceMany thay đổi toàn bộ document không giống như updateOne, updateMany là thay đổi thuộc tính chỉ định
Atlas atlas-wryki1-shard-0 [primary] natours-test> db.tours.replaceOne({ name: 'Ha Noi Tour' }, { city: 'HCM city', category: 'Tour', price: 500, rating: 5})
{
  acknowledged: true,
  insertedId: null,
  matchedCount: 1,
  modifiedCount: 1,
  upsertedCount: 0
}
Atlas atlas-wryki1-shard-0 [primary] natours-test> db.tours.find()
[
  {
    _id: ObjectId('68d5bfd10e028aad4acebea4'),
    name: 'The Forest Hiker',
    price: 500,
    rating: 4.8,
    premium: true
  },
  {
    _id: ObjectId('68d64eabb5f56739a5cebea4'),
    name: 'Ha Giang Trikker',
    price: 5000,
    rating: 4.9,
    premium: true,
    tourguide: 'T. Thuy'
  },
  {
    _id: ObjectId('68d651f4b5f56739a5cebea5'),
    name: 'The sea Explorer',
    price: 497,
    rating: 4.8
  },
  {
    _id: ObjectId('68d651f4b5f56739a5cebea6'),
    name: 'The Snow Adventure',
    price: 997,
    raing: 4.9,
    difficulty: 'example'
  },
  {
    _id: ObjectId('68d66339b5f56739a5cebea7'),
    city: 'HCM city',
    category: 'Tour',
    price: 500,
    rating: 5
  },
  {
    _id: ObjectId('68d66339b5f56739a5cebea8'),
    name: 'Danang tour',
    price: 100,
    rating: 1
  }
]
Atlas atlas-wryki1-shard-0 [primary] natours-test>

```

# 4. Deleting Documents

- Để thực hiện xoá documents trong Mongo thì có thể sử dụng **deleteOne** hoặc là **deleteMany**.

```js
Atlas atlas-wryki1-shard-0 [primary] natours-test> db.tours.deleteOne({ rating: { $lt: 4.8 }})
{ acknowledged: true, deletedCount: 1 }
Atlas atlas-wryki1-shard-0 [primary] natours-test> db.tours.find()
[
  {
    _id: ObjectId('68d64eabb5f56739a5cebea4'),
    name: 'Ha Giang Trikker',
    price: 5000,
    rating: 4.9,
    premium: true,
    tourguide: 'T. Thuy'
  },
  {
    _id: ObjectId('68d651f4b5f56739a5cebea5'),
    name: 'The sea Explorer',
    price: 497,
    rating: 4.8
  },
  {
    _id: ObjectId('68d651f4b5f56739a5cebea6'),
    name: 'The Snow Adventure',
    price: 997,
    raing: 4.9,
    difficulty: 'example'
  },
  {
    _id: ObjectId('68d66339b5f56739a5cebea7'),
    city: 'HCM city',
    category: 'Tour',
    price: 500,
    rating: 5
  },
  {
    _id: ObjectId('68d66339b5f56739a5cebea8'),
    name: 'Danang tour',
    price: 100,
    rating: 1
  }
]
Atlas atlas-wryki1-shard-0 [primary] natours-test> db.tours.deleteMany({ rating: { $lte: 4.8 }})
{ acknowledged: true, deletedCount: 2 }
Atlas atlas-wryki1-shard-0 [primary] natours-test> db.tours.find()
[
  {
    _id: ObjectId('68d64eabb5f56739a5cebea4'),
    name: 'Ha Giang Trikker',
    price: 5000,
    rating: 4.9,
    premium: true,
    tourguide: 'T. Thuy'
  },
  {
    _id: ObjectId('68d651f4b5f56739a5cebea6'),
    name: 'The Snow Adventure',
    price: 997,
    raing: 4.9,
    difficulty: 'example'
  },
  {
    _id: ObjectId('68d66339b5f56739a5cebea7'),
    city: 'HCM city',
    category: 'Tour',
    price: 500,
    rating: 5
  }
]

# Lưu ý: Cách để có thể xoá hết các documents trong collections
Atlas atlas-wryki1-shard-0 [primary] natours-test> db.tours.deleteMany({})

```
