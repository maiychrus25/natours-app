const fs = require('fs');

const tours = fs.readFileSync(
  `${__dirname}/../dev-data/data/tours-simple.json`,
  'UTF-8',
);
const toursObj = JSON.parse(tours);

exports.deleteTour = (tourId) => {
  const newToursObj = toursObj.filter((t) => t.id != tourId);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(newToursObj),
    (err) => {
      if (err) {
        return null;
      } else {
        return deleteTour;
      }
    },
  );
};

exports.getAllTour = () => {
  return toursObj;
};

exports.getTour = (tourId) => {
  const tour = toursObj.find((t) => t.id === tourId);
  return tour;
};

exports.createTour = (data) => {
  const newId = toursObj[toursObj.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, data);

  toursObj.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(toursObj),
    (err) => {
      if (err) {
        return null;
      } else {
        return newTour;
      }
    },
  );
};

exports.updateTour = (tourId) => {
  const tourIdx = toursObj.findIndex((t) => t.id === tourId);

  const tour = toursObj.find((t) => t.id === tourId);
  const updateTour = Object.assign(tour, data);

  toursObj[tourIdx] = updateTour;

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(toursObj),
    (err) => {
      if (err) {
        return null;
      } else {
        return updateTour;
      }
    },
  );
};
