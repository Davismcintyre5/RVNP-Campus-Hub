const express = require('express');
const router = express.Router();
const uploadController = require('../../controllers/client/uploadController.js');
const requireAuth = require('../../middleware/client/requireAuth.js');
const { uploadSingle, uploadMultiple } = require('../../middleware/global/upload.js');
const { uploadRateLimiter } = require('../../middleware/global/rateLimiter.js');

router.use(requireAuth);

router.post('/single', uploadRateLimiter, uploadSingle, uploadController.uploadSingleFile);
router.post('/multiple', uploadRateLimiter, uploadMultiple, uploadController.uploadMultipleFiles);
router.delete('/', uploadController.deleteFile);

module.exports = router;