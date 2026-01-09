const tourServices = require('../services/tour.service');

exports.getAllTour = (req, res) => {
  const data = tourServices.getAllTour();
  res.status(200).json({
    status: 'success',
    results: data.length,
    data: {
      tours: data,
    },
  });
};

exports.getTour = (req, res) => {
  const data = tourServices.getTour(req.params.id * 1);

  if (data === null) {
    return res.status(404).json({
      status: 'fail',
      message: 'Tour not found!',
      data: null,
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: data,
    },
  });
};

exports.createTour = (req, res) => {
  const data = tourServices.createTour(req.body);

  res.status(201).json({
    status: 'success',
    message: 'Created a tour successfully!',
    data: {
      tour: data,
    },
  });
};

exports.updateTour = (req, res) => {
  const data = tourServices.updateTour(req.params.id * 1, req.body);

  if (data === null) {
    return res.status(404).json({
      status: 'fail',
      message: 'Tour not found!',
      data: null,
    });
  }

  res.status(200).json({
    status: 'fail',
    message: 'Updated a tour successfully!',
    data: {
      tour: data,
    },
  });
};

exports.deleteTour = (req, res) => {
  const data = tourServices.deleteTour(req.params.id * 1);

  if (data === null) {
    return res.status(404).json({
      status: 'fail',
      message: 'Error occurred while delete tour data!',
      data: null,
    });
  }

  res.status(204).json({
    status: 'success',
    message: 'Tour deleted successfully!',
    data: null,
  });
};
