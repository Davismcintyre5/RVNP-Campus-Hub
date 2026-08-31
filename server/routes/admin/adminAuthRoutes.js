const express = require('express');
const router = express.Router();
const adminAuthController = require('../../controllers/admin/adminAuthController.js');
const { rateLimiter } = require('../../middleware/global/rateLimiter.js');

router.post('/login', rateLimiter, adminAuthController.login);
router.post('/refresh-token', adminAuthController.refreshToken);
router.post('/logout', adminAuthController.logout);

module.exports = router;