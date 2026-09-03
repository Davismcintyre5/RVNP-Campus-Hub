const express = require('express');
const router = express.Router();
const aiController = require('../../controllers/admin/aiController.js');
const requireAdmin = require('../../middleware/admin/requireAdmin.js');
const requireSuperAdmin = require('../../middleware/admin/requireSuperAdmin.js');
const auditLog = require('../../middleware/admin/auditLog.js');

router.use(requireAdmin);

router.get('/settings', aiController.getSettings);
router.put('/settings', requireSuperAdmin, auditLog('UPDATE_AI_SETTINGS'), aiController.updateSettings);
router.patch('/settings', requireSuperAdmin, auditLog('UPDATE_AI_SETTINGS'), aiController.updateSettings);

module.exports = router;