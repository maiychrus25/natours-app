const Tour = require('../models/tour.model');

exports.deleteTour = (tourId) => {};

exports.getAllTour = () => {};

exports.getTour = (tourId) => {};

exports.createTour = async (data) => {
  // return await Tour.create(data);
  // or

  try {
    const newTour = await Tour.create(data);
    return newTour;
  } catch (err) {
    throw err;
  }
};

exports.updateTour = (tourId) => {};
