const httpStatus = require('http-status');

exports.renderOverview = (req, res) => {
  res.status(httpStatus.OK).render('overview', {
    title: 'All tours'
  });
};

exports.renderTour = (req, res) => {
  res.status(httpStatus.OK).render('tour', {
    title: 'The forest hiker'
  });
};
