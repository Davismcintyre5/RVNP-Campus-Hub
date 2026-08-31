const express = require('express');
const router = express.Router();
const healthController = require('../../controllers/admin/healthController.js');
const requireAdmin = require('../../middleware/admin/requireAdmin.js');

router.get('/', requireAdmin, healthController.getSystemHealth);

module.exports = router;