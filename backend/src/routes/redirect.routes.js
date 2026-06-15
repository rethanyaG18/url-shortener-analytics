const { Router } = require('express');
const { resolveAndTrack } = require('../services/url.service');
const { parseUserAgent } = require('../utils/userAgent');

const router = Router();

// GET /:shortCode — redirect to original URL and record visit
router.get('/:shortCode', async (req, res, next) => {
  try {
    const { shortCode } = req.params;

    // Extract visitor metadata
    const uaString = req.headers['user-agent'] || '';
    const { browser, device, os } = parseUserAgent(uaString);
    const ip_address =
      req.headers['x-forwarded-for']?.split(',')[0].trim() || req.ip || 'Unknown';

    const visitData = {
      ip_address,
      browser,
      device,
      os,
    };

    const originalUrl = await resolveAndTrack(shortCode, visitData);

    // 302 redirect — ensures browser doesn't cache permanently
    return res.redirect(302, originalUrl);
  } catch (err) {
    if (err.statusCode === 404) {
      return res.status(404).json({ success: false, message: 'Short URL not found' });
    }
    if (err.statusCode === 410) {
      return res.status(410).json({ success: false, message: 'This link has expired' });
    }
    next(err);
  }
});

module.exports = router;
