const mongoose = require('mongoose');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

exports.connect = () => {
  mongoose.connect(DB).then(() => {
    console.log('DB connection successfully!');
  });
};
