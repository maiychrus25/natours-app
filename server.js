const dotenv = require('dotenv');

dotenv.config({ path: `${__dirname}/config.env` });

// CATCH UNCAUGHT EXCEPTION
process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT EXCEPTION: Shutting down...');
  process.exit(1);
});

const app = require('./app');
const database = require('./config/database');

database.connect();

const port = process.env.PORT || 4000;

const server = app.listen(port, (err) => {
  if (err) {
    console.log('ERROR: ', err.message);
  } else {
    console.log(`app running on port ${port}!`);
  }
});

// CATCH UNHANDLED REJECTIONS
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION: Shutting down...');

  // THUC HIEN VIEC DONG SERVER NHE NHANG DE XU LY NOT NHUNG YEU CAU DANG THUC HIEN
  server.close(() => {
    process.exit(1);
  });
});
