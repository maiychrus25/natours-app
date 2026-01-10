const Tour = require('../models/tour.model');

/**
 * Query for tours
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField: (desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 5)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {QueryResult}
 **/

exports.getAllTour = async (filter, options) => {
  const numTours = await Tour.countDocuments(filter);

  const totalPages = Math.ceil(numTours / options.limit);
  if (options.page > totalPages) {
    throw new Error('This page does not exist!');
  }

  const skip = (options.page * 1 - 1) * options.limit;

  return Tour.find(filter)
    .select(options.fields)
    .sort(options.sortBy)
    .skip(skip)
    .limit(options.limit);
};

/**
 * Get tour by id
 * @param {ObjectId} id
 * @returns {Tour}
 **/

exports.getTour = async (tourId) => {
  // return Tour.findOne({ _id: tourId });
  return Tour.findById(tourId);
};

/**
 * Create a tour
 * @param {Object} tourBody
 * @returns {Tour}
 **/

exports.createTour = async (data) => {
  return await Tour.create(data);
};

/**
 * Update tour by id
 * @param {ObjectId} id
 * @param {Object} updateBody
 * @returns {updateTour}
 **/

exports.updateTour = async (tourId, data) => {
  // return await Tour.updateOne({ _id: tourId }, data)
  return await Tour.findByIdAndUpdate(tourId, data, {
    new: true,
    runValidators: true,
  });
};

/**
 * Delete tour by id
 * @param {ObjectId} tourId
 * @returns {null}
 **/

exports.deleteTour = async (tourId) => {
  await Tour.findByIdAndDelete(tourId);
};
