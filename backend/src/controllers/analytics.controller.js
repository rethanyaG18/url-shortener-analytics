const analyticsService = require('../services/analytics.service');
const { sendSuccess } = require('../utils/response');

const getAnalytics = async (req, res, next) => {
  try {
    const data = await analyticsService.getAnalytics(req.params.id, req.user.id);
    return sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
};

const getPublicAnalytics = async (req, res, next) => {
  try {
    const data = await analyticsService.getPublicAnalytics(req.params.shortCode);
    return sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
};

module.exports = { getAnalytics, getPublicAnalytics };
