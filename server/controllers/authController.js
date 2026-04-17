const asyncHandler = require('../utils/asyncHandler');
const authService = require('../services/authService');
const HTTP_STATUS = require('../constants/httpStatus');
const MESSAGES = require('../constants/messages');


const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(HTTP_STATUS.BAD_REQUEST);
    throw new Error('Please provide name, email and password');
  }

  const userData = await authService.registerUser({ name, email, password });

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: MESSAGES.REGISTER_SUCCESS,
    data: userData,
  });
});


const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(HTTP_STATUS.BAD_REQUEST);
    throw new Error('Please provide email and password');
  }

  const userData = await authService.loginUser({ email, password });

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: MESSAGES.LOGIN_SUCCESS,
    data: userData,
  });
});


const getMe = asyncHandler(async (req, res) => {
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: req.user,
  });
});

module.exports = { register, login, getMe };
