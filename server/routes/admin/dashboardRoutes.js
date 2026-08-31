const express = require('express');
const router = express.Router();
const dashboardController = require('../../controllers/admin/dashboardController.js');
const requireAdmin = require('../../middleware/admin/requireAdmin.js');

router.use(requireAdmin);

router.get('/stats', dashboardController.getStats);
router.get('/users-by-campus', dashboardController.getUsersByCampus);
router.get('/posts-by-campus', dashboardController.getPostsByCampus);

module.exports = router;