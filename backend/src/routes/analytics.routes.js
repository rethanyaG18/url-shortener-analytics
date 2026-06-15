const { Router } = require('express');
const { getAnalytics, getPublicAnalytics } = require('../controllers/analytics.controller');
const { authenticate } = require('../middleware/auth.middleware');

const router = Router();

// GET /api/analytics/:id — authenticated analytics
router.get('/:id', authenticate, getAnalytics);

// GET /api/analytics/public/:shortCode — public analytics (bonus)
router.get('/public/:shortCode', getPublicAnalytics);

module.exports = router;
