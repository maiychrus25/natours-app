const fs = require('fs');
const tours = fs.readFileSync(
  `${__dirname}/../dev-data/data/tours-simple.json`,
  'UTF-8',
);

exports.checkID = (req, res, next, val) => {
  if (req.params.id >= tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'INVALID ID!',
    });
  }

  next();
};

exports.checkBody = (req, res, next) => {
  if (!req.body?.name || !req.body?.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Name and Price is required!',
    });
  }

  next();
};
