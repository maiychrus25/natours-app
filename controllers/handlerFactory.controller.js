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
exports.getAll = serviceFn => {
  return catchAsync(async (req, res, next) => {
    // To allow for nested GET reviews on tour (hack)
    // if (req.params.tourId) req.query.tour = req.params.tourId;
    const docs = await serviceFn({ ...req.query, tour: req.params.tourId });

    res.status(httpStatus.OK).json({
      status: 'success',
      results: docs.length,
      data: {
        documents: docs
      }
    })
  })
}

exports.getOne = serviceFn => {
  return catchAsync(async (req, res, next) => {
    const doc = await serviceFn(req.params.id);

    res.status(httpStatus.OK).json({
      status: 'success',
      data: {
        document: doc,
      }
    })
  })
} 

exports.deleteOne = serviceFn => {
  return catchAsync(async (req, res, next) => {
    await serviceFn(req.params.id);
    
    res.status(httpStatus.NO_CONTENT).json({
      status: 'success',
      data: null,
    })
  })
}

exports.createOne = serviceFn => {
  return catchAsync(async (req, res, next) => {
    const doc = await serviceFn(req.body);

    res.status(httpStatus.CREATED).json({
      status: 'success',
      data: {
        document: doc,
      }
    })
  })
}

exports.updateOne = serviceFn => {
  return catchAsync (async (req, res, next) => {
    const doc = await serviceFn(req.params.id, req.body);

    res.status(httpStatus.OK).json({
      status: 'success',
      data: {
        document: doc 
      }
    })
  })
}
