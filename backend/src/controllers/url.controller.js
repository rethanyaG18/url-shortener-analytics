const urlService = require('../services/url.service');
const { sendSuccess, sendError } = require('../utils/response');

const createUrl = async (req, res, next) => {
  try {
    const { original_url, custom_alias, expires_at } = req.body;
    const url = await urlService.createUrl({
      userId: req.user.id,
      originalUrl: original_url,
      customAlias: custom_alias || null,
      expiresAt: expires_at || null,
    });
    return sendSuccess(res, { url }, 'Short URL created', 201);
  } catch (err) {
    next(err);
  }
};

const getUserUrls = async (req, res, next) => {
  try {
    const urls = await urlService.getUserUrls(req.user.id);
    return sendSuccess(res, { urls });
  } catch (err) {
    next(err);
  }
};

const deleteUrl = async (req, res, next) => {
  try {
    await urlService.deleteUrl(req.params.id, req.user.id);
    return sendSuccess(res, {}, 'URL deleted successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = { createUrl, getUserUrls, deleteUrl };
