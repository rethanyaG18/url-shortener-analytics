const authService = require('../services/auth.service');
const { sendSuccess, sendError } = require('../utils/response');

const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const result = await authService.signup({ name, email, password });
    return sendSuccess(res, result, 'Account created successfully', 201);
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });
    return sendSuccess(res, result, 'Login successful');
  } catch (err) {
    next(err);
  }
};

module.exports = { signup, login };
