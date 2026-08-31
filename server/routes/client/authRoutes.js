const express = require('express');
const router = express.Router();
const authController = require('../../controllers/client/authController.js');
const { rateLimiter } = require('../../middleware/global/rateLimiter.js');

router.post('/register', rateLimiter, authController.register);
router.post('/verify-registration', rateLimiter, authController.verifyRegistration);
router.post('/login', rateLimiter, authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/forgot-password', rateLimiter, authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/logout', authController.logout);

module.exports = router;