const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../models/tour.model');
const User = require('../../models/user.model');
const Review = require('../../models/review.model');

dotenv.config({ path: `${__dirname}/../../config.env` });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB).then(() => console.log('Database connection successful!'));

// READ JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'UTF-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'UTF-8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'UTF-8'));

// IMPORT DATA INTO DATABASE
const importData = async (Model, documents) => {
  try {
    // chay nhieu promise cung 1 lan
    // await Promise.all(tours.map(tour => tour => Tour.create(tour)))

    const res = await Model.create(documents, { validateBeforeSave: false });
    console.log(res);
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

// DELETE ALL DATA FROM COLLECTION
const deleteData = async (Model) => {
  try {
    const res = await Model.deleteMany();
    console.log(res);
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '--import:tours') {
  importData(Tour, tours);
} else if (process.argv[2] === '--delete:tours') {
  deleteData(Tour);
}

if (process.argv[2] === '--import:users') {
  importData(User, users);
} else if (process.argv[2] === '--delete:users') {
  deleteData(User);
}

if (process.argv[2] === '--import:reviews') {
  importData(Review, reviews);
} else if (process.argv[2] === '--delete:reviews') {
  deleteData(Review);
}
