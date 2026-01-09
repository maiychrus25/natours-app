const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: `${__dirname}/config.env` });

const app = require('./app');
const database = require('./config/database');

database.connect();

const port = process.env.PORT || 4000;

app.listen(port, (err) => {
  if (err) {
    console.log('ERROR: ', err.message);
  } else {
    console.log(`app running on port ${port}!`);
  }
});
