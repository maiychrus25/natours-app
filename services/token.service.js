const jwt = require('jsonwebtoken');
const crypto = require('crypto');

/**
 * Create a jwt token
 * @param {ObjectId} id - UserId
 * @returns {string} JWT token
 **/
const signToken = (id) => {
  return jwt.sign({ id, type: 'access' }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

/**
 * Create JWT and send it to client via cookie and response body
 * @param {Object} User - User document
 * @param {number} statusCode - HTTP status code
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 **/
exports.createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    maxAge: new Date(process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: 'strict',
  };

  if (process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true;
  }

  res.cookie('jwt', token, cookieOptions);

  // res.cookie('jwt', token, {
  //   expires: new Date(
  //     Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 + 60 + 60 * 1000,
  //   ),
  //   httpOnly: true,
  //   secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  // });

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token: token,
    data: {
      user: user,
    },
  });
};

/**
 * Create hashed token by crypto
 *  * @param {String} token
 * @returns {String} hashed token
 **/
exports.createHashedToken = (token) => {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  return hashedToken;
};
