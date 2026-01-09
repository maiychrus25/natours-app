const mongoose = require('mongoose');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

exports.connect = async () => {
  try {
    await mongoose.connect(DB);
    console.log('Database connection successful!');
  } catch (err) {
    console.log('ERROR: ', err);
  }
};
