const express = require('express');
const router = express.Router();
const leaderboardController = require('../../controllers/client/leaderboardController.js');
const requireAuth = require('../../middleware/client/requireAuth.js');

router.use(requireAuth);

router.get('/contributors', leaderboardController.getTopContributors);
router.get('/fans', leaderboardController.getTopFans);

module.exports = router;