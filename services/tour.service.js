const Tour = require('../models/tour.model');
const Review = require('../models/review.model');
const baseService = require('./base.service');

exports.getTours = baseService.getAll(Tour); 
exports.getTour = baseService.getOne(Tour, { path: 'reviews', select: '-__v' });
exports.createTour = baseService.createOne(Tour); 
exports.updateTour = baseService.updateOne(Tour);
exports.deleteTour = baseService.deleteById(Tour); 

exports.getTourBySlug = async (slug) => {
  const tour = await Tour.findOne({ slug: slug }).populate({ path: 'reviews' });
  return tour;
}

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

exports.getToursWithin = async (distance, lat, lng, unit) => {
  const radian = (unit === 'mi' ? distance / 3963.2 : distance / 6378.1); 

  const tours = await Tour.find({
    startLocation: {
      $geoWithin: {
        $centerSphere: [[lng, lat], radian]
      }
    }
  });
  
  return tours;
};

exports.getToursDistances = async (lat, lng, unit) => {
  const mutiplier = (unit === 'mi' ? 0.000621371192 : 0.001);

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng, lat]
        },
        distanceField: 'distance',
        spherical: true,
        key: 'startLocation',
        distanceMultiplier: mutiplier
      }
    },
    {
      $project: {
        distance: 1,
        name: 1
      }
    }
  ]);

  return distances;
}

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


