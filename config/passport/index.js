const passport = require('passport');
const jwtStrategy = require('./jwt.strategy');

passport.use('jwt', jwtStrategy);

require('./google.strategy');

module.exports = passport;
