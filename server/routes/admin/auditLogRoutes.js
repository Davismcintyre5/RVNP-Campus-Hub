const express = require('express');
const router = express.Router();
const auditLogController = require('../../controllers/admin/auditLogController.js');
const requireAdmin = require('../../middleware/admin/requireAdmin.js');

router.use(requireAdmin);

router.get('/', auditLogController.getAllLogs);
router.get('/admin/:adminId', auditLogController.getLogsByAdmin);

module.exports = router;