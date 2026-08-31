const express = require('express');
const router = express.Router();
const reportController = require('../../controllers/admin/reportController.js');
const requireAdmin = require('../../middleware/admin/requireAdmin.js');
const auditLog = require('../../middleware/admin/auditLog.js');

router.use(requireAdmin);

router.get('/', reportController.getAllReports);
router.get('/:id', reportController.getReportById);
router.put('/:id/status', auditLog('UPDATE_REPORT_STATUS'), reportController.updateReportStatus);
router.delete('/:id', auditLog('DELETE_REPORT'), reportController.deleteReport);

module.exports = router;