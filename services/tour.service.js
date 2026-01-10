const Tour = require('../models/tour.model');

/**
 * Query for tours
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField: (desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 5)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise <QueryResult>}
 **/

exports.getAllTour = async (filter) => {
  return Tour.find(filter);
};

exports.getTour = async (tourId) => {
  // return Tour.findOne({ _id: tourId });
  return Tour.findById(tourId);
};

exports.createTour = async (data) => {
  return await Tour.create(data);
  // or

  /* try {
    const newTour = await Tour.create(data);
    return newTour;
  } catch (err) {
    throw err;
  } */
};

exports.updateTour = async (tourId, data) => {
  // return await Tour.updateOne({ _id: tourId }, data)
  return await Tour.findByIdAndUpdate(tourId, data, {
    new: true,
    runValidators: true,
  });
};

exports.deleteTour = async (tourId) => {
  await Tour.findByIdAndDelete(tourId);
};
