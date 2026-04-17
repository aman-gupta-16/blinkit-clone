const HTTP_STATUS = require('../constants/httpStatus');

const errorHandler = (err, req, res, next) => {
  const statusCode =
    res.statusCode && res.statusCode !== 200
      ? res.statusCode
      : HTTP_STATUS.INTERNAL_SERVER_ERROR;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

const notFound = (req, res, next) => {
  res.status(HTTP_STATUS.NOT_FOUND);
  next(new Error(`Route not found: ${req.originalUrl}`));
};

module.exports = { errorHandler, notFound };
