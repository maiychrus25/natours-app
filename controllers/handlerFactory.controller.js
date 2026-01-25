const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');

// NOTE: REFERENCE FOR MVC (Model - View - Controller)
// exports.deleteOne = Model => catchAsync(async (req, res, next) => {
//   const doc = await Model.findByIdAndDelete(req.params.id);
//
//   if (!doc) {
//     return next(new AppError('No document found with that ID!', httpStatus.NOT_FOUND));
//   }
//
//   res.status(httpStatus.NO_CONTENT).json({
//     status: 'success',
//     data: null
//   })
// }


// NOTE: REFERENCE FOR MVCS (Model - View - Controller - Service)
exports.deleteOne = serviceFn => {
  return catchAsync(async (req, res, next) => {
    await serviceFn(req.params.id);
    
    res.status(httpStatus.NO_CONTENT).json({
      status: 'success',
      data: null,
    })
  })
}
