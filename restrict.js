const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'some_secret_key';
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const token = req.headers.authorization;
  const verified = jwt.verify(token, JWT_SECRET_KEY);
  if (!verified) {
    const err = new Error('Not authorized!');
    err.code = 401;
    err.message = 'Unauthorized';
    return next(err); // This will be caught by error handler
  }
  return next();
};