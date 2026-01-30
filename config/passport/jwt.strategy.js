const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const User = require('../../models/user.model');

const jwtOptions = {
  secretOrKey: process.env.JWT_SECRET_KEY,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload, done) => {
  try {
    // 1) check type of payload
    if (payload.type !== 'access') {
      throw new Error('Invalid token type!');
    }

    // 2) check if exist user
    const user = await User.findById(payload.id);
    if (!user) {
      return done(null, false, {
        message: 'The use belonging to this token does no longer exist!',
      });
    }

    // 3) Check is user changed password after the token was issued
    // Payload cua passport da doc giai ma san iat
    if (user.isChangedPasswordAfter(payload.iat)) {
      return done(null, false, {
        message: 'User recently changed password! Please log in again.',
      });
    }

    // Success
    done(null, user);
  } catch (err) {
    done(err, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

module.exports = jwtStrategy;
