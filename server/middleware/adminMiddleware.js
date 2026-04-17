const HTTP_STATUS = require('../constants/httpStatus');
const MESSAGES = require('../constants/messages');

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  res.status(HTTP_STATUS.FORBIDDEN);
  throw new Error(MESSAGES.ADMIN_ONLY);
};

module.exports = adminOnly;
