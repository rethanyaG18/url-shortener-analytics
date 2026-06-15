const { Router } = require('express');
const { body } = require('express-validator');
const { createUrl, getUserUrls, deleteUrl } = require('../controllers/url.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { handleValidationErrors } = require('../middleware/validate.middleware');

const router = Router();

// All URL routes require authentication
router.use(authenticate);

// POST /api/urls — create a new short URL
router.post(
  '/',
  [
    body('original_url')
      .trim()
      .notEmpty().withMessage('URL is required')
      .isURL({ protocols: ['http', 'https'], require_protocol: true })
      .withMessage('Please enter a valid URL starting with http:// or https://'),
    body('custom_alias')
      .optional({ nullable: true, checkFalsy: true })
      .trim()
      .isAlphanumeric()
      .withMessage('Custom alias must be alphanumeric')
      .isLength({ min: 3, max: 20 })
      .withMessage('Alias must be 3-20 characters'),
    body('expires_at')
      .optional({ nullable: true, checkFalsy: true })
      .isISO8601()
      .withMessage('Expiry must be a valid ISO date'),
  ],
  handleValidationErrors,
  createUrl
);

// GET /api/urls — list user's URLs
router.get('/', getUserUrls);

// DELETE /api/urls/:id — delete a URL
router.delete('/:id', deleteUrl);

module.exports = router;
