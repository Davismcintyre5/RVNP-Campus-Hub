const express = require('express');
const router = express.Router();
const analyticsController = require('../../controllers/admin/analyticsController.js');
const requireAdmin = require('../../middleware/admin/requireAdmin.js');

router.use(requireAdmin);

router.get('/user-growth', analyticsController.getUserGrowth);
router.get('/post-growth', analyticsController.getPostGrowth);
router.get('/engagement', analyticsController.getEngagementStats);
router.get('/active-users', analyticsController.getMostActiveUsers);
router.get('/popular-posts', analyticsController.getMostPopularPosts);
router.get('/full', analyticsController.getFullAnalytics);

module.exports = router;