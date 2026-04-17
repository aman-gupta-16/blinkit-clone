const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User');
const HTTP_STATUS = require('../constants/httpStatus');
const MESSAGES = require('../constants/messages');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(HTTP_STATUS.UNAUTHORIZED);
    throw new Error(MESSAGES.NO_TOKEN);
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id).select('-password');

  if (!req.user) {
    res.status(HTTP_STATUS.UNAUTHORIZED);
    throw new Error(MESSAGES.USER_NOT_FOUND);
  }

  next();
});

module.exports = protect;
