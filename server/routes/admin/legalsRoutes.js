const express = require('express');
const router = express.Router();
const legalsController = require('../../controllers/admin/legalsController.js');
const requireAdmin = require('../../middleware/admin/requireAdmin.js');
const auditLog = require('../../middleware/admin/auditLog.js');

router.use(requireAdmin);

router.get('/', legalsController.getAll);
router.get('/:id', legalsController.getById);
router.post('/', auditLog('CREATE_LEGAL'), legalsController.create);
router.put('/:id', auditLog('UPDATE_LEGAL'), legalsController.update);
router.delete('/:id', auditLog('DELETE_LEGAL'), legalsController.remove);

module.exports = router;