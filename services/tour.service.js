const Tour = require('../models/tour.model');

exports.getAllTour = () => {
  return Tour.find({});
};

exports.getTour = async (tourId) => {
  // return Tour.findOne({ _id: tourId });
  return Tour.findById(tourId);
};

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
