const express = require('express');
const router = express.Router();
const badgeController = require('../../controllers/client/badgeController.js');
const requireAuth = require('../../middleware/client/requireAuth.js');

router.use(requireAuth);

router.get('/', badgeController.getAllBadges);
router.get('/check', badgeController.checkMyBadges);
router.get('/user/:userId', badgeController.getUserBadges);

module.exports = router;