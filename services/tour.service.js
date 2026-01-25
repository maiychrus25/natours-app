const Tour = require('../models/tour.model');
const Review = require('../models/review.model');
const APIFeatures = require('../utils/APIFeatures');
const baseService = require('./base.service');

/**
 * Query for tours
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField: (desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 5)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {QueryResult}
 **/

exports.getAllTour = async (queryString) => {
  // 1) Count total documents matching filter
  const filterObj = { ...queryString };
  const excludedFields = ['limit', 'page', 'sort', 'fields'];

  // eslint-disable-next-line arrow-body-style
  excludedFields.forEach((el) => delete filterObj[el]);

  let filterStr = JSON.stringify(filterObj);
  // eslint-disable-next-line arrow-body-style
  filterStr = filterStr.replace(/\b(lte|gte|lt|gt)\b/, (match) => `$${match}`);

  const totalDocs = await Tour.countDocuments(JSON.parse(filterStr));

  // 2) Apply features
  const features = new APIFeatures(
    Tour.find(JSON.parse(filterStr)),
    queryString,
  );
  const tours = await features.limitFields().sort().paginate().query;

  // 3) Pagination check
  const limit = queryString.limit * 1 || 5;
  const page = queryString.page * 1 || 1;

  const totalPages = Math.ceil(totalDocs / limit);
  if (page > totalPages && totalDocs > 0) {
    throw new Error('This page does not exist!');
  }

  return tours || [];
};

/**
 * Get tour by id
 * @param {ObjectId} id
 * @returns {Tour}
 **/

exports.getTour = async (tourId) => {
  // return Tour.findOne({ _id: tourId });
  return Tour.findById(tourId).populate('reviews');
};

/**
 * Create a tour
 * @param {Object} tourBody
 * @returns {Tour}
 **/
exports.createTour = baseService.createOne(Tour); 

/**
 * Update tour by id
 * @param {ObjectId} id
 * @param {Object} updateBody
 * @returns {updateTour}
 **/

exports.updateTour = baseService.updateOne(Tour);

/**
 * Delete tour by id
 * @param {ObjectId} tourId
 * @returns {null}
 **/
exports.deleteTour = baseService.deleteById(Tour); 

exports.getTourStats = async () => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        num: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: {
        avgPrice: 1,
      },
    },
    // {
    //   $match: {
    //     _id: { $ne: 'EASY' },
    //   },
    // },
  ]);

  return stats;
};

exports.getMonthlyPlan = async (year) => {
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: {
          $month: '$startDates',
        },
        numTours: { $sum: 1 },
        tours: {
          $push: '$name',
        },
      },
    },
    {
      $addFields: {
        month: '$_id',
      },
    },
    {
      $project: {
        _id: 0,
        month: 1,
        numTours: 1,
        tours: 1,
      },
    },
    {
      $sort: {
        numTours: -1,
        month: 1,
      },
    },
    {
      $limit: 12,
    },
  ]);

  return plan;
};


// HANDLE REVIEWS 
exports.getReviews = async (userId, tourId) => {
  if (!userId || !tourId) {
    throw new AppError('User ID and Tour Id are required to retrieve reviews!', httpStatus.BAD_REQUEST); 
  }

  const reviews = await Review.find({ tour: tourId, user: userId });
  return reviews;
}

exports.getReview = async (userId, tourId, reviewId) => {
  if (!userId || !tourId || !reviewId) {
    throw new AppError('User ID, Tour ID, and Review ID are required to retrieve a review!', httpStatus.BAD_REQUEST);
  }

  const review = await Review.findOne({ tour: tourId, user: userId, _id: reviewId });
  if (!review) {
    throw new AppError('Review does not exist!', httpStatus.NOT_FOUND);
  }

  return review;
}

exports.createReview = async (data) => {
  const newReview = await Review.create(data);
  return newReview;
}
