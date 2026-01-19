const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../models/tour.model');

dotenv.config({ path: `${__dirname}/../../config.env` });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB).then(() => console.log('Database connection successful!'));

// READ JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'UTF-8'));

// IMPORT DATA INTO DATABASE
const importData = async () => {
  try {
    // chay nhieu promise cung 1 lan
    // await Promise.all(tours.map(tour => tour => Tour.create(tour)))

    const res = await Tour.create(tours);
    console.log(res);
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

// DELETE ALL DATA FROM COLLECTION
const deleteData = async () => {
  try {
    const res = await Tour.deleteMany();
    console.log(res);
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
