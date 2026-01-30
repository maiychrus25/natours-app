# Refactor Source Code 

### Lớp Base Service
- Phụ trách các hàm hay dùng

- Example:
```js
// services/base.service.js
const AppError = require('../utils/appError');

exports.deleteById = Model => async id => {
  const doc = await Model.findByIdAndDelete(id);

  if (!doc) {
    throw new AppError('Not found', 404);
  }

  return doc;
};

```

### Lớp Model trong Service 
- Example: 

```js
// services/user.service.js
const User = require('../models/user.model');
const { deleteById } = require('./base.service');

exports.deleteUserById = deleteById(User);
```

### Lớp handlerFactory trong Controllers
```js
// controllers/handlerFactory.js
exports.deleteOne = serviceFn =>
  catchAsync(async (req, res, next) => {
    await serviceFn(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null
    });
  });
```

### Lớp Model trong Controllers
```js 
// controllers/user.controller.js
const { deleteOne } = require('./handlerFactory');
const userService = require('../services/user.service');

exports.deleteUser = deleteOne(userService.deleteUserById);
```
